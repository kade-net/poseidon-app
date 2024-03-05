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
    "\n    query Feed($page: Int!, $size: Int!){\n        publications(pagination: { page: $page, size: $size }) {\n            id,\n            timestamp\n            content\n            stats {\n                comments\n                quotes\n                reposts\n                reactions\n            }\n            creator {\n                profile {\n                    display_name\n                    pfp\n                }\n                username {\n                    username\n                }\n            }\n        }\n    }\n": types.FeedDocument,
    "\n    query MyProfile ($address: String!){\n        account(address: $address){\n            id\n            profile {\n                display_name,\n                bio,\n                pfp,\n\n            },\n            username {\n                username\n            }\n        }\n    }\n": types.MyProfileDocument,
    "\n    query POST($postId: Int!){\n        publication(id: $postId){\n            id,\n                timestamp\n                content\n                stats {\n                    comments\n                    quotes\n                    reposts\n                    reactions\n                }\n                creator {\n                    profile {\n                        display_name\n                        pfp\n                    }\n                    username {\n                        username\n                    }\n                }\n        }\n    }\n": types.PostDocument,
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
export function gql(source: "\n    query Feed($page: Int!, $size: Int!){\n        publications(pagination: { page: $page, size: $size }) {\n            id,\n            timestamp\n            content\n            stats {\n                comments\n                quotes\n                reposts\n                reactions\n            }\n            creator {\n                profile {\n                    display_name\n                    pfp\n                }\n                username {\n                    username\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query Feed($page: Int!, $size: Int!){\n        publications(pagination: { page: $page, size: $size }) {\n            id,\n            timestamp\n            content\n            stats {\n                comments\n                quotes\n                reposts\n                reactions\n            }\n            creator {\n                profile {\n                    display_name\n                    pfp\n                }\n                username {\n                    username\n                }\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query MyProfile ($address: String!){\n        account(address: $address){\n            id\n            profile {\n                display_name,\n                bio,\n                pfp,\n\n            },\n            username {\n                username\n            }\n        }\n    }\n"): (typeof documents)["\n    query MyProfile ($address: String!){\n        account(address: $address){\n            id\n            profile {\n                display_name,\n                bio,\n                pfp,\n\n            },\n            username {\n                username\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query POST($postId: Int!){\n        publication(id: $postId){\n            id,\n                timestamp\n                content\n                stats {\n                    comments\n                    quotes\n                    reposts\n                    reactions\n                }\n                creator {\n                    profile {\n                        display_name\n                        pfp\n                    }\n                    username {\n                        username\n                    }\n                }\n        }\n    }\n"): (typeof documents)["\n    query POST($postId: Int!){\n        publication(id: $postId){\n            id,\n                timestamp\n                content\n                stats {\n                    comments\n                    quotes\n                    reposts\n                    reactions\n                }\n                creator {\n                    profile {\n                        display_name\n                        pfp\n                    }\n                    username {\n                        username\n                    }\n                }\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;