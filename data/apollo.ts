import { InMemoryCache, ApolloClient, Reference, defaultDataIdFromObject, FieldFunctionOptions } from "@apollo/client"
import { Publication, AccountStats, PublicationInteractionsByViewerQuery } from "../__generated__/graphql"
import { clone, cloneDeep, isNumber, isUndefined, uniqBy } from "lodash"
import ephemeralCache from "../lib/local-store/ephemeral-cache"
import config from "../config"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

function publicationMerge(_existing: Array<Reference> = [], incoming: Array<Reference> = [], options: FieldFunctionOptions) {

    const { page = 0, size = 20 } = options?.args?.pagination as { page: number, size: number } ?? {}

    const currentState = cloneDeep(_existing)
    const offset = page * size
    for (let i = 0; i < (incoming?.length ?? 0); i++) {
        const toBeAdded = incoming?.at(i)
        const indexToReplace = offset + i
        if (toBeAdded) {
            if (currentState[indexToReplace]) {
                const ref = options.readField("publication_ref", currentState[indexToReplace])
                const toBeAddedRef = options.readField("publication_ref", toBeAdded)
                const toBeAddedCached = ephemeralCache.get(`publication::${toBeAddedRef}`)
                const cached = ephemeralCache.get(`publication::${ref}`)
                if (cached == 'add') {

                    // update the list and put the new item after the cached item
                    currentState.splice(indexToReplace, 0, toBeAdded)
                    continue
                }

                if (toBeAddedCached == 'remove') {

                    continue
                }

                currentState[indexToReplace] = toBeAdded

            }
            else {
                const ref = options.readField("publication_ref", toBeAdded)
                const cached = ephemeralCache.get(`publication::${ref}`)
                if (cached == 'remove') {
                    console.log("Skipping item", ref)
                    // skip this item
                } else {
                    currentState.push(toBeAdded)
                }
            }
        }
    }

    return uniqBy(currentState, '__ref')
}

function publicationRead(existing: Array<Reference> = [], { readField, field }: FieldFunctionOptions) {
    const clone = cloneDeep(existing)
    const unsorted = clone.map((ref) => {
        const timestamp = readField("timestamp", ref) as number
        const publication_ref = readField("publication_ref", ref)

        return {
            timestamp,
            publication_ref,
            ref
        }
    })
    const sorted = uniqBy(unsorted.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)), (item) => item.publication_ref)

    const refs = sorted.map((pub) => pub.ref)

    return refs

}

function simpleMerge(existing: Array<Reference> = [], incoming: Array<Reference> = [], options: any) {
    const cloned = cloneDeep(existing)
    const offset = (options?.args?.pagination?.page ?? 0) * (options?.args?.pagination?.size ?? 20)
    for (let i = 0; i < incoming.length; i++) {
        const toBeAdded = incoming[i]
        const indexToReplace = offset + i
        if (toBeAdded) {
            if (cloned[indexToReplace]) {
                cloned[indexToReplace] = toBeAdded
            }
            else {
                cloned.push(toBeAdded)
            }
        }
    }

    return cloned
}

function simpleMergeAllowEmpty(existing: Array<Reference> = [], incoming: Array<Reference> = [], options: any) {
    const newExisting = (incoming?.length ?? 0) < (existing?.length ?? 0) ? incoming : cloneDeep(existing)

    return simpleMerge(newExisting, incoming, options)
}

