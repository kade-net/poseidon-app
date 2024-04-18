import { gql } from "../__generated__";


export const GET_PUBLICATIONS = gql(/* GraphQL */`
    query Publications($page: Int!, $size: Int!, $type: Int, $address: String, $types: [Int!], $reaction: Int, $hide: [String!], $muted: [Int!]){
        publications(pagination: { page: $page, size: $size }, type: $type, creator_address: $address, types: $types, reaction: $reaction, hide: $hide, muted: $muted) {
            __typename
            id,
            timestamp
            content
            type
            stats {
                comments
                quotes
                reposts
                reactions
            }
            creator {
                address
                profile {
                    creator
                    pfp
                    bio
                    display_name
                }
                username {
                    username
                }
                id
            },
            publication_ref,
            parent {
                __typename
                id,
                timestamp
                content
                type
                creator {
                    address
                    profile {
                        creator
                        pfp
                        bio
                        display_name
                    }
                    username {
                        username
                    }
                    id
                },
                publication_ref,
                stats {
                    comments
                    quotes
                    reposts
                    reactions
                }
            }
            community {
                name
                image
            }
        }
    }
`)


export const GET_MY_PROFILE = gql(/* GraphQL */`
    query MyProfile($address: String!) {
    account(address: $address) {
        id
        address
        profile {
            creator
            display_name
            bio
            pfp
        }
        username {
            username
        }
        timestamp
    }
}
`)

export const GET_ACCOUNT_STATS = gql(/* GraphQL */`
    query AccountStats($accountAddress: String!) {
        accountStats(accountAddress: $accountAddress) {
            followers
            following
        }
    }
`)

export const GET_ACCOUNT_VIEWER_STATS = gql(/* GraphQL */`
    query AccountViewerStats($accountAddress: String!, $viewerAddress: String!) {
    accountViewerStats(
        accountAddress: $accountAddress
        viewerAddress: $viewerAddress
    ) {
        id
        follows
        followed
    }
}
`)


export const GET_PUBLICATION = gql(/* GraphQL */`
    query Publication($postRef: String!){
        publication(ref: $postRef){
            __typename
            id,
                timestamp
                content
                stats {
                    comments
                    quotes
                    reposts
                    reactions
                }
                creator {
                    address
                    profile {
                        creator
                        pfp
                        bio
                        display_name
                    }
                    username {
                        username
                    }
                    id
                },
                publication_ref
                parent {
                    __typename
                    id,
                    timestamp
                    content
                    type
                    creator_id
                    creator {
                        address
                        profile {
                            creator
                            pfp
                            bio
                            display_name
                        }
                        username {
                            username
                        }
                        id
                    },
                    publication_ref,
                    stats {
                        comments
                        quotes
                        reposts
                        reactions
                    }
                }
        }
    }
`)

export const GET_PUBLICATION_STATS = gql(/* GraphQL */`
    query PublicationStats($publication_ref: String!){
        publicationStats(ref: $publication_ref) {
        __typename
        reposts
        quotes
        comments
        reactions
        ref
    }
    }
`)


export const GET_PUBLICATION_INTERACTIONS_BY_VIEWER = gql(/* GraphQL */`
    query PublicationInteractionsByViewer($ref: String!, $address: String!){
        publicationInteractionsByViewer(ref: $ref , address: $address) {
            __typename
            reacted
            quoted
            quote_refs
            commented
            comment_refs
            reposted
            repost_refs
            ref
        }
    }
`)


export const GET_PUBLICATION_COMMENTS = gql(/* GraphQL */`
    query PublicationComments($publication_ref: String!, $page: Int!, $size: Int!, $hide: [String!], $muted: [Int!]) {
        publicationComments(ref: $publication_ref, pagination: { page: $page, size: $size }, hide: $hide, muted: $muted) {
            id
            content
            type
            timestamp
            publication_ref
            creator {
                address
                profile {
                    creator
                    pfp
                    bio
                    display_name
                }
                username {
                    username
                }
                id
            }
        }
    }
`)


export const SEARCH_COMMUNITIES = gql(/* GraphQL */`
    query Communities($search: String, $page: Int!, $size: Int!, $member: String) {
        communities(search: $search, pagination: {page: $page, size: $size}, memberAddress: $member) {
            id
            name
            description
            image
            timestamp
            display_name
        }
    }
`)


export const COMMUNITY_QUERY = gql(/* GraphQL */`
    query Community($name: String!){
        community(name: $name) {
            id
            name
            description
            image
            timestamp
            display_name
            creator {
                address
                username {
                    username
                }        
            } 
            stats {
                members
                publications
            }
        }
    }
`)


export const GET_COMMUNITY_PUBLICATIONS = gql(/* GraphQL */`
    query CommunityPublications($page: Int!, $size: Int!, $communityName: String!, $hide: [String!], $muted: [Int!]) {
        communityPublications(
            pagination: { page: $page, size: $size }
            communityName: $communityName,
            hide: $hide,
            muted: $muted
        ) {
            __typename
            id
            timestamp
            content
            type
            stats {
                comments
                quotes
                reposts
                reactions
            }
            creator {
                address
                profile {
                    creator
                    pfp
                    bio
                    display_name
                }
                username {
                    username
                }
                id
            }
            publication_ref
            parent {
                __typename
                id
                timestamp
                content
                type
                creator {
                    address
                    profile {
                        creator
                        pfp
                        bio
                        display_name
                    }
                    username {
                        username
                    }
                    id
                }
                publication_ref
                stats {
                    comments
                    quotes
                    reposts
                    reactions
                }
            }
            community {
                name
                image
            }
        }
    }

`)


