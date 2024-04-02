import { InMemoryCache, ApolloClient, Reference, defaultDataIdFromObject, FieldFunctionOptions } from "@apollo/client"
import { Publication } from "../__generated__/graphql"
import { cloneDeep, uniqBy } from "lodash"

function publicationMerge(_existing: Array<Reference> = [], incoming: Array<Reference> = [], options: FieldFunctionOptions) {

    const { page = 0, size = 20 } = options?.args?.pagination as { page: number, size: number } ?? {}

    const currentState = cloneDeep(_existing)
    const offset = page * size
    for (let i = 0; i < (incoming?.length ?? 0); i++) {
        const toBeAdded = incoming?.at(i)
        const indexToReplace = offset + i
        if (toBeAdded) {
            if (currentState[indexToReplace]) {
                const is_new = options.readField("is_new", currentState[indexToReplace])
                if (!is_new) {
                    currentState[indexToReplace] = toBeAdded
                }
            }
            else {
                currentState.push(toBeAdded)
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

const cache = new InMemoryCache({
    dataIdFromObject: (object: Record<string, any>) => {
        switch (object.__typename) {
            case "PublicationStats": {
                return object.ref
            }
            case "PublicationViewerStats": {
                return object.ref
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
                    keyArgs: ["ref", "pulication_ref"],
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
                }
            }
        }
    }
})


const client = new ApolloClient({
    cache,
    uri: "https://trawler-production.up.railway.app",

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
    uri: "https://barnicle-new-staging.up.railway.app"
})