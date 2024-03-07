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
    "\nfragment NewPublication on Publication {\n    id\n    timestamp\n    content\n    creator {\n        profile {\n            display_name\n            pfp\n            bio\n        }\n        username {\n            username\n        }\n        id\n        address\n    }\n    stats {\n        comments\n        quotes\n        reposts\n        reactions\n    }\n    publication_ref\n}\n": types.NewPublicationFragmentDoc,
    "\n    query Feed($page: Int!, $size: Int!, $type: Int){\n        publications(pagination: { page: $page, size: $size }, type: $type) {\n            __typename\n            id,\n            timestamp\n            content\n            stats {\n                comments\n                quotes\n                reposts\n                reactions\n            }\n            creator {\n                address\n                profile {\n                    pfp\n                    bio\n                    display_name\n                }\n                username {\n                    username\n                }\n                id\n            },\n            publication_ref\n        }\n    }\n": types.FeedDocument,
    "\n    query MyProfile ($address: String!){\n        account(address: $address){\n            id\n            profile {\n                display_name,\n                bio,\n                pfp,\n\n            },\n            username {\n                username\n            }\n        }\n    }\n": types.MyProfileDocument,
    "\n    query Publication($postRef: String!){\n        publication(ref: $postRef){\n            __typename\n            id,\n                timestamp\n                content\n                stats {\n                    comments\n                    quotes\n                    reposts\n                    reactions\n                }\n                creator {\n                    address\n                    profile {\n                        pfp\n                        bio\n                        display_name\n                    }\n                    username {\n                        username\n                    }\n                    id\n                },\n                publication_ref\n        }\n    }\n": types.PublicationDocument,
    "\n    query PublicationStats($publication_ref: String!){\n        publicationStats(ref: $publication_ref) {\n        __typename\n        reposts\n        quotes\n        comments\n        reactions\n        ref\n    }\n    }\n": types.PublicationStatsDocument,
    "\n    query PublicationInteractionsByViewer($ref: String!, $address: String!){\n        publicationInteractionsByViewer(ref: $ref , address: $address) {\n            __typename\n            reacted\n            quoted\n            quote_refs\n            commented\n            comment_refs\n            reposted\n            repost_refs\n            ref\n        }\n    }\n": types.PublicationInteractionsByViewerDocument,
    "\n    query PublicationComments($publication_ref: String!, $page: Int!, $size: Int!) {\n        publicationComments(ref: $publication_ref, pagination: { page: $page, size: $size }) {\n            id\n            content\n            type\n            timestamp\n            publication_ref\n            creator {\n                address\n                profile {\n                    pfp\n                    bio\n                    display_name\n                }\n                username {\n                    username\n                }\n                id\n            }\n        }\n    }\n": types.PublicationCommentsDocument,
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
export function gql(source: "\nfragment NewPublication on Publication {\n    id\n    timestamp\n    content\n    creator {\n        profile {\n            display_name\n            pfp\n            bio\n        }\n        username {\n            username\n        }\n        id\n        address\n    }\n    stats {\n        comments\n        quotes\n        reposts\n        reactions\n    }\n    publication_ref\n}\n"): (typeof documents)["\nfragment NewPublication on Publication {\n    id\n    timestamp\n    content\n    creator {\n        profile {\n            display_name\n            pfp\n            bio\n        }\n        username {\n            username\n        }\n        id\n        address\n    }\n    stats {\n        comments\n        quotes\n        reposts\n        reactions\n    }\n    publication_ref\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Feed($page: Int!, $size: Int!, $type: Int){\n        publications(pagination: { page: $page, size: $size }, type: $type) {\n            __typename\n            id,\n            timestamp\n            content\n            stats {\n                comments\n                quotes\n                reposts\n                reactions\n            }\n            creator {\n                address\n                profile {\n                    pfp\n                    bio\n                    display_name\n                }\n                username {\n                    username\n                }\n                id\n            },\n            publication_ref\n        }\n    }\n"): (typeof documents)["\n    query Feed($page: Int!, $size: Int!, $type: Int){\n        publications(pagination: { page: $page, size: $size }, type: $type) {\n            __typename\n            id,\n            timestamp\n            content\n            stats {\n                comments\n                quotes\n                reposts\n                reactions\n            }\n            creator {\n                address\n                profile {\n                    pfp\n                    bio\n                    display_name\n                }\n                username {\n                    username\n                }\n                id\n            },\n            publication_ref\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query MyProfile ($address: String!){\n        account(address: $address){\n            id\n            profile {\n                display_name,\n                bio,\n                pfp,\n\n            },\n            username {\n                username\n            }\n        }\n    }\n"): (typeof documents)["\n    query MyProfile ($address: String!){\n        account(address: $address){\n            id\n            profile {\n                display_name,\n                bio,\n                pfp,\n\n            },\n            username {\n                username\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Publication($postRef: String!){\n        publication(ref: $postRef){\n            __typename\n            id,\n                timestamp\n                content\n                stats {\n                    comments\n                    quotes\n                    reposts\n                    reactions\n                }\n                creator {\n                    address\n                    profile {\n                        pfp\n                        bio\n                        display_name\n                    }\n                    username {\n                        username\n                    }\n                    id\n                },\n                publication_ref\n        }\n    }\n"): (typeof documents)["\n    query Publication($postRef: String!){\n        publication(ref: $postRef){\n            __typename\n            id,\n                timestamp\n                content\n                stats {\n                    comments\n                    quotes\n                    reposts\n                    reactions\n                }\n                creator {\n                    address\n                    profile {\n                        pfp\n                        bio\n                        display_name\n                    }\n                    username {\n                        username\n                    }\n                    id\n                },\n                publication_ref\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query PublicationStats($publication_ref: String!){\n        publicationStats(ref: $publication_ref) {\n        __typename\n        reposts\n        quotes\n        comments\n        reactions\n        ref\n    }\n    }\n"): (typeof documents)["\n    query PublicationStats($publication_ref: String!){\n        publicationStats(ref: $publication_ref) {\n        __typename\n        reposts\n        quotes\n        comments\n        reactions\n        ref\n    }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query PublicationInteractionsByViewer($ref: String!, $address: String!){\n        publicationInteractionsByViewer(ref: $ref , address: $address) {\n            __typename\n            reacted\n            quoted\n            quote_refs\n            commented\n            comment_refs\n            reposted\n            repost_refs\n            ref\n        }\n    }\n"): (typeof documents)["\n    query PublicationInteractionsByViewer($ref: String!, $address: String!){\n        publicationInteractionsByViewer(ref: $ref , address: $address) {\n            __typename\n            reacted\n            quoted\n            quote_refs\n            commented\n            comment_refs\n            reposted\n            repost_refs\n            ref\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query PublicationComments($publication_ref: String!, $page: Int!, $size: Int!) {\n        publicationComments(ref: $publication_ref, pagination: { page: $page, size: $size }) {\n            id\n            content\n            type\n            timestamp\n            publication_ref\n            creator {\n                address\n                profile {\n                    pfp\n                    bio\n                    display_name\n                }\n                username {\n                    username\n                }\n                id\n            }\n        }\n    }\n"): (typeof documents)["\n    query PublicationComments($publication_ref: String!, $page: Int!, $size: Int!) {\n        publicationComments(ref: $publication_ref, pagination: { page: $page, size: $size }) {\n            id\n            content\n            type\n            timestamp\n            publication_ref\n            creator {\n                address\n                profile {\n                    pfp\n                    bio\n                    display_name\n                }\n                username {\n                    username\n                }\n                id\n            }\n        }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;