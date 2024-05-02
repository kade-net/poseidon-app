import { gql } from "./__generated__";

export const registerRequestInbox = gql(/* GraphQL */`
    mutation RegisterRequestInbox($args: RegisterRequestInboxInputArgs!) {
        registerRequestInbox(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const requestConversation = gql(/* GraphQL */`
mutation RequestConversation($args: RequestConversationArgs!) {
    requestConversation(
        input: $args
    ) {
        raw_transaction
        signature
    }
}
`)

export const acceptRequest = gql(/* GraphQL */`
mutation AcceptRequest($args: AcceptRequestArgs!) {
    acceptRequest(input: $args) {
        raw_transaction
        signature
    }
}
`)

export const send = gql(/* GraphQL */`
    mutation Send($args: SendArgs!) {
        send(input: $args) {
            raw_transaction
            signature
        }
    }
`)