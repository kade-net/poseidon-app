/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation RegisterRequestInbox($args: RegisterRequestInboxInputArgs!) {\n        registerRequestInbox(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.RegisterRequestInboxDocument,
    "\nmutation RequestConversation($args: RequestConversationArgs!) {\n    requestConversation(\n        input: $args\n    ) {\n        raw_transaction\n        signature\n    }\n}\n": types.RequestConversationDocument,
    "\nmutation AcceptRequest($args: AcceptRequestArgs!) {\n    acceptRequest(input: $args) {\n        raw_transaction\n        signature\n    }\n}\n": types.AcceptRequestDocument,
    "\nmutation DelegateAcceptRequest($args: DelegateAcceptRequestArgs!) {\n    delegateAcceptRequest(input: $args) {\n        raw_transaction\n        signature\n    }\n}\n": types.DelegateAcceptRequestDocument,
    "\n    mutation DelegateRequestConversation($args: DelegateRequestConversationArgs!) {\n        delegateRequestConversation(\n            input: $args\n        ) {\n            raw_transaction\n            signature\n        }\n    }\n": types.DelegateRequestConversationDocument,
    "\n    mutation Send($args: SendArgs!) {\n        send(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.SendDocument,
    "\n    mutation DelegateSendEnvelope($args: SendArgs!) {\n        delegateSendEnvelope(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n\n": types.DelegateSendEnvelopeDocument,
    "\n    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {\n        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {\n            hid\n            content\n            ref\n            timestamp\n            inbox_name\n            sender_public_key\n            receiver_public_key\n            sender\n            receiver\n            delegate_public_key\n        }\n    }\n": types.LiveInboxDocument,
    "\n    query Accounts($search: String, $viewer: String) {\n        accounts(search: $search, viewer: $viewer) {\n            pfp\n            address\n            username\n            bio\n            display_name\n            public_key\n        }\n    }\n": types.AccountsDocument,
    "\n    query getConnection($connection_id: String!) {\n        connection(connection_id: $connection_id) {\n            user_address\n            delegate_address\n            timestamp\n            is_delegate_linked\n            is_intent_created\n        }\n    }\n": types.GetConnectionDocument,
    "\n    mutation UpdateConnection($input: updateConnectionInput!) {\n        updateConnection(input: $input)\n    }\n": types.UpdateConnectionDocument,
    "\n    mutation CreateAccountLinkIntent($input: createAccountLinkIntentInput!){\n        createAccountLinkIntent(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n": types.CreateAccountLinkIntentDocument,
    "\n    mutation ConfirmDelegate($input: confirmDelegateInput!) {\n        confirmDelegate(input: $input)\n    }\n": types.ConfirmDelegateDocument,
    "\n    mutation RegisterDelegate($input: RegisterDelegateArgs!) {\n        registerDelegate(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n": types.RegisterDelegateDocument,
    "\n    mutation init_account_and_inbox($input: initSelfDelegateKadeAccountWithHermesInboxArgs!){\n        initSelfDelegateKadeAccountWithHermesInbox(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n": types.Init_Account_And_InboxDocument,
    "\n    mutation init_delegate($input: registerDelegateOnKadeAndHermesArgs!){\n        registerDelegateOnKadeAndHermes(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n": types.Init_DelegateDocument,
    "\n    query AnchorTransactions($user_address: String!) {\n        anchorTransactions(\n            user_address: $user_address\n        ) {\n            sender_address\n            receiver_address\n            anchor_amount\n            timestamp\n            type\n        }\n    }\n\n": types.AnchorTransactionsDocument,
    "\n    mutation AdminRemoveAccount($input: adminRemoveAccountArgs!) {\n        adminRemoveAccount(input: $input)\n    }\n": types.AdminRemoveAccountDocument,
    "\n    mutation setupSelfDelegate($input: setupSelfDelegateArgs!) {\n        setupSelfDelegate(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n": types.SetupSelfDelegateDocument,
    "\n    mutation createPublication($args: createPublicationInput!) {\n        createPublication(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n": types.CreatePublicationDocument,
    "\n    mutation CreatePublicationWithRef($args: createPublicationWithRefInput!) {\n        createPublicationWithRef(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n": types.CreatePublicationWithRefDocument,
    "\n    mutation RemovePublication($args: removePublicationInput!) {\n        removePublication(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n": types.RemovePublicationDocument,
    "\n    mutation RemovePublicationWithRef($args: removePublicationWithRefInput!) {\n        removePublicationWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.RemovePublicationWithRefDocument,
    "\n    mutation CreateReaction($args: createReactionInput!) {\n        createReaction(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.CreateReactionDocument,
    "\n    mutation CreateReactionWithRef($args: createReactionWithRefInput!) {\n        createReactionWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.CreateReactionWithRefDocument,
    "\n    mutation RemoveReactionWithRef($args: removeReactionWithRefInput!) {\n        removeReactionWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.RemoveReactionWithRefDocument,
    "\n    mutation RemoveReaction($args: removeReactionInput!) {\n        removeReaction(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.RemoveReactionDocument,
    "\n    mutation UploadFile($args: UploadFileInput!) {\n        uploadFile(input: $args) {\n            upload_url\n            file_url\n        }\n    }\n": types.UploadFileDocument,
    "\n        mutation UpdateProfile($args: updateProfileInput!) {\n            updateProfile(input: $args) {\n                raw_transaction\n                signature\n            }\n        }\n": types.UpdateProfileDocument,
    "\n    mutation FollowAccount($args: followAccountInput!) {\n        followAccount(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.FollowAccountDocument,
    "\n    mutation UnfollowAccount($args: unfollowAccountInput!) {\n        unfollowAccount(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n\n": types.UnfollowAccountDocument,
    "\n    mutation CreateCommunity($args: createCommunityInput!) {\n        createCommunity(input: $args)\n    }\n": types.CreateCommunityDocument,
    "\n    mutation CommunityAddHost($args: addHostInput!) {\n        communityAddHost(input: $args)\n    }\n": types.CommunityAddHostDocument,
    "\n    mutation JoinCommunity($args: joinCommunityInput!) {\n        joinCommunity(input: $args)\n    }\n": types.JoinCommunityDocument,
    "\n    mutation RemoveCommunityHost($args: removeCommunityHostInput!) {\n        removeCommunityHost(input: $args)\n    }\n": types.RemoveCommunityHostDocument,
    "\n    mutation UpdateCommunity($args: updateCommunityInput!) {\n        updateCommunity(input: $args)\n    }\n": types.UpdateCommunityDocument,
    "\n    mutation DeleteCommunity($args: deleteCommunityInput!) {\n        deleteCommunity(input: $args)\n    }\n": types.DeleteCommunityDocument,
    "\n    query Portals {\n        portals {\n            name\n            description\n            icon\n            url\n            post_id\n            user_kid\n            username\n            created_at\n        }\n    }\n": types.PortalsDocument,
    "\n    query GetRanking($user_address: String!) {\n    getRanking(\n        user_address: $user_address\n    ) {\n        rank\n        points\n        badges {\n            type\n            owner\n            timestamp\n        }\n    }\n}\n": types.GetRankingDocument,
    "\n    mutation SetTopic ($input: addTopic) {\n    setTopic(input: $input) \n}    \n": types.SetTopicDocument,
    "\n    mutation AddTransaction($input: registerTransaction) {\n        addTransaction(input: $input)\n    }\n": types.AddTransactionDocument,
    "\n    mutation AddNotificationSettings($input: addNotificationToken!) {\n        addNotificationSettings(input: $input)\n    }\n": types.AddNotificationSettingsDocument,
    "\nmutation AddEmail($input: addEmail!) {\n    addEmail(input: $input)\n}\n    ": types.AddEmailDocument,
    "\nmutation SendVerificationCode($input: sendVerificationCodeEmail! ) {\n    sendVerificationCode(input: $input)\n}\n    ": types.SendVerificationCodeDocument,
    "\n    mutation VerifyCode($input: verifyCode!) {\n    verifyCode(\n        input: $input\n    )\n}\n": types.VerifyCodeDocument,
    "\n    query GetWalletNotifications($user_address: String!) {\n        getWalletNotifications(\n            user_address: $user_address\n        ) {\n            amount\n            currency\n            hash\n            receiver_address\n            sender_address\n            type\n            timestamp\n        }\n    }\n": types.GetWalletNotificationsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RegisterRequestInbox($args: RegisterRequestInboxInputArgs!) {\n        registerRequestInbox(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation RegisterRequestInbox($args: RegisterRequestInboxInputArgs!) {\n        registerRequestInbox(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RequestConversation($args: RequestConversationArgs!) {\n    requestConversation(\n        input: $args\n    ) {\n        raw_transaction\n        signature\n    }\n}\n"): (typeof documents)["\nmutation RequestConversation($args: RequestConversationArgs!) {\n    requestConversation(\n        input: $args\n    ) {\n        raw_transaction\n        signature\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AcceptRequest($args: AcceptRequestArgs!) {\n    acceptRequest(input: $args) {\n        raw_transaction\n        signature\n    }\n}\n"): (typeof documents)["\nmutation AcceptRequest($args: AcceptRequestArgs!) {\n    acceptRequest(input: $args) {\n        raw_transaction\n        signature\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation DelegateAcceptRequest($args: DelegateAcceptRequestArgs!) {\n    delegateAcceptRequest(input: $args) {\n        raw_transaction\n        signature\n    }\n}\n"): (typeof documents)["\nmutation DelegateAcceptRequest($args: DelegateAcceptRequestArgs!) {\n    delegateAcceptRequest(input: $args) {\n        raw_transaction\n        signature\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation DelegateRequestConversation($args: DelegateRequestConversationArgs!) {\n        delegateRequestConversation(\n            input: $args\n        ) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation DelegateRequestConversation($args: DelegateRequestConversationArgs!) {\n        delegateRequestConversation(\n            input: $args\n        ) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation Send($args: SendArgs!) {\n        send(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation Send($args: SendArgs!) {\n        send(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation DelegateSendEnvelope($args: SendArgs!) {\n        delegateSendEnvelope(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n\n"): (typeof documents)["\n    mutation DelegateSendEnvelope($args: SendArgs!) {\n        delegateSendEnvelope(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {\n        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {\n            hid\n            content\n            ref\n            timestamp\n            inbox_name\n            sender_public_key\n            receiver_public_key\n            sender\n            receiver\n            delegate_public_key\n        }\n    }\n"): (typeof documents)["\n    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {\n        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {\n            hid\n            content\n            ref\n            timestamp\n            inbox_name\n            sender_public_key\n            receiver_public_key\n            sender\n            receiver\n            delegate_public_key\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Accounts($search: String, $viewer: String) {\n        accounts(search: $search, viewer: $viewer) {\n            pfp\n            address\n            username\n            bio\n            display_name\n            public_key\n        }\n    }\n"): (typeof documents)["\n    query Accounts($search: String, $viewer: String) {\n        accounts(search: $search, viewer: $viewer) {\n            pfp\n            address\n            username\n            bio\n            display_name\n            public_key\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getConnection($connection_id: String!) {\n        connection(connection_id: $connection_id) {\n            user_address\n            delegate_address\n            timestamp\n            is_delegate_linked\n            is_intent_created\n        }\n    }\n"): (typeof documents)["\n    query getConnection($connection_id: String!) {\n        connection(connection_id: $connection_id) {\n            user_address\n            delegate_address\n            timestamp\n            is_delegate_linked\n            is_intent_created\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateConnection($input: updateConnectionInput!) {\n        updateConnection(input: $input)\n    }\n"): (typeof documents)["\n    mutation UpdateConnection($input: updateConnectionInput!) {\n        updateConnection(input: $input)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateAccountLinkIntent($input: createAccountLinkIntentInput!){\n        createAccountLinkIntent(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation CreateAccountLinkIntent($input: createAccountLinkIntentInput!){\n        createAccountLinkIntent(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation ConfirmDelegate($input: confirmDelegateInput!) {\n        confirmDelegate(input: $input)\n    }\n"): (typeof documents)["\n    mutation ConfirmDelegate($input: confirmDelegateInput!) {\n        confirmDelegate(input: $input)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RegisterDelegate($input: RegisterDelegateArgs!) {\n        registerDelegate(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation RegisterDelegate($input: RegisterDelegateArgs!) {\n        registerDelegate(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation init_account_and_inbox($input: initSelfDelegateKadeAccountWithHermesInboxArgs!){\n        initSelfDelegateKadeAccountWithHermesInbox(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation init_account_and_inbox($input: initSelfDelegateKadeAccountWithHermesInboxArgs!){\n        initSelfDelegateKadeAccountWithHermesInbox(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation init_delegate($input: registerDelegateOnKadeAndHermesArgs!){\n        registerDelegateOnKadeAndHermes(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation init_delegate($input: registerDelegateOnKadeAndHermesArgs!){\n        registerDelegateOnKadeAndHermes(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query AnchorTransactions($user_address: String!) {\n        anchorTransactions(\n            user_address: $user_address\n        ) {\n            sender_address\n            receiver_address\n            anchor_amount\n            timestamp\n            type\n        }\n    }\n\n"): (typeof documents)["\n    query AnchorTransactions($user_address: String!) {\n        anchorTransactions(\n            user_address: $user_address\n        ) {\n            sender_address\n            receiver_address\n            anchor_amount\n            timestamp\n            type\n        }\n    }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation AdminRemoveAccount($input: adminRemoveAccountArgs!) {\n        adminRemoveAccount(input: $input)\n    }\n"): (typeof documents)["\n    mutation AdminRemoveAccount($input: adminRemoveAccountArgs!) {\n        adminRemoveAccount(input: $input)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation setupSelfDelegate($input: setupSelfDelegateArgs!) {\n        setupSelfDelegate(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation setupSelfDelegate($input: setupSelfDelegateArgs!) {\n        setupSelfDelegate(input: $input) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation createPublication($args: createPublicationInput!) {\n        createPublication(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation createPublication($args: createPublicationInput!) {\n        createPublication(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreatePublicationWithRef($args: createPublicationWithRefInput!) {\n        createPublicationWithRef(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreatePublicationWithRef($args: createPublicationWithRefInput!) {\n        createPublicationWithRef(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RemovePublication($args: removePublicationInput!) {\n        removePublication(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation RemovePublication($args: removePublicationInput!) {\n        removePublication(input: $args) {\n            client_ref\n            txn {\n                raw_transaction\n                signature\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RemovePublicationWithRef($args: removePublicationWithRefInput!) {\n        removePublicationWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation RemovePublicationWithRef($args: removePublicationWithRefInput!) {\n        removePublicationWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateReaction($args: createReactionInput!) {\n        createReaction(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation CreateReaction($args: createReactionInput!) {\n        createReaction(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateReactionWithRef($args: createReactionWithRefInput!) {\n        createReactionWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation CreateReactionWithRef($args: createReactionWithRefInput!) {\n        createReactionWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RemoveReactionWithRef($args: removeReactionWithRefInput!) {\n        removeReactionWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation RemoveReactionWithRef($args: removeReactionWithRefInput!) {\n        removeReactionWithRef(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RemoveReaction($args: removeReactionInput!) {\n        removeReaction(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation RemoveReaction($args: removeReactionInput!) {\n        removeReaction(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UploadFile($args: UploadFileInput!) {\n        uploadFile(input: $args) {\n            upload_url\n            file_url\n        }\n    }\n"): (typeof documents)["\n    mutation UploadFile($args: UploadFileInput!) {\n        uploadFile(input: $args) {\n            upload_url\n            file_url\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n        mutation UpdateProfile($args: updateProfileInput!) {\n            updateProfile(input: $args) {\n                raw_transaction\n                signature\n            }\n        }\n"): (typeof documents)["\n        mutation UpdateProfile($args: updateProfileInput!) {\n            updateProfile(input: $args) {\n                raw_transaction\n                signature\n            }\n        }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation FollowAccount($args: followAccountInput!) {\n        followAccount(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation FollowAccount($args: followAccountInput!) {\n        followAccount(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UnfollowAccount($args: unfollowAccountInput!) {\n        unfollowAccount(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n\n"): (typeof documents)["\n    mutation UnfollowAccount($args: unfollowAccountInput!) {\n        unfollowAccount(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateCommunity($args: createCommunityInput!) {\n        createCommunity(input: $args)\n    }\n"): (typeof documents)["\n    mutation CreateCommunity($args: createCommunityInput!) {\n        createCommunity(input: $args)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CommunityAddHost($args: addHostInput!) {\n        communityAddHost(input: $args)\n    }\n"): (typeof documents)["\n    mutation CommunityAddHost($args: addHostInput!) {\n        communityAddHost(input: $args)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation JoinCommunity($args: joinCommunityInput!) {\n        joinCommunity(input: $args)\n    }\n"): (typeof documents)["\n    mutation JoinCommunity($args: joinCommunityInput!) {\n        joinCommunity(input: $args)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation RemoveCommunityHost($args: removeCommunityHostInput!) {\n        removeCommunityHost(input: $args)\n    }\n"): (typeof documents)["\n    mutation RemoveCommunityHost($args: removeCommunityHostInput!) {\n        removeCommunityHost(input: $args)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateCommunity($args: updateCommunityInput!) {\n        updateCommunity(input: $args)\n    }\n"): (typeof documents)["\n    mutation UpdateCommunity($args: updateCommunityInput!) {\n        updateCommunity(input: $args)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation DeleteCommunity($args: deleteCommunityInput!) {\n        deleteCommunity(input: $args)\n    }\n"): (typeof documents)["\n    mutation DeleteCommunity($args: deleteCommunityInput!) {\n        deleteCommunity(input: $args)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Portals {\n        portals {\n            name\n            description\n            icon\n            url\n            post_id\n            user_kid\n            username\n            created_at\n        }\n    }\n"): (typeof documents)["\n    query Portals {\n        portals {\n            name\n            description\n            icon\n            url\n            post_id\n            user_kid\n            username\n            created_at\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetRanking($user_address: String!) {\n    getRanking(\n        user_address: $user_address\n    ) {\n        rank\n        points\n        badges {\n            type\n            owner\n            timestamp\n        }\n    }\n}\n"): (typeof documents)["\n    query GetRanking($user_address: String!) {\n    getRanking(\n        user_address: $user_address\n    ) {\n        rank\n        points\n        badges {\n            type\n            owner\n            timestamp\n        }\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation SetTopic ($input: addTopic) {\n    setTopic(input: $input) \n}    \n"): (typeof documents)["\n    mutation SetTopic ($input: addTopic) {\n    setTopic(input: $input) \n}    \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation AddTransaction($input: registerTransaction) {\n        addTransaction(input: $input)\n    }\n"): (typeof documents)["\n    mutation AddTransaction($input: registerTransaction) {\n        addTransaction(input: $input)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation AddNotificationSettings($input: addNotificationToken!) {\n        addNotificationSettings(input: $input)\n    }\n"): (typeof documents)["\n    mutation AddNotificationSettings($input: addNotificationToken!) {\n        addNotificationSettings(input: $input)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddEmail($input: addEmail!) {\n    addEmail(input: $input)\n}\n    "): (typeof documents)["\nmutation AddEmail($input: addEmail!) {\n    addEmail(input: $input)\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation SendVerificationCode($input: sendVerificationCodeEmail! ) {\n    sendVerificationCode(input: $input)\n}\n    "): (typeof documents)["\nmutation SendVerificationCode($input: sendVerificationCodeEmail! ) {\n    sendVerificationCode(input: $input)\n}\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation VerifyCode($input: verifyCode!) {\n    verifyCode(\n        input: $input\n    )\n}\n"): (typeof documents)["\n    mutation VerifyCode($input: verifyCode!) {\n    verifyCode(\n        input: $input\n    )\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetWalletNotifications($user_address: String!) {\n        getWalletNotifications(\n            user_address: $user_address\n        ) {\n            amount\n            currency\n            hash\n            receiver_address\n            sender_address\n            type\n            timestamp\n        }\n    }\n"): (typeof documents)["\n    query GetWalletNotifications($user_address: String!) {\n        getWalletNotifications(\n            user_address: $user_address\n        ) {\n            amount\n            currency\n            hash\n            receiver_address\n            sender_address\n            type\n            timestamp\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;