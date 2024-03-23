import { barnicleGQL } from "../barnicle/__generated__";


export const GET_COLLECTION_DETAILS = barnicleGQL(/* GraphQL */`
    query GetCollectionDetails($collectionAddress: String!){
        collection(address: $collectionAddress) {
            kade_collectors_count
            name
            description
        }
    }
`)

export const GET_COLLECTION_COLLECTORS = barnicleGQL(/* GraphQL */`
query GetCollectors($collectionAddress: String!, $page: Int!, $size: Int!) {
    collectors(collection_address: $collectionAddress, pagination: {page: $page, size: $size}) {
        id
        timestamp
            profile {
                pfp
                bio
                display_name
            }
            username {
                username
            }
        address
    }
}
`)