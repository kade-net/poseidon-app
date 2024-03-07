import '../../global'
import 'react-native-get-random-values'
import { Publication, PublicationViewerStats } from "../../__generated__/graphql";
import storage from "../storage";
import { TPUBLICATION } from '../../schema';
import client from '../../data/apollo';
import { GET_HOME_FEED, GET_MY_PROFILE, GET_PUBLICATION, GET_PUBLICATION_COMMENTS, GET_PUBLICATION_INTERACTIONS_BY_VIEWER, GET_PUBLICATION_STATS } from '../../utils/queries';
import delegateManager from '../delegate-manager';
import { gql } from '../../__generated__';

interface PUB {
    publication: TPUBLICATION | null,
    timestamp: number,
    type: number,
    parent_ref: string
    current_count: number
}

interface REACTION {
    reaction: number,
    new_count: number
}

function getLast(arr: Array<PUB>, type: number) {
    const last = arr.filter((pub) => pub.type === type).sort((a, b) => b.timestamp - a.timestamp)
    return last[0] ?? null

}

const PUBLICATION_FRAGMENT = gql(/* GraphQL */`
fragment NewPublication on Publication {
    id
    timestamp
    content
    creator {
        profile {
            display_name
            pfp
            bio
        }
        username {
            username
        }
        id
        address
    }
    stats {
        comments
        quotes
        reposts
        reactions
    }
    publication_ref
}
`)

class LocalStore {

    constructor() {

    }

    async getPublications() {
        const stored = await storage.getAllDataForKey("publications")
        if (stored) {
            return stored
        } else {
            return []
        }
    }

