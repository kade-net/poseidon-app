import '../../global'
import 'react-native-get-random-values'
import { Community, Profile, Publication, SortOrder } from "../../__generated__/graphql";
import storage from "../storage";
import { TPROFILE, TPUBLICATION, UpdateCommunitySchema } from '../../schema';
import client, { barnicleClient } from '../../data/apollo';
import { GET_PUBLICATIONS, GET_MY_PROFILE, GET_PUBLICATION, GET_PUBLICATION_COMMENTS, GET_PUBLICATION_INTERACTIONS_BY_VIEWER, GET_PUBLICATION_STATS, COMMUNITY_QUERY, GET_MEMBERSHIP, SEARCH_COMMUNITIES, GET_COMMUNITY_PUBLICATIONS, POST_COMMUNITY_SEARCH, GET_RELATIONSHIP, GET_ACCOUNT_STATS, GET_ACCOUNT_COMMUNITIES } from '../../utils/queries';
import delegateManager from '../delegate-manager';
import usernames from '../../contract/modules/usernames';
import { getMutedUsers, getRemovedFromFeed } from '../../contract/modules/store-getters';
import posti from '../posti';
import { Utils } from '../../utils';
import ephemeralCache from './ephemeral-cache';

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

        ephemeralCache.set(`publication::${client_ref}`, 'add')

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
                    address: delegateManager.owner!
                } as Profile,
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
                __typename: "PublicationViewerStats" as const,
                is_manual: true
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
                ephemeralCache.set(`interaction::repost::${parent_ref}`, 'repost')
                ephemeralCache.set(`stats::reposts::${parent_ref}`, stats.reposts)

            } else if (type == 3) {
                // COMMENT
                interactions.commented = !interactions.commented
                stats.comments = (stats.comments ?? 0) + 1
                ephemeralCache.set(`interaction::comment::${parent_ref}`, 'comment')
                ephemeralCache.set(`stats::comments::${parent_ref}`, stats.comments)

                const commentQuery = client.readQuery({
                    query: GET_PUBLICATION_COMMENTS,
                    variables: {
                        publication_ref: parent_ref,
                        page: 0,
                        size: 20, // TODO: we will need to expand this
                        sort: SortOrder.Asc,
                        muted: getMutedUsers(),
                        hide: getRemovedFromFeed()
                    }
                })

                const comments = commentQuery?.publicationComments ?? []



                client.writeQuery({
                    query: GET_PUBLICATION_COMMENTS,
                    variables: {
                        publication_ref: parent_ref,
                        page: 0,
                        size: 20,
                        sort: SortOrder.Asc,
                        muted: getMutedUsers(),
                        hide: getRemovedFromFeed()
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

                ephemeralCache.set(`interaction::quote::${parent_ref}`, 'quote')
                ephemeralCache.set(`stats::quotes::${parent_ref}`, stats.reposts)
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
                        // @ts-ignore - this is for internal cache merging
                        is_new: true,
                        parent: null
                    }
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
                    size: 20,
                    muted: getMutedUsers(),
                    hide: getRemovedFromFeed()
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
                        // @ts-ignore - this is for internal cache merging
                        is_new: true,
                        parent: null
                    } 
                }
            })

            client.cache.writeQuery({
                query: GET_PUBLICATIONS,
                variables: {
                    types: [1, 2],
                    page: 0,
                    size: 20,
                    muted: getMutedUsers(),
                    hide: getRemovedFromFeed()
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

        ephemeralCache.set(`publication::${ref}`, 'remove')

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

            const interactions = {
                commented: oldInteractionsState?.commented ?? false,
                comment_refs: oldInteractionsState?.comment_refs ?? [],
                quoted: oldInteractionsState?.quoted ?? false,
                quote_refs: oldInteractionsState?.quote_refs ?? [],
                reacted: oldInteractionsState?.reacted ?? false,
                reposted: oldInteractionsState?.reposted ?? false,
                repost_refs: oldInteractionsState?.repost_refs ?? [],
                ref,
                __typename: "PublicationViewerStats" as const,
                is_manual: true
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
                ephemeralCache.set(`interaction::repost::${parent_ref}`, 'unrepost')
                ephemeralCache.set(`stats::reposts::${parent_ref}`, stats.reposts)

            } else if (type == 3) {
                // COMMENT
                interactions.commented = !interactions.commented
                stats.comments = interactions.commented ? (stats.comments ?? 0) + 1 : (stats.comments ?? 1) - 1
                ephemeralCache.set(`interaction::comment::${parent_ref}`, 'uncomment')
                ephemeralCache.set(`stats::comments::${parent_ref}`, stats.comments)
            }
            else if (type == 2) {
                // QUOTE
                interactions.quoted = !interactions.quoted
                stats.quotes = interactions.quoted ? (stats.quotes ?? 0) + 1 : (stats.quotes ?? 1) - 1
                ephemeralCache.set(`interaction::quote::${parent_ref}`, 'unquote')
                ephemeralCache.set(`stats::quotes::${parent_ref}`, stats.quotes)
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
                types: [1, 2],
                page: 0,
                size: 20,
                muted: getMutedUsers(),
                hide: getRemovedFromFeed()
            }
        }) ?? [] as any

        const newPublications = existing.publications.filter((pub: Publication) => pub.publication_ref !== ref)

        client.writeQuery({
            query: GET_PUBLICATIONS,
            variables: {
                types: [1, 2],
                page: 0,
                size: 20,
                muted: getMutedUsers(),
                hide: getRemovedFromFeed()
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

        ephemeralCache.set(`interaction::reaction::${ref}`, 'react')
        ephemeralCache.set(`stats::reactions::${ref}`, (publicationStatsQuery?.publicationStats?.reactions ?? 0) + 1)

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
                    repost_refs: oldState?.repost_refs ?? [],
                    // @ts-ignore - this is for internal cache merging
                    is_manual: true
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

        ephemeralCache.set(`interaction::reaction::${ref}`, 'unreact')
        ephemeralCache.set(`stats::reactions::${ref}`, (publicationStatsQuery?.publicationStats?.reactions ?? 1) - 1)

        client.writeQuery({
            query: GET_PUBLICATION_STATS,
            variables: {
                publication_ref: ref
            },
            data: {
                publicationStats: {
                    comments: publicationStatsQuery?.publicationStats?.comments ?? 0,
                    quotes: publicationStatsQuery?.publicationStats?.quotes ?? 0,
                    reactions: (publicationStatsQuery?.publicationStats?.reactions ?? 1) - 1,
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
                    repost_refs: oldState?.repost_refs ?? [],
                    // @ts-ignore - this is for internal cache merging
                    is_manual: true
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

                username = await usernames.getUsername() ?? ''
            }
            catch (e) {
                // SILENTLY FAIL
                console.log("Error getting username", e, delegateManager.owner)
            }
        }

        const _newProfile = {
            ...profile,
            __typename: "Profile" as const,
            bio: profile.bio ?? "",
            display_name: profile.display_name ?? "",
            pfp: profile.pfp ?? "",
            address: delegateManager.owner!
        }

        ephemeralCache.set(`lastProfileUpdate:${delegateManager.owner}`, _newProfile)

        client.writeQuery({
            query: GET_MY_PROFILE,
            data: {
                account: {
                    profile: _newProfile,
                    username: {
                        __typename: "Username",
                        username: username ?? "_u38",
                    },
                    id: currentProfile?.account?.id ?? Date.now(),
                    __typename: "Account",
                    timestamp: currentProfile?.account?.timestamp ?? Date.now(),
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
        const relationship = client.readQuery({
            query: GET_RELATIONSHIP,
            variables: {
                accountAddress: following_address,
                viewerAddress: delegateManager.owner!
            }
        })

        if (!relationship) {
            client.writeQuery({
                query: GET_RELATIONSHIP,
                variables: {
                    accountAddress: following_address,
                    viewerAddress: delegateManager.owner!
                },
                data: {
                    accountRelationship: {
                        followed: false,
                        follows: true,
                        id: Date.now()
                    }
                }
            })





        } else {
            client.writeQuery({
                query: GET_RELATIONSHIP,
                variables: {
                    accountAddress: following_address,
                    viewerAddress: delegateManager.owner!
                },
                data: {
                    accountRelationship: {
                        follows: true,
                        followed: relationship.accountRelationship?.followed ?? false,
                        id: relationship.accountRelationship?.id ?? Date.now()
                    }
                }
            })

        }

        try {
            const { data: currentAccountStats } = await client.query({
                query: GET_ACCOUNT_STATS,
                variables: {
                    accountAddress: following_address
                }

            })

            ephemeralCache.set(`account_stats::followers::${following_address}`, (currentAccountStats?.accountStats?.followers ?? 0) + 1)

            client.writeQuery({
                query: GET_ACCOUNT_STATS,
                variables: {
                    accountAddress: following_address
                },
                data: {
                    accountStats: {
                        followers: (currentAccountStats?.accountStats?.followers ?? 0) + 1,
                        following: currentAccountStats?.accountStats?.following ?? 0,
                        __typename: "AccountStats",
                        // @ts-expect-error - this is for internal cache merging
                        action: "add-follow"
                    }
                }
            })

        }
        catch (e) {
            posti.capture('add-follow', {
                error: e,

            })
        }

    }

    async removeFollow(unfollowing_address: string, search?: string) {

        const relationship = client.readQuery({
            query: GET_RELATIONSHIP,
            variables: {
                accountAddress: unfollowing_address,
                viewerAddress: delegateManager.owner!
            }
        })

        if (!relationship) {

            client.writeQuery({
                query: GET_RELATIONSHIP,
                variables: {
                    accountAddress: unfollowing_address,
                    viewerAddress: delegateManager.owner!
                },
                data: {
                    accountRelationship: {
                        followed: false, // this can later be reset 
                        follows: false,
                        id: Date.now()
                    }
                }
            })


        } else {
            client.writeQuery({
                query: GET_RELATIONSHIP,
                variables: {
                    accountAddress: unfollowing_address,
                    viewerAddress: delegateManager.owner!
                },
                data: {
                    accountRelationship: {
                        follows: false,
                        followed: relationship.accountRelationship?.followed ?? false,
                        id: relationship.accountRelationship?.id ?? Date.now()
                    }
                }
            })

        }


        try {
            const { data: currentAccountStats } = await client.query({
                query: GET_ACCOUNT_STATS,
                variables: {
                    accountAddress: unfollowing_address
                }

            })


            ephemeralCache.set(`account_stats::followers::${unfollowing_address}`, (currentAccountStats?.accountStats?.followers ?? 1) - 1)

            client.writeQuery({
                query: GET_ACCOUNT_STATS,
                variables: {
                    accountAddress: unfollowing_address
                },
                data: {
                    accountStats: {
                        followers: (currentAccountStats?.accountStats?.followers ?? 1) - 1,
                        following: currentAccountStats?.accountStats?.following ?? 0,
                        __typename: "AccountStats",
                        // @ts-expect-error - this is for internal cache merging
                        action: "remove-follow"
                    }
                }
            })

        }
        catch (e) {
            posti.capture('remove-follow', {
                error: e,

            })
        }

    }

    async addMembership(communityName: string) {

        const prevAccountCommunities = client.readQuery({
            query: GET_ACCOUNT_COMMUNITIES,
            variables: {
                accountAddress: delegateManager.owner!,
                page: 0,
                size: 20
            }
        })

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

        const query = await client.query({
            query: COMMUNITY_QUERY,
            variables: {
                name: communityName
            }
        })

        const prevCommunityQuery = query.data


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

        const prevPostCommunitySearches = client.readQuery({
            query: POST_COMMUNITY_SEARCH,
            variables: {
                memberAddress: delegateManager.owner!,
                search: ''
            }
        })

        client.writeQuery({
            query: POST_COMMUNITY_SEARCH,
            variables: {
                memberAddress: delegateManager.owner!,
                search: ''
            },
            data: {
                __typename: "Query",
                communitiesSearch: [
                    ...(
                        prevPostCommunitySearches?.communitiesSearch?.filter((x) => x.name !== communityName) ?? []
                    ),
                    {
                        description: prevCommunityQuery?.community?.description ?? "",
                        id: Date.now(),
                        image: prevCommunityQuery?.community?.image ?? "",
                        name: prevCommunityQuery?.community?.name ?? "",
                        timestamp: Date.now(),
                        display_name: prevCommunityQuery?.community?.display_name ?? "",
                        __typename: "Community"
                    }
                ]
            }
        })

        client.writeQuery({
            query: GET_ACCOUNT_COMMUNITIES,
            variables: {
                accountAddress: delegateManager.owner!,
                page: 0,
                size: 20
            },
            data: {
                accountCommunities: [
                    {
                        creator: {
                            address: 'unknown creator address',
                            id: Date.now()
                        },
                        description: prevCommunityQuery?.community?.description ?? "",
                        id: prevCommunityQuery?.community?.id ?? 1,
                        image: prevCommunityQuery?.community?.image ?? Utils.diceImage('community'),
                        name: prevCommunityQuery?.community?.name ?? '',
                        timestamp: Date.now(),
                        display_name: prevCommunityQuery?.community?.display_name,
                        hosts: [],
                        __typename: "Community"
                    },
                    ...(prevAccountCommunities?.accountCommunities?.filter((x) => x.name !== communityName) ?? [])
                ]
            }
        })


    }


    async removeMembership(communityName: string) {

        const prevAccountCommunities = client.readQuery({
            query: GET_ACCOUNT_COMMUNITIES,
            variables: {
                accountAddress: delegateManager.owner!,
                page: 0,
                size: 20
            }
        })



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

        const prevPostCommunitySearches = client.readQuery({
            query: POST_COMMUNITY_SEARCH,
            variables: {
                memberAddress: delegateManager.owner!,
                search: ''
            }
        })

        client.writeQuery({
            query: POST_COMMUNITY_SEARCH,
            variables: {
                memberAddress: delegateManager.owner!,
                search: ''
            },
            data: {
                __typename: "Query",
                communitiesSearch: [
                    ...(
                        prevPostCommunitySearches?.communitiesSearch ?? []
                    ).filter((c) => c.name !== communityName)
                ]
            }
        })


        client.writeQuery({
            query: GET_ACCOUNT_COMMUNITIES,
            variables: {
                accountAddress: delegateManager.owner!,
                page: 0,
                size: 20
            },
            data: {
                accountCommunities: prevAccountCommunities?.accountCommunities?.filter((c) => {
                    return c.name !== communityName
                }) ?? []
            }
        })

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

        const prevAccountCommunities = client.readQuery({
            query: GET_ACCOUNT_COMMUNITIES,
            variables: {
                accountAddress: delegateManager.owner!,
                page: 0,
                size: 20
            }
        })

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

        const post_community_search = client.readQuery({
            query: POST_COMMUNITY_SEARCH,
            variables: {
                search: '',
                memberAddress: delegateManager.owner!
            }
        })



        client.writeQuery({
            query: POST_COMMUNITY_SEARCH,
            variables: {
                search: '',
                memberAddress: delegateManager.owner!
            },
            data: {
                communitiesSearch: [
                    {
                        __typename: "Community",
                        description,
                        id: timestamp,
                        image,
                        name,
                        timestamp,
                        display_name: name
                    },
                    ...(post_community_search?.communitiesSearch ?? [])
                ]
            }
        })

        client.writeQuery({
            query: GET_ACCOUNT_COMMUNITIES,
            variables: {
                accountAddress: delegateManager.owner!,
                page: 0,
                size: 20
            },
            data: {
                accountCommunities: [
                    ...(prevAccountCommunities?.accountCommunities ?? []),
                    {
                        creator: {
                            address: delegateManager.owner!,
                            id: Date.now()
                        },
                        description,
                        image,
                        name,
                        id: timestamp,
                        timestamp,
                        display_name: name,
                        hosts: [],
                        __typename: "Community"
                    }
                ]
            }
        })

    }

    // !!! IMPORTANT !!! - this is for dev purpouses only and should never be used in production
    async nuke() {
        await client.clearStore()
        await barnicleClient.clearStore()
    }
}

export default new LocalStore()