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

export const delegateAcceptRequest = gql(/* GraphQL */`
mutation DelegateAcceptRequest($args: DelegateAcceptRequestArgs!) {
    delegateAcceptRequest(input: $args) {
        raw_transaction
        signature
    }
}
`)

export const delegateRequestConversation = gql(/* GraphQL */`
    mutation DelegateRequestConversation($input: DelegateRequestConversationArgs!) {
        delegateRequestConversation(
            input: $input
        ) {
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

export const delegateSendEnvelope = gql(/* GraphQL */`
    mutation DelegateSendEnvelope($args: SendArgs!) {
        delegateSendEnvelope(input: $args) {
            raw_transaction
            signature
        }
    }

`)

export const INBOX_MESSAGE_SUBSCRIPTION = gql(/* GraphQL */`
    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {
        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {
            hid
            content
            ref
            timestamp
            inbox_name
            sender_public_key
            receiver_public_key
            sender
            receiver
            delegate_public_key
        }
    }
`)

export const DMS_ACCOUNTS_SEARCH = gql(/* GraphQL */`
    query Accounts($search: String, $viewer: String) {
        accounts(search: $search, viewer: $viewer) {
            pfp
            address
            username
            bio
            display_name
            public_key
        }
    }
`)

export const GET_CONNECTION = gql(/* GraphQL */`
    query getConnection($connection_id: String!) {
        connection(connection_id: $connection_id) {
            user_address
            delegate_address
            timestamp
            is_delegate_linked
            is_intent_created
        }
    }
`)

export const UPDATE_CONNECTION = gql(/* GraphQL */`
    mutation UpdateConnection($input: updateConnectionInput!) {
        updateConnection(input: $input)
    }
`)

export const CREATE_ACCOUNT_LINK_INTENT = gql(/* GraphQL */`
    mutation CreateAccountLinkIntent($input: createAccountLinkIntentInput!){
        createAccountLinkIntent(input: $input) {
            raw_transaction
            signature
        }
    }
`)

export const CONFIRM_DELEGATE_LINKED = gql(/* GraphQL */`
    mutation ConfirmDelegate($input: confirmDelegateInput!) {
        confirmDelegate(input: $input)
    }
`)

export const REGISTER_DELEGATE = gql(/* GraphQL */`
    mutation RegisterDelegate($input: RegisterDelegateArgs!) {
        registerDelegate(input: $input) {
            raw_transaction
            signature
        }
    }
`)

export const INIT_ACCOUNT_AND_INBOX = gql(/* GraphQL */`
    mutation init_account_and_inbox($input: initSelfDelegateKadeAccountWithHermesInboxArgs!){
        initSelfDelegateKadeAccountWithHermesInbox(input: $input) {
            raw_transaction
            signature
        }
    }
`)

export const INIT_DELEGATE = gql(/* GraphQL */`
    mutation init_delegate($input: registerDelegateOnKadeAndHermesArgs!){
        registerDelegateOnKadeAndHermes(input: $input) {
            raw_transaction
            signature
        }
    }
`)

export const GET_ANCHOR_HISTORY = gql(/* GraphQL */`
    query AnchorTransactions($user_address: String!) {
        anchorTransactions(
            user_address: $user_address
        ) {
            sender_address
            receiver_address
            anchor_amount
            timestamp
            type
        }
    }

`)

export const DELETE_ACCOUNT = gql(/* GraphQL */`
    mutation AdminRemoveAccount($input: adminRemoveAccountArgs!) {
        adminRemoveAccount(input: $input)
    }
`)