import { gql } from "../__generated__";


export const GET_HOME_FEED = gql(/* GraphQL */`
    query Feed($page: Int!, $size: Int!){
        publications(pagination: { page: $page, size: $size }) {
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
                profile {
                    display_name
                    pfp
                }
                username {
                    username
                }
            }
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


export const GET_POST = gql(/* GraphQL */`
    query POST($postId: Int!){
        publication(id: $postId){
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
                    profile {
                        display_name
                        pfp
                    }
                    username {
                        username
                    }
                }
        }
    }
`)