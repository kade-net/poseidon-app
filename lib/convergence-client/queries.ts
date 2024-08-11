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
    mutation DelegateRequestConversation($args: DelegateRequestConversationArgs!) {
        delegateRequestConversation(
            input: $args
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

export const SETUP_SELF_DELEGATE = gql(/* GraphQL */`
    mutation setupSelfDelegate($input: setupSelfDelegateArgs!) {
        setupSelfDelegate(input: $input) {
            raw_transaction
            signature
        }
    }
`)

export const createPublication = gql(/* GraphQL */`
    mutation createPublication($args: createPublicationInput!) {
        createPublication(input: $args) {
            client_ref
            txn {
                raw_transaction
                signature
            }
        }
    }
`)

export const createPublicationWithRef = gql(/* GraphQL */`
    mutation CreatePublicationWithRef($args: createPublicationWithRefInput!) {
        createPublicationWithRef(input: $args) {
            client_ref
            txn {
                raw_transaction
                signature
            }
        }
    }
`)

export const removePublication = gql(/* GraphQL */`
    mutation RemovePublication($args: removePublicationInput!) {
        removePublication(input: $args) {
            client_ref
            txn {
                raw_transaction
                signature
            }
        }
    }
`)

export const removePublicationWithRef = gql(/* GraphQL */`
    mutation RemovePublicationWithRef($args: removePublicationWithRefInput!) {
        removePublicationWithRef(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const createReaction = gql(/* GraphQL */`
    mutation CreateReaction($args: createReactionInput!) {
        createReaction(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const createReactionWithRef = gql(/* GraphQL */`
    mutation CreateReactionWithRef($args: createReactionWithRefInput!) {
        createReactionWithRef(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const removeReactionWithRef = gql(/* GraphQL */`
    mutation RemoveReactionWithRef($args: removeReactionWithRefInput!) {
        removeReactionWithRef(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const removeReaction = gql(/* GraphQL */`
    mutation RemoveReaction($args: removeReactionInput!) {
        removeReaction(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const uploadFile = gql(/* GraphQL */`
    mutation UploadFile($args: UploadFileInput!) {
        uploadFile(input: $args) {
            upload_url
            file_url
        }
    }
`)

export const updateProfile = gql(/* GraphQL */`
        mutation UpdateProfile($args: updateProfileInput!) {
            updateProfile(input: $args) {
                raw_transaction
                signature
            }
        }
`)

export const followAccount = gql(/* GraphQL */`
    mutation FollowAccount($args: followAccountInput!) {
        followAccount(input: $args) {
            raw_transaction
            signature
        }
    }
`)

export const unfollowAccount = gql(/* GraphQL */`
    mutation UnfollowAccount($args: unfollowAccountInput!) {
        unfollowAccount(input: $args) {
            raw_transaction
            signature
        }
    }

`)

export const createCommunity =  gql(/* GraphQL */`
    mutation CreateCommunity($args: createCommunityInput!) {
        createCommunity(input: $args)
    }
`)

export const communityAddHost =  gql(/* GraphQL */`
    mutation CommunityAddHost($args: addHostInput!) {
        communityAddHost(input: $args)
    }
`)

export const joinCommunity =  gql(/* GraphQL */`
    mutation JoinCommunity($args: joinCommunityInput!) {
        joinCommunity(input: $args)
    }
`)


export const removeCommunityHost =  gql(/* GraphQL */`
    mutation RemoveCommunityHost($args: removeCommunityHostInput!) {
        removeCommunityHost(input: $args)
    }
`)


export const updateCommunity =  gql(/* GraphQL */`
    mutation UpdateCommunity($args: updateCommunityInput!) {
        updateCommunity(input: $args)
    }
`)

export const deleteCommunity =  gql(/* GraphQL */`
    mutation DeleteCommunity($args: deleteCommunityInput!) {
        deleteCommunity(input: $args)
    }
`)


export const GET_PORTALS = gql(/* GraphQL */`
    query Portals {
        portals {
            name
            description
            icon
            url
            post_id
            user_kid
            username
            created_at
        }
    }
`)


export const GET_RANKING = gql(/* GraphQL */`
    query GetRanking($user_address: String!) {
    getRanking(
        user_address: $user_address
    ) {
        rank
        points
        badges {
            type
            owner
            timestamp
        }
    }
}
`)


export const SET_TOPIC = gql(/* GraphQL */`
    mutation SetTopic ($input: addTopic) {
    setTopic(input: $input) 
}    
`)

export const ADD_TRANSACTION = gql(/* GraphQL */`
    mutation AddTransaction($input: registerTransaction) {
        addTransaction(input: $input)
    }
`)

export const ADD_TOKEN = gql(/* GraphQL */`
    mutation AddNotificationSettings($input: addNotificationToken!) {
        addNotificationSettings(input: $input)
    }
`)

export const ADD_EMAIL = gql(/* GraphQL */`
mutation AddEmail($input: addEmail!) {
    addEmail(input: $input)
}
    `)

export const SEND_VERIFICATION_EMAIL = gql(/* GraphQL */`
mutation SendVerificationCode($input: sendVerificationCodeEmail! ) {
    sendVerificationCode(input: $input)
}
    `)

export const VERIFY_EMAIL = gql(/* GraphQL */`
    mutation VerifyCode($input: verifyCode!) {
    verifyCode(
        input: $input
    )
}
`)