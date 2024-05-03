import { gqlHermes } from "./__generated__";


export const getPhoneBook = gqlHermes(/* GraphQL */`
    query GetPhoneBook($address: String!) {
        phoneBook(address: $address) {
            address
            hid
            timestamp
            public_key
        }
    }
`)

export const getInboxes = gqlHermes(/* GraphQL */`
query GetInboxes($address: String!, $type: InboxType, $active: Boolean) {
    inboxes(address: $address, type: $type, active: $active) {
        id
        owner_address
        initiator_address
        timestamp
        hid
        active
    }
}
`)


export const getInboxHistory = gqlHermes(/* GraphQL */`
    query InboxHistory($inbox_name: String!, $timestamp: Date) {
        inboxHistory(
            inbox_name: $inbox_name
            timestamp: $timestamp
        ) {
            id
            ref
            timestamp
            hid
            inbox_name
            sender_public_key
            content
            reciever_public_key
            sender
            receiver
        }
    }
`)