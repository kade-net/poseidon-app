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
    "\n    mutation Send($args: SendArgs!) {\n        send(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n": types.SendDocument,
    "\n    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {\n        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {\n            hid\n            content\n            ref\n            timestamp\n            inbox_name\n            sender_public_key\n            receiver_public_key\n            sender\n            receiver\n        }\n    }\n": types.LiveInboxDocument,
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
export function gql(source: "\n    mutation Send($args: SendArgs!) {\n        send(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"): (typeof documents)["\n    mutation Send($args: SendArgs!) {\n        send(input: $args) {\n            raw_transaction\n            signature\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {\n        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {\n            hid\n            content\n            ref\n            timestamp\n            inbox_name\n            sender_public_key\n            receiver_public_key\n            sender\n            receiver\n        }\n    }\n"): (typeof documents)["\n    subscription LiveInbox($inbox_name: String!, $viewer: String!, $timestamp: Date) {\n        liveInbox(inbox_name: $inbox_name, viewer: $viewer, timestamp: $timestamp) {\n            hid\n            content\n            ref\n            timestamp\n            inbox_name\n            sender_public_key\n            receiver_public_key\n            sender\n            receiver\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;