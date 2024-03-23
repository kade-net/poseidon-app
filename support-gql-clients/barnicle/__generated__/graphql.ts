/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  address: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  object_address: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  timestamp: Scalars['Date']['output'];
  username?: Maybe<Username>;
};

export type Collection = {
  __typename?: 'Collection';
  description: Scalars['String']['output'];
  kade_collectors_count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  supply: Scalars['Int']['output'];
  uri: Scalars['String']['output'];
};

export type Pagination = {
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  bio?: Maybe<Scalars['String']['output']>;
  creator: Scalars['Int']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  pfp?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  collection?: Maybe<Collection>;
  collectors?: Maybe<Array<Account>>;
};


export type QueryCollectionArgs = {
  address: Scalars['String']['input'];
};


export type QueryCollectorsArgs = {
  collection_address: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Username = {
  __typename?: 'Username';
  owner_address: Scalars['String']['output'];
  timestamp: Scalars['Date']['output'];
  token_address: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type GetCollectionDetailsQueryVariables = Exact<{
  collectionAddress: Scalars['String']['input'];
}>;


export type GetCollectionDetailsQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', kade_collectors_count: number, name: string, description: string } | null };

export type GetCollectorsQueryVariables = Exact<{
  collectionAddress: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type GetCollectorsQuery = { __typename?: 'Query', collectors?: Array<{ __typename?: 'Account', id: number, timestamp: any, address: string, profile?: { __typename?: 'Profile', pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }> | null };


export const GetCollectionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kade_collectors_count"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetCollectionDetailsQuery, GetCollectionDetailsQueryVariables>;
export const GetCollectorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"collection_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<GetCollectorsQuery, GetCollectorsQueryVariables>;