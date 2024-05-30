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
    "\n    query GetPhoneBook($address: String!) {\n        phoneBook(address: $address) {\n            address\n            hid\n            timestamp\n            public_key\n        }\n    }\n": types.GetPhoneBookDocument,
    "\nquery GetInboxes($address: String!, $type: InboxType, $active: Boolean) {\n    inboxes(address: $address, type: $type, active: $active) {\n        id\n        owner_address\n        initiator_address\n        timestamp\n        hid\n        active\n    }\n}\n": types.GetInboxesDocument,
    "\n    query InboxHistory($inbox_name: String!, $timestamp: Date) {\n        inboxHistory(\n            inbox_name: $inbox_name\n            timestamp: $timestamp\n        ) {\n            id\n            ref\n            timestamp\n            hid\n            inbox_name\n            sender_public_key\n            content\n            reciever_public_key\n            sender\n            receiver\n            delegate_public_key\n        }\n    }\n": types.InboxHistoryDocument,
    "\n query getInbox($viewer: String!, $address: String!) {\n    inbox(viewer: $viewer, address: $address) {\n        id\n        owner_address\n        initiator_address\n        timestamp\n        hid\n        active\n    }\n}\n": types.GetInboxDocument,
    "\n    query getDelegates($address: String!){\n        delegates(address: $address){\n            address\n            user_address\n            timestamp\n            public_key\n        }\n    }\n": types.GetDelegatesDocument,
};

/**
 * The gqlHermes function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gqlHermes(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gqlHermes(source: string): unknown;

/**
 * The gqlHermes function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gqlHermes(source: "\n    query GetPhoneBook($address: String!) {\n        phoneBook(address: $address) {\n            address\n            hid\n            timestamp\n            public_key\n        }\n    }\n"): (typeof documents)["\n    query GetPhoneBook($address: String!) {\n        phoneBook(address: $address) {\n            address\n            hid\n            timestamp\n            public_key\n        }\n    }\n"];
/**
 * The gqlHermes function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gqlHermes(source: "\nquery GetInboxes($address: String!, $type: InboxType, $active: Boolean) {\n    inboxes(address: $address, type: $type, active: $active) {\n        id\n        owner_address\n        initiator_address\n        timestamp\n        hid\n        active\n    }\n}\n"): (typeof documents)["\nquery GetInboxes($address: String!, $type: InboxType, $active: Boolean) {\n    inboxes(address: $address, type: $type, active: $active) {\n        id\n        owner_address\n        initiator_address\n        timestamp\n        hid\n        active\n    }\n}\n"];
/**
 * The gqlHermes function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gqlHermes(source: "\n    query InboxHistory($inbox_name: String!, $timestamp: Date) {\n        inboxHistory(\n            inbox_name: $inbox_name\n            timestamp: $timestamp\n        ) {\n            id\n            ref\n            timestamp\n            hid\n            inbox_name\n            sender_public_key\n            content\n            reciever_public_key\n            sender\n            receiver\n            delegate_public_key\n        }\n    }\n"): (typeof documents)["\n    query InboxHistory($inbox_name: String!, $timestamp: Date) {\n        inboxHistory(\n            inbox_name: $inbox_name\n            timestamp: $timestamp\n        ) {\n            id\n            ref\n            timestamp\n            hid\n            inbox_name\n            sender_public_key\n            content\n            reciever_public_key\n            sender\n            receiver\n            delegate_public_key\n        }\n    }\n"];
/**
 * The gqlHermes function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gqlHermes(source: "\n query getInbox($viewer: String!, $address: String!) {\n    inbox(viewer: $viewer, address: $address) {\n        id\n        owner_address\n        initiator_address\n        timestamp\n        hid\n        active\n    }\n}\n"): (typeof documents)["\n query getInbox($viewer: String!, $address: String!) {\n    inbox(viewer: $viewer, address: $address) {\n        id\n        owner_address\n        initiator_address\n        timestamp\n        hid\n        active\n    }\n}\n"];
/**
 * The gqlHermes function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gqlHermes(source: "\n    query getDelegates($address: String!){\n        delegates(address: $address){\n            address\n            user_address\n            timestamp\n            public_key\n        }\n    }\n"): (typeof documents)["\n    query getDelegates($address: String!){\n        delegates(address: $address){\n            address\n            user_address\n            timestamp\n            public_key\n        }\n    }\n"];

export function gqlHermes(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;