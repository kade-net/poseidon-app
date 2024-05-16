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

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;