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
    "\n    query GetCollectionDetails($collectionAddress: String!){\n        collection(address: $collectionAddress) {\n            kade_collectors_count\n            name\n            description\n        }\n    }\n": types.GetCollectionDetailsDocument,
    "\nquery GetCollectors($collectionAddress: String!, $page: Int!, $size: Int!) {\n    collectors(collection_address: $collectionAddress, pagination: {page: $page, size: $size}) {\n        id\n        timestamp\n            profile {\n                pfp\n                bio\n                display_name\n            }\n            username {\n                username\n            }\n        address\n    }\n}\n": types.GetCollectorsDocument,
};

/**
 * The barnicleGQL function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = barnicleGQL(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function barnicleGQL(source: string): unknown;

/**
 * The barnicleGQL function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function barnicleGQL(source: "\n    query GetCollectionDetails($collectionAddress: String!){\n        collection(address: $collectionAddress) {\n            kade_collectors_count\n            name\n            description\n        }\n    }\n"): (typeof documents)["\n    query GetCollectionDetails($collectionAddress: String!){\n        collection(address: $collectionAddress) {\n            kade_collectors_count\n            name\n            description\n        }\n    }\n"];
/**
 * The barnicleGQL function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function barnicleGQL(source: "\nquery GetCollectors($collectionAddress: String!, $page: Int!, $size: Int!) {\n    collectors(collection_address: $collectionAddress, pagination: {page: $page, size: $size}) {\n        id\n        timestamp\n            profile {\n                pfp\n                bio\n                display_name\n            }\n            username {\n                username\n            }\n        address\n    }\n}\n"): (typeof documents)["\nquery GetCollectors($collectionAddress: String!, $page: Int!, $size: Int!) {\n    collectors(collection_address: $collectionAddress, pagination: {page: $page, size: $size}) {\n        id\n        timestamp\n            profile {\n                pfp\n                bio\n                display_name\n            }\n            username {\n                username\n            }\n        address\n    }\n}\n"];

export function barnicleGQL(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;