const cache = new InMemoryCache({
    dataIdFromObject: (object: Record<string, any>) => {
        switch (object.__typename) {
            // case "PublicationStats": {
            //     return object.ref
            // }
            // case "PublicationViewerStats": {
            //     return object.ref
            // }
            case "Account": {
                return object.address
            }
            case "Profile": {
                return object.creator
            }
            default: {
                return defaultDataIdFromObject(object)
            }
        }
    },
    typePolicies: {
        Query: {
            fields: {
                publications: {
                    keyArgs: ["type", "address", "creator_address", "types", "reaction"], // TODO: Not sure if its creator_address or address
                    merge: publicationMerge,
                    read: publicationRead
                },
                publicationComments: {
                    keyArgs: ["ref", "pulication_ref", "sort"],
                    merge: publicationMerge,
                    read: (existing, options) => {
                        if (!existing) {
                            return existing
                        }
                        return publicationRead(existing, options)
                    }
                },
                accounts: {
                    keyArgs: ["search", "viewer"],

                    merge: publicationMerge
                },
                followers: {
                    keyArgs: ["accountAddress"],
                    merge: simpleMerge
                },
                following: {
                    keyArgs: ["accountAddress"],
                    merge: simpleMerge
                },
                communityPublications: {
                    keyArgs: ["communityName"],
                    merge: publicationMerge,
                },
                communities: {
                    keyArgs: ["search", "member"],
                    merge: publicationMerge
                },
                accountStats: {
                    keyArgs: ["accountAddress"],
                    merge(existing: AccountStats | null = null, incoming: AccountStats | null = null, options) {

                        const cache = ephemeralCache.get(`account_stats::followers::${options.args?.accountAddress}`) as number ?? 0

                        if (!existing) return incoming
                        const resultObject: Partial<AccountStats> = clone(incoming) ?? {
                            followers: 0,
                            following: 0
                        }

                        if ((incoming?.followers ?? 0) < cache) {

                            resultObject.followers = cache
                        }

                        return resultObject
                    }
                },
                communitiesSearch: {
                    keyArgs: ['memberAddress', 'search'],
                    merge: simpleMergeAllowEmpty
                },
                accountCommunities: {
                    keyArgs: ['accountAddress'],
                    merge: simpleMergeAllowEmpty
                },
                publicationInteractionsByViewer: {
                    merge(existing: PublicationInteractionsByViewerQuery['publicationInteractionsByViewer'], incoming: PublicationInteractionsByViewerQuery['publicationInteractionsByViewer'], options) {
                        const incomingClone = cloneDeep(incoming)
                        if (existing && incoming && incomingClone) {
                            const reaction = ephemeralCache.get(`interaction::reaction::${existing.ref}`)
                            if (reaction) {
                                if (reaction == 'react' && !incoming.reacted) {
                                    incomingClone.reacted = true
                                }
                                if (reaction == 'unreact' && incoming.reacted) {
                                    incomingClone.reacted = false
                                }
                            }
                            const comment = ephemeralCache.get(`interaction::comment::${existing.ref}`)
                            if (comment) {
                                if (comment == 'comment' && !incoming.commented) {
                                    incomingClone.commented = true
                                }
                                if (comment == 'uncomment' && incoming.commented) {
                                    incomingClone.commented = false
                                }
                            }
                            const repost = ephemeralCache.get(`interaction::repost::${existing.ref}`)
                            if (repost) {
                                if (repost == 'repost' && !incoming.reposted) {
                                    incomingClone.reposted = true
                                }
                                if (repost == 'unrepost' && incoming.reposted) {
                                    incomingClone.reposted = false
                                }
                            }
                            const quoted = ephemeralCache.get(`interaction::quote::${existing.ref}`)
                            if (quoted) {
                                if (quoted == 'quote' && !incoming.quoted) {
                                    incomingClone.quoted = true
                                }
                                if (quoted == 'unquote' && incoming.quoted) {
                                    incomingClone.quoted = false
                                }
                            }
                        }

                        return incomingClone
                    }
                },
                publicationStats: {
                    merge(existing: Publication['stats'], incoming: Publication['stats'], options) {
                        const incomingClone = cloneDeep(incoming)

                        if (existing && incoming && incomingClone) {
                            const reactions = ephemeralCache.get(`stats::reactions::${existing.ref}`)
                            if (!isUndefined(reactions) && isNumber(reactions)) {
                                if (reactions !== incomingClone.reactions) {
                                    incomingClone.reactions = reactions
                                }
                            }
                            const comments = ephemeralCache.get(`stats::comments::${existing.ref}`)
                            if (!isUndefined(comments) && isNumber(comments)) {
                                if (comments !== incomingClone.comments) {
                                    incomingClone.comments = comments
                                }
                            }

                            const reposts = ephemeralCache.get(`stats::reposts::${existing.ref}`)
                            if (!isUndefined(reposts) && isNumber(reposts)) {
                                if (reposts !== incomingClone.reposts) {
                                    incomingClone.reposts = reposts
                                }
                            }

                            const quotes = ephemeralCache.get(`stats::quotes::${existing.ref}`)
                            if (!isUndefined(quotes) && isNumber(quotes)) {
                                if (quotes !== incomingClone.quotes) {
                                    incomingClone.quotes = quotes
                                }
                            }
                        }
                        return incomingClone
                    }
                }
            }
        }
    }
})


const client = new ApolloClient({
    cache,
    uri: config.TRAWLER_API,

})

export default client

export const barnicleClient = new ApolloClient({
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    collectors: {
                        keyArgs: ["collection_address"],
                        merge: publicationMerge
                    }
                }
            }
        }
    }),
    uri: config.BARNICLE_API
})


export const convergenceClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: config.CONVERGENCE_URL
})

export const hermesClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: config.HERMES_API_URL
})

export const convergenceLink = new GraphQLWsLink(
    createClient({
        url: config.CONVERGENCE_URL?.replace("https", "wss") + "/subscriptions",
    }),
);

export const convergenceWebSocketClient = new ApolloClient({
    link: convergenceLink,
    cache: new InMemoryCache()
})