    async addPublication(publication: TPUBLICATION | null, type: number, parent_ref: string, client_ref: string, current_count?: number) {

        let profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })
        if (!profile) {
            const data = await client.query({
                query: GET_MY_PROFILE,
                variables: {
                    address: delegateManager.owner!
                }
            })
            profile = data.data
        }
        const timestamp = new Date().getTime()

        const newPub = {
            content: publication,
            creator: {
                profile: {
                    display_name: profile?.account?.profile?.display_name,
                    pfp: profile?.account?.profile?.pfp,
                    bio: profile?.account?.profile?.bio,
                } as any,
                username: {
                    username: profile?.account?.username?.username!
                } as any,
                id: profile?.account?.id!,
                address: delegateManager.owner!,
            },
            id: timestamp,
            publication_ref: client_ref,
            timestamp,
            type,
            __typename: "Publication" as const,
            is_new: true // TODO: for easier resolution in merge functions
        }

        if (type !== 1) {
            const currentPublicationInteractions = client.readQuery({
                query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
                variables: {
                    address: delegateManager.owner!,
                    ref: parent_ref
                }
            })

            const oldInteractionsState = currentPublicationInteractions?.publicationInteractionsByViewer

            const interactions = {
                commented: oldInteractionsState?.commented ?? false,
                comment_refs: oldInteractionsState?.comment_refs ?? [],
                quoted: oldInteractionsState?.quoted ?? false,
                quote_refs: oldInteractionsState?.quote_refs ?? [],
                reacted: oldInteractionsState?.reacted ?? false,
                reposted: oldInteractionsState?.reposted ?? false,
                repost_refs: oldInteractionsState?.repost_refs ?? [],
                ref: parent_ref,
                __typename: "PublicationViewerStats" as const
            }

            const publicationStatsQuery = client.readQuery({
                query: GET_PUBLICATION_STATS,
                variables: {
                    publication_ref: parent_ref
                }
            })

            const oldStats = publicationStatsQuery?.publicationStats

            const stats = {
                comments: oldStats?.comments ?? 0,
                quotes: oldStats?.quotes ?? 0,
                reactions: oldStats?.reactions ?? 0,
                reposts: oldStats?.reposts ?? 0,
                ref: parent_ref,
                __typename: "PublicationStats" as const
            }

            if (type == 4) {
                // REPOST
                interactions.reposted = !interactions.reposted
                interactions.repost_refs = [client_ref]
                stats.reposts = (stats.reposts ?? 0) + 1

            } else if (type == 3) {
                // COMMENT
                interactions.commented = !interactions.commented
                stats.comments = (stats.comments ?? 0) + 1

                const commentQuery = client.readQuery({
                    query: GET_PUBLICATION_COMMENTS,
                    variables: {
                        publication_ref: parent_ref,
                        page: 0,
                        size: 20 // TODO: we will need to expand this
                    }
                })

                const comments = commentQuery?.publicationComments ?? []



                client.writeQuery({
                    query: GET_PUBLICATION_COMMENTS,
                    variables: {
                        publication_ref: parent_ref,
                        page: 0,
                        size: 20
                    },
                    data: {
                        publicationComments: [newPub, ...comments]
                    }
                })



            }
            else if (type == 2) {
                // QUOTE
                interactions.quoted = !interactions.quoted
                stats.quotes = (stats.quotes ?? 0) + 1
                interactions.quote_refs = [client_ref]
            }

            client.writeQuery({
                query: GET_PUBLICATION,
                variables: {
                    postRef: client_ref
                },
                data: {
                    publication: {
                        ...newPub,
                        __typename: "Publication" as const,
                        stats: {
                            comments: 0,
                            quotes: 0,
                            reactions: 0,
                            reposts: 0,
                        },
                        is_new: true
                    } as any
                }
            })


            client.writeQuery({
                query: GET_PUBLICATION_STATS,
                variables: {
                    publication_ref: parent_ref
                },
                data: {
                    publicationStats: stats
                }
            })

            client.writeQuery({
                query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
                variables: {
                    address: delegateManager.owner!,
                    ref: parent_ref
                },
                data: {
                    publicationInteractionsByViewer: interactions
                }
            })

            return
        }


        try {
            const prev = client.cache.readQuery({
                query: GET_HOME_FEED, variables: {
                    type: 1,
                    page: 0,
                    size: 20
                }
            }) ?? [] as any

            client.writeQuery({
                query: GET_PUBLICATION,
                variables: {
                    postRef: client_ref
                },
                data: {
                    publication: {
                        ...newPub,
                        __typename: "Publication" as const,
                        stats: {
                            comments: 0,
                            quotes: 0,
                            reactions: 0,
                            reposts: 0,
                        },
                        is_new: true
                    } as any
                }
            })

            client.cache.writeQuery({
                query: GET_HOME_FEED,
                variables: {
                    type: 1,
                    page: 0,
                    size: 20
                },
                data: {
                    publications: [
                        {
                            ...newPub,
                            stats: {
                                comments: 0,
                                quotes: 0,
                                reactions: 0,
                                reposts: 0,
                            },
                        },
                        ...prev.publications
                    ]
                }
            })
        }
        catch (e) {
            console.log("Error adding publication to cache", e)
        }




    }

    async removePublication(ref: string, type: number, parent_ref?: string) {

        if (type !== 1) {

            if (!parent_ref) {
                return
            }

            const currentPublicationInteractions = client.readQuery({
                query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
                variables: {
                    address: delegateManager.owner!,
                    ref: parent_ref
                }
            })

            const oldInteractionsState = currentPublicationInteractions?.publicationInteractionsByViewer
            console.log("OLD INTERACTIONS ", oldInteractionsState)
            const interactions = {
                commented: oldInteractionsState?.commented ?? false,
                comment_refs: oldInteractionsState?.comment_refs ?? [],
                quoted: oldInteractionsState?.quoted ?? false,
                quote_refs: oldInteractionsState?.quote_refs ?? [],
                reacted: oldInteractionsState?.reacted ?? false,
                reposted: oldInteractionsState?.reposted ?? false,
                repost_refs: oldInteractionsState?.repost_refs ?? [],
                ref,
                __typename: "PublicationViewerStats" as const
            }

            const publicationStatsQuery = client.readQuery({
                query: GET_PUBLICATION_STATS,
                variables: {
                    publication_ref: parent_ref
                }
            })

            const oldStats = publicationStatsQuery?.publicationStats

            const stats = {
                comments: oldStats?.comments ?? 0,
                quotes: oldStats?.quotes ?? 0,
                reactions: oldStats?.reactions ?? 0,
                reposts: oldStats?.reposts ?? 0,
                ref,
                __typename: "PublicationStats" as const
            }

            if (type == 4) {
                // REPOST
                interactions.reposted = !interactions.reposted
                interactions.repost_refs = interactions.repost_refs.filter((r) => r !== ref)
                stats.reposts = interactions.reposted ? (stats.reposts ?? 0) + 1 : (stats.reposts ?? 1) - 1
                console.log("NEW INTERACTIONS ", interactions)

            } else if (type == 3) {
                // COMMENT
                interactions.commented = !interactions.commented
                stats.comments = interactions.commented ? (stats.comments ?? 0) + 1 : (stats.comments ?? 1) - 1
            }
            else if (type == 2) {
                // QUOTE
                interactions.quoted = !interactions.quoted
                stats.quotes = interactions.quoted ? (stats.quotes ?? 0) + 1 : (stats.quotes ?? 1) - 1
            }

            client.writeQuery({
                query: GET_PUBLICATION_STATS,
                variables: {
                    publication_ref: parent_ref
                },
                data: {
                    publicationStats: stats
                }
            })

            client.writeQuery({
                query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
                variables: {
                    address: delegateManager.owner!,
                    ref: parent_ref
                },
                data: {
                    publicationInteractionsByViewer: interactions
                }
            })

            return

        }

        const existing = client.readQuery({ query: GET_HOME_FEED }) ?? [] as any

        const newPublications = existing.publications.filter((pub: Publication) => pub.publication_ref !== ref)

        client.writeQuery({
            query: GET_HOME_FEED,
            data: {
                publications: newPublications
            }
        })
    }

    async addReactedToPublication(ref: string, reaction: number = 1) {
        const currentPublicationInteractions = client.readQuery({
            query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
            variables: {
                address: delegateManager.owner!,
                ref
            }
        })

        const publicationStatsQuery = client.readQuery({
            query: GET_PUBLICATION_STATS,
            variables: {
                publication_ref: ref
            }
        })

        client.writeQuery({
            query: GET_PUBLICATION_STATS,
            variables: {
                publication_ref: ref
            },
            data: {
                publicationStats: {
                    comments: publicationStatsQuery?.publicationStats?.comments ?? 0,
                    quotes: publicationStatsQuery?.publicationStats?.quotes ?? 0,
                    reactions: (publicationStatsQuery?.publicationStats?.reactions ?? 0) + 1,
                    reposts: publicationStatsQuery?.publicationStats?.reposts ?? 0,
                    ref: publicationStatsQuery?.publicationStats?.ref ?? ref,
                    __typename: "PublicationStats"
                }
            }
        })

        const oldState = currentPublicationInteractions?.publicationInteractionsByViewer

        client.writeQuery({
            query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
            variables: {
                address: delegateManager.owner!,
                ref
            },
            data: {
                publicationInteractionsByViewer: {
                    __typename: "PublicationViewerStats",
                    commented: oldState?.commented ?? false,
                    comment_refs: oldState?.comment_refs ?? [],
                    quoted: oldState?.quoted ?? false,
                    quote_refs: oldState?.quote_refs ?? [],
                    reacted: true,
                    ref: oldState?.ref ?? ref,
                    reposted: oldState?.reposted ?? false,
                    repost_refs: oldState?.repost_refs ?? []
                }
            }
        })
    }

    async removeReactedToPublication(ref: string) {

        const publicationStatsQuery = client.readQuery({
            query: GET_PUBLICATION_STATS,
            variables: {
                publication_ref: ref
            }
        })

        const currentPublicationInteractions = client.readQuery({
            query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
            variables: {
                address: delegateManager.owner!,
                ref
            }
        })

        const oldState = currentPublicationInteractions?.publicationInteractionsByViewer

        client.writeQuery({
            query: GET_PUBLICATION_STATS,
            variables: {
                publication_ref: ref
            },
            data: {
                publicationStats: {
                    comments: publicationStatsQuery?.publicationStats?.comments ?? 0,
                    quotes: publicationStatsQuery?.publicationStats?.quotes ?? 0,
                    reactions: (publicationStatsQuery?.publicationStats?.reactions ?? 0) - 1,
                    reposts: publicationStatsQuery?.publicationStats?.reposts ?? 0,
                    ref: publicationStatsQuery?.publicationStats?.ref ?? ref,
                    __typename: "PublicationStats"
                }
            }
        })

        client.writeQuery({
            query: GET_PUBLICATION_INTERACTIONS_BY_VIEWER,
            variables: {
                address: delegateManager.owner!,
                ref
            },
            data: {
                publicationInteractionsByViewer: {
                    __typename: "PublicationViewerStats",
                    commented: oldState?.commented ?? false,
                    comment_refs: oldState?.comment_refs ?? [],
                    quoted: oldState?.quoted ?? false,
                    quote_refs: oldState?.quote_refs ?? [],
                    reacted: false,
                    ref: oldState?.ref ?? ref,
                    reposted: oldState?.reposted ?? false,
                    repost_refs: oldState?.repost_refs ?? []
                }
            }
        })

    }


    async getPublicationLocalStats(publication_ref: string) {
        const stats = {
            quote_count: 0,
            quoted: false,
            comment_count: 0,
            commented: false,
            repost_count: 0,
            reposted: false,
            reactions: 0,
            reacted: false
        }
        try {
            const userSavedPublications = await storage.getAllDataForKey<PUB>("publications")
            const children = userSavedPublications.filter((pub) => pub.parent_ref === publication_ref)
            const quote = getLast(children, 2)
            const comment = getLast(children, 3)
            const repost = getLast(children, 4)

            if (quote) {
                stats.quoted = true
                stats.quote_count = quote.current_count
            }

            if (comment) {
                stats.commented = true
                stats.comment_count = comment.current_count
            }

            if (repost) {
                stats.reposted = true
                stats.repost_count = repost.current_count
            }




        }
        catch (e) {
            // Possibly a not found error
        }

        try {
            const reaction = await storage.load({
                key: "reactions",
                id: publication_ref
            })
            stats.reacted = true
            stats.reactions = reaction.reaction
        }
        catch (e) {
            // Possibly a not found error
        }

        return stats
    }



    // !!! IMPORTANT !!! - this is for dev purpouses only and should never be used in production
    async nuke() {
        await storage.clearMapForKey("publications")
        await storage.clearMapForKey("likedPublications")
        await storage.clearMapForKey("repostedPublications")
        await storage.clearMapForKey("quotedPublications")
        await storage.clearMapForKey("commentedPublications")
    }
}

export default new LocalStore()