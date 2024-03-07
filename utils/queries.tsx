import { gql } from "../__generated__";


export const GET_HOME_FEED = gql(/* GraphQL */`
    query Feed($page: Int!, $size: Int!, $type: Int){
        publications(pagination: { page: $page, size: $size }, type: $type) {
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
        }
    }
`)


export const GET_MY_PROFILE = gql(/* GraphQL */`
    query MyProfile ($address: String!){
        account(address: $address){
            id
            profile {
                display_name,
                bio,
                pfp,

            },
            username {
                username
            }
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
    query PublicationComments($publication_ref: String!, $page: Int!, $size: Int!) {
        publicationComments(ref: $publication_ref, pagination: { page: $page, size: $size }) {
            id
            content
            type
            timestamp
            publication_ref
            creator {
                address
                profile {
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