export const GET_MEMBERSHIP = gql(/* GraphQL */`
    query Membership ($communityName: String!, $userAddress: String!) {
        membership(communityName: $communityName, userAddress: $userAddress) {
            id
            community_id 
            type 
            user_kid
            timestamp
            is_active
        }
    }
`)


export const ACCOUNTS_SEARCH_QUERY = gql(/* GraphQL */`
    query Accounts($search: String, $page: Int!, $size: Int!) {
        accounts(search: $search, pagination: {page: $page, size: $size}) {
            id
            address
            timestamp
            profile {
                creator
                pfp
                bio
                display_name
            }
            username {
                username
            }
        }
    }
`)


export const GET_FOLLOW_ACCOUNT = gql(/* GraphQL */`
    query FollowAccount($address: String!, $viewer: String!) {
        account(address: $address) {
            viewer(address: $viewer) {
                followed
                follows
                id
            }
        }
    }
`)

export const GET_RELATIONSHIP = gql(/* GraphQL */`
    query AccountRelationship($viewerAddress: String!, $accountAddress: String!) {
        accountRelationship(viewerAddress: $viewerAddress, accountAddress: $accountAddress) {
            id
            follows
            followed
        }
    }
`)

export const GET_ACCOUNT_FOLLOWERS = gql(/* GraphQL */`
    query Followers($accountAddress: String!, $page: Int!, $size: Int!) {
        followers(
            accountAddress: $accountAddress
            pagination: { page: $page, size: $size }
        ) {
            address
            profile {
                creator
                pfp
                bio
                display_name
            }
            username {
                username
            }
        }
    }
`)

export const GET_ACCOUNT_FOLLOWING = gql(/* GraphQL */`
    query Following($accountAddress: String!, $page: Int!, $size: Int!) {
        following(
            accountAddress: $accountAddress
            pagination: { page: $page, size: $size }
        ) {
            address
            profile {
                creator
                pfp
                bio
                display_name
            }
            username {
                username
            }
        }
    }
`)


export const COMMUNITY_MEMBERS_SEARCH = gql(/* GraphQL */`
    query Memberships($communityName: String!, $search: String) {
        memberships(communityName: $communityName, search: $search) {
            id
            address
            profile {
                creator
                pfp
                display_name
                bio
            }
            username {
                username
            }
        }
    }
`)


export const POST_COMMUNITY_SEARCH = gql(/* GraphQL */`
    query CommunitiesSearch($search: String!, $memberAddress: String!) {
        communitiesSearch(search: $search, memberAddress: $memberAddress) {
            id
            name
            description
            image
            timestamp
            display_name
        }
    }
`)

export const MENTION_USER_SEARCH = gql(/* GraphQL */`
query AccountsSearch($search: String!, $userAddress: String!) {
    accountsSearch(search: $search, userAddress: $userAddress) {
        address
        id
        profile {
            creator
            pfp
            bio
            display_name
        }
        username {
            username
        }
    }
}
`)


export const USER_NOTIFICATIONS = gql(/* GraphQL */`
    query UserNotifications($accountAddress: String!, $page: Int!, $size: Int!) {
        userNotifications(
            accountAddress: $accountAddress,
            pagination: { page: $page, size: $size }
        ) {
            referenceUserId
            type
            timestamp
            referenceDataId
            referenceUser {
                id
                address
                username {
                    username
                }
                profile {
                    creator
                    pfp
                    display_name
                }
            }
            follow {
                follower {
                    address
                    profile {
                        creator
                        pfp
                        display_name
                    }
                }
            }
            publication {
                content
                type
                creator {
                    address
                    profile {
                        creator
                        pfp
                        display_name
                    }
                }
                publication_ref
                parent {
                    content
                    type
                    publication_ref
                }
            }
            reaction {
                publication_id
                reaction
                publication {
                    content
                }
                creator {
                    address
                    profile {
                        creator
                        display_name
                        pfp

                    },
                    username {
                        username
                    }   
                }
            }
        }
    }
`)

export const GET_ACCOUNT_USERNAME = gql(/* GraphqQL */`
    query AccountUserName($accountAddress: String!) {
        accountUserName(
            accountAddress: $accountAddress
        ) {
            username
            owner_address
            token_address
            timestamp
        }
    }
`)

export const GET_ACCOUNT_COMMUNITIES = gql(/* GraphQL */`
    query AccountCommunities($accountAddress: String!, $page: Int!, $size: Int!) {
        accountCommunities(
            accountAddress: $accountAddress,
            pagination: {
                page: $page,
                size: $size
            }
        ) {
            id
            name
            description
            image
            timestamp
            display_name,
            creator {
                id
                address
            }
            hosts {
                address
            }
        }
    }
`)