import '../../global'
import 'react-native-get-random-values'
import { Account, Community, Publication, PublicationViewerStats } from "../../__generated__/graphql";
import storage from "../storage";
import { TPROFILE, TPUBLICATION, UpdateCommunitySchema } from '../../schema';
import client from '../../data/apollo';
import { GET_PUBLICATIONS, GET_MY_PROFILE, GET_PUBLICATION, GET_PUBLICATION_COMMENTS, GET_PUBLICATION_INTERACTIONS_BY_VIEWER, GET_PUBLICATION_STATS, COMMUNITY_QUERY, GET_ACCOUNT_VIEWER_STATS, ACCOUNTS_SEARCH_QUERY, GET_FOLLOW_ACCOUNT, GET_MEMBERSHIP, SEARCH_COMMUNITIES, GET_COMMUNITY_PUBLICATIONS } from '../../utils/queries';
import delegateManager from '../delegate-manager';
import { gql } from '../../__generated__';
import usernames from '../../contract/modules/usernames';

// TODO: for now we will ignore caching of quotes and anything that will not be seen directly in the home page
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

        let community: Partial<Community> | null = null
        if (publication?.community) {
            const data = await client.query({
                query: COMMUNITY_QUERY,
                variables: {
                    name: publication?.community
                }
            })

            console.log("Community Data ::", data)
            // @ts-expect-error - ignoring the type error for now
            community = data?.data?.community ?? null
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
            is_new: true, // TODO: for easier resolution in merge functions
            ...(
                community ? {
                    community
                } : type == 1 ? { community: null } : {}
            )
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

            if (community) {
                const prevCommunityPublications = client.readQuery({
                    query: GET_COMMUNITY_PUBLICATIONS,
                    variables: {
                        communityName: community.name! ?? "", // Safe to assume the community name is set
                        page: 0,
                        size: 20
                    }
                })

                client.writeQuery({
                    query: GET_COMMUNITY_PUBLICATIONS,
                    variables: {
                        communityName: community.name! ?? "", // Safe to assume the community name is set
                        page: 0,
                        size: 20
                    },
                    data: {
                        communityPublications: [{
                            ...newPub,
                            stats: {
                                comments: 0,
                                quotes: 0,
                                reactions: 0,
                                reposts: 0,
                            },
                            parent: null
                        } as any, ...prevCommunityPublications?.communityPublications ?? []]
                    }
                })
            }
            const prev = client.cache.readQuery({
                query: GET_PUBLICATIONS, variables: {
                    types: [1, 2],
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
                query: GET_PUBLICATIONS,
                variables: {
                    types: [1, 2, 4],
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
                            parent: null
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

        const existing = client.readQuery({
            query: GET_PUBLICATIONS, // TODO: not sure if this will work in instances where the publication isn;t part of the first 50
            variables: {
                types: [1, 2, 4],
                page: 0,
                size: 20
            }
        }) ?? [] as any

        const newPublications = existing.publications.filter((pub: Publication) => pub.publication_ref !== ref)

        client.writeQuery({
            query: GET_PUBLICATIONS,
            variables: {
                types: [1, 2, 4],
                page: 0,
                size: 20
            },
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

    async updateProfile(profile: TPROFILE) {
        // WE CAN SAFELY ASSUME THE DELEGATE MANAGER IS SET
        const currentProfile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        let username = currentProfile?.account?.username?.username ?? delegateManager?.username

        if (!username) {
            try {

                username = await usernames.getUsername()
            }
            catch (e) {
                // SILENTLY FAIL
                console.log("Error getting username", e, delegateManager.owner)
            }
        }

        client.writeQuery({
            query: GET_MY_PROFILE,
            data: {
                ...(currentProfile ? currentProfile : {
                }),
                account: {
                    ...(currentProfile?.account ? currentProfile.account : {}),
                    profile: {
                        ...profile,
                        __typename: "Profile"
                    },
                    username: {
                        __typename: "Username",
                        username: username ?? "_u38",
                    },
                    id: currentProfile?.account?.id ?? Date.now(),
                    __typename: "Account",
                    timestamp: currentProfile?.account?.timestamp ?? Date.now(),
                    stats: currentProfile?.account?.stats ?? {
                        __typename: "AccountStats",
                        followers: 0,
                        following: 0,
                        posts: 0,
                        comments: 0,
                        quotes: 0,
                        reactions: 0,
                        reposts: 0,
                        delegates: 0
                    },
                    address: delegateManager.owner!
                },
            },
            variables: {
                address: delegateManager.owner!
            }
        })
    }

    async removeProfile() {
        client.writeQuery({
            query: GET_MY_PROFILE,
            data: {
                account: null
            },
            variables: {
                address: delegateManager.owner!
            }
        })

    }

    async addFollow(following_address: string, search?: string) {
        const prevState = client.readQuery({
            query: GET_ACCOUNT_VIEWER_STATS,
            variables: {
                accountAddress: following_address,
                viewerAddress: delegateManager.owner!
            }
        })

        if (!prevState) {
            const queryData = client.readQuery({
                query: GET_FOLLOW_ACCOUNT,
                variables: {
                    address: following_address,
                    viewer: delegateManager.owner!
                }
            })

            if (queryData) {
                client.writeQuery({
                    query: GET_FOLLOW_ACCOUNT,
                    variables: {
                        address: following_address,
                        viewer: delegateManager.owner!
                    },
                    data: {
                        account: {
                            __typename: "Account",
                            viewer: {
                                followed: queryData.account?.viewer?.followed ?? false,
                                follows: true,
                            }
                        }
                    }
                })
            }

            return
        }
        client.writeQuery({
            query: GET_ACCOUNT_VIEWER_STATS,
            variables: {
                accountAddress: following_address,
                viewerAddress: delegateManager.owner!
            },
            data: {
                ...prevState,
                accountViewerStats: {
                    __typename: "AccountViewerStats",
                    follows: true,
                    followed: prevState?.accountViewerStats?.follows ?? false,
                }
            }
        })

        const prevFollowingAccountState = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: following_address
            }
        })

        console.log("Following Account State ::", prevFollowingAccountState)

        const prevUserAccountState = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        client.writeQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: following_address
            },
            data: {
                account: {
                    ...prevFollowingAccountState?.account,
                    // @ts-expect-error - ignoring the type error for now
                    stats: {
                        ...prevFollowingAccountState?.account?.stats,
                        followers: (prevFollowingAccountState?.account?.stats?.followers ?? 0) + 1
                    }
                }
            }
        })

        client.writeQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            },
            data: {
                account: {
                    ...prevUserAccountState?.account,
                    // @ts-expect-error - ignoring the type error for now
                    stats: {
                        ...prevUserAccountState?.account?.stats,
                        following: (prevUserAccountState?.account?.stats?.following ?? 0) + 1,
                    }
                }
            }
        })
    }

    async removeFollow(unfollowing_address: string, search?: string) {
        console.log("Searching::", search)
        const prevState = client.readQuery({
            query: GET_ACCOUNT_VIEWER_STATS,
            variables: {
                accountAddress: unfollowing_address,
                viewerAddress: delegateManager.owner!
            }
        })

        if (!prevState) {

            const queryData = client.readQuery({
                query: GET_FOLLOW_ACCOUNT,
                variables: {
                    address: unfollowing_address,
                    viewer: delegateManager.owner!
                }
            })

            if (queryData) {
                client.writeQuery({
                    query: GET_FOLLOW_ACCOUNT,
                    variables: {
                        address: unfollowing_address,
                        viewer: delegateManager.owner!
                    },
                    data: {
                        account: {
                            __typename: "Account",
                            viewer: {
                                followed: queryData.account?.viewer?.followed ?? false,
                                follows: false,
                            }
                        }
                    }
                })
            }

            return
        }

        client.writeQuery({
            query: GET_ACCOUNT_VIEWER_STATS,
            variables: {
                accountAddress: unfollowing_address,
                viewerAddress: delegateManager.owner!
            },
            data: {
                ...prevState,
                accountViewerStats: {
                    __typename: "AccountViewerStats",
                    follows: false,
                    followed: prevState?.accountViewerStats?.follows ?? false,
                }
            }
        })

        const prevFollowingAccountState = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: unfollowing_address
            }
        })

        const prevUserAccountState = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        client.writeQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: unfollowing_address
            },
            data: {
                account: {
                    ...prevFollowingAccountState?.account,
                    // @ts-expect-error - ignoring the type error for now
                    stats: {
                        ...prevFollowingAccountState?.account?.stats,
                        followers: (prevFollowingAccountState?.account?.stats?.followers ?? 0) - 1
                    }
                }
            }
        })

        client.writeQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            },
            data: {
                account: {
                    ...prevUserAccountState?.account,
                    // @ts-expect-error - ignoring the type error for now
                    stats: {
                        ...prevUserAccountState?.account?.stats,
                        following: (prevUserAccountState?.account?.stats?.following ?? 0) - 1
                    }
                }
            }
        })

    }

    async addMembership(communityName: string) {

        client.writeQuery({
            query: GET_MEMBERSHIP,
            variables: {
                communityName: communityName,
                userAddress: delegateManager.owner!
            },
            data: {
                membership: {
                    community_id: 0,
                    id: Date.now(),
                    is_active: true,
                    timestamp: Date.now(),
                    type: 2,
                    user_kid: 1,
                    __typename: "Membership",
                }
            }
        })

        const prevCommunityQuery = client.readQuery({
            query: COMMUNITY_QUERY,
            variables: {
                name: communityName
            }
        })

        if (prevCommunityQuery?.community) {
            client.writeQuery({
                query: COMMUNITY_QUERY,
                variables: {
                    name: communityName
                },
                data: {
                    community: {
                        __typename: "Community",
                        ...prevCommunityQuery.community,
                        stats: {
                            ...prevCommunityQuery.community.stats,
                            members: (prevCommunityQuery.community.stats.members ?? 0) + 1,
                            __typename: "CommunityStats"
                        }
                    }
                }
            })
        }
    }


    async removeMembership(communityName: string) {
        client.writeQuery({
            query: GET_MEMBERSHIP,
            variables: {
                communityName: communityName,
                userAddress: delegateManager.owner!
            },
            data: {
                membership: null
            }
        })

        const prevCommunityQuery = client.readQuery({
            query: COMMUNITY_QUERY,
            variables: {
                name: communityName
            }
        })

        if (prevCommunityQuery?.community) {
            client.writeQuery({
                query: COMMUNITY_QUERY,
                variables: {
                    name: communityName
                },
                data: {
                    community: {
                        __typename: "Community",
                        ...prevCommunityQuery.community,
                        stats: {
                            ...prevCommunityQuery.community.stats,
                            members: (prevCommunityQuery.community.stats.members ?? 0) - 1,
                            __typename: "CommunityStats"
                        }
                    }
                }
            })
        }
    }

    async updateCommunity(data: UpdateCommunitySchema) {
        const prevCommunityQuery = client.readQuery({
            query: COMMUNITY_QUERY,
            variables: {
                name: data.community
            }
        })

        console.log("Prev Community Query ::", prevCommunityQuery)

        if (prevCommunityQuery?.community) {
            client.writeQuery({
                query: COMMUNITY_QUERY,
                variables: {
                    name: data.community
                },
                data: {
                    community: {
                        __typename: "Community",
                        ...prevCommunityQuery.community,
                        ...data
                    }
                }
            })
        }
    }

    async changeMembershipType(communityName: string, member_address: string, type: number) {
        const prevMembershipQuery = client.readQuery({
            query: GET_MEMBERSHIP,
            variables: {
                communityName: communityName,
                userAddress: member_address
            }
        })

        if (prevMembershipQuery?.membership) {
            client.writeQuery({
                query: GET_MEMBERSHIP,
                variables: {
                    communityName: communityName,
                    userAddress: member_address
                },
                data: {
                    membership: {
                        __typename: "Membership",
                        ...prevMembershipQuery.membership,
                        type
                    }
                }
            })
        }

    }



    async createCommunity(name: string, description: string, image: string) {
        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })
        const timestamp = Date.now()
        client.writeQuery({
            query: COMMUNITY_QUERY,
            variables: {
                name
            },
            data: {
                community: {
                    __typename: "Community",
                    creator: profile?.account! as any,
                    description,
                    id: timestamp,
                    image,
                    name,
                    stats: {
                        __typename: "CommunityStats",
                        members: 1,
                        publications: 0
                    },
                    timestamp,
                    display_name: name
                }
            }
        })

        client.writeQuery({
            query: GET_MEMBERSHIP,
            variables: {
                communityName: name,
                userAddress: delegateManager.owner!
            },
            data: {
                membership: {
                    __typename: "Membership",
                    community_id: timestamp,
                    id: timestamp,
                    is_active: true,
                    timestamp,
                    type: 0,
                    user_kid: profile?.account?.id!,
                }
            }
        })

        const prevCommunitySearches = client.readQuery({
            query: SEARCH_COMMUNITIES,
            variables: {
                page: 0,
                size: 20,
                member: delegateManager.owner,
                search: ''
            }
        })


        client.writeQuery({
            query: SEARCH_COMMUNITIES,
            variables: {
                page: 0,
                size: 20,
                member: delegateManager.owner,
                search: ''
            },
            data: {
                communities: [
                    {
                        __typename: "Community",
                        description,
                        id: timestamp,
                        image,
                        name,
                        timestamp,
                        display_name: name
                    },
                    ...(prevCommunitySearches?.communities ?? [])
                ]
            }
        })
    }

    // !!! IMPORTANT !!! - this is for dev purpouses only and should never be used in production
    async nuke() {
        await client.resetStore()
    }
}

export default new LocalStore()