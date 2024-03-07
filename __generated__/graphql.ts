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
  bio?: Maybe<Scalars['String']['output']>;
  delegates?: Maybe<Array<Delegate>>;
  followers?: Maybe<Array<Follow>>;
  following?: Maybe<Array<Follow>>;
  id: Scalars['Int']['output'];
  object_address: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  publications?: Maybe<Array<Publication>>;
  reactions?: Maybe<Array<Reaction>>;
  stats: AccountStats;
  timestamp: Scalars['Date']['output'];
  username?: Maybe<Username>;
  viewer?: Maybe<AccountViewerStats>;
};


export type AccountPublicationsArgs = {
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['Int']['input']>;
};


export type AccountViewerArgs = {
  viewer?: InputMaybe<Scalars['Int']['input']>;
};

export type AccountStats = {
  __typename?: 'AccountStats';
  comments: Scalars['Int']['output'];
  delegates: Scalars['Int']['output'];
  followers: Scalars['Int']['output'];
  following: Scalars['Int']['output'];
  posts: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
  reposts: Scalars['Int']['output'];
};

export type AccountViewerStats = {
  __typename?: 'AccountViewerStats';
  followed: Scalars['Boolean']['output'];
  follows: Scalars['Boolean']['output'];
};

export type Delegate = {
  __typename?: 'Delegate';
  address: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  owner: Account;
  owner_id: Scalars['Int']['output'];
  timestamp: Scalars['Date']['output'];
};

export type Follow = {
  __typename?: 'Follow';
  follower: Account;
  follower_id: Scalars['Int']['output'];
  following: Account;
  following_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  timestamp: Scalars['Date']['output'];
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

export type Publication = {
  __typename?: 'Publication';
  children?: Maybe<Array<Publication>>;
  content: Scalars['JSON']['output'];
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  parent?: Maybe<Publication>;
  publication_ref?: Maybe<Scalars['String']['output']>;
  reactions?: Maybe<Array<Reaction>>;
  stats: PublicationStats;
  timestamp: Scalars['Date']['output'];
  type: Scalars['Int']['output'];
  viewer?: Maybe<PublicationViewerStats>;
};


export type PublicationChildrenArgs = {
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['Int']['input']>;
};


export type PublicationViewerArgs = {
  viewer?: InputMaybe<Scalars['Int']['input']>;
};

export type PublicationStats = {
  __typename?: 'PublicationStats';
  comments: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
  ref: Scalars['String']['output'];
  reposts: Scalars['Int']['output'];
};

export type PublicationViewerStats = {
  __typename?: 'PublicationViewerStats';
  comment_refs?: Maybe<Array<Scalars['String']['output']>>;
  commented: Scalars['Boolean']['output'];
  quote_refs?: Maybe<Array<Scalars['String']['output']>>;
  quoted: Scalars['Boolean']['output'];
  reacted: Scalars['Boolean']['output'];
  ref: Scalars['String']['output'];
  repost_refs?: Maybe<Array<Scalars['String']['output']>>;
  reposted: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts?: Maybe<Array<Account>>;
  publication?: Maybe<Publication>;
  publicationComments?: Maybe<Array<Publication>>;
  publicationInteractionsByViewer?: Maybe<PublicationViewerStats>;
  publicationStats?: Maybe<PublicationStats>;
  publications?: Maybe<Array<Publication>>;
};


export type QueryAccountArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAccountsArgs = {
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryPublicationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  ref?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPublicationCommentsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<Pagination>;
  ref?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryPublicationInteractionsByViewerArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  ref?: InputMaybe<Scalars['String']['input']>;
  viewer?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPublicationStatsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  ref?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPublicationsArgs = {
  creator?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

export type Reaction = {
  __typename?: 'Reaction';
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  publication?: Maybe<Publication>;
  publication_id?: Maybe<Scalars['Int']['output']>;
  reaction: Scalars['Int']['output'];
  timestamp: Scalars['Date']['output'];
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

export type NewPublicationFragment = { __typename?: 'Publication', id: number, timestamp: any, content: any, publication_ref?: string | null, creator: { __typename?: 'Account', id: number, address: string, profile?: { __typename?: 'Profile', display_name?: string | null, pfp?: string | null, bio?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number } } & { ' $fragmentName'?: 'NewPublicationFragment' };

export type FeedQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  type?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FeedQuery = { __typename?: 'Query', publications?: Array<{ __typename: 'Publication', id: number, timestamp: any, content: any, publication_ref?: string | null, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } }> | null };

export type MyProfileQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type MyProfileQuery = { __typename?: 'Query', account?: { __typename?: 'Account', id: number, profile?: { __typename?: 'Profile', display_name?: string | null, bio?: string | null, pfp?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } | null };

export type PublicationQueryVariables = Exact<{
  postRef: Scalars['String']['input'];
}>;


export type PublicationQuery = { __typename?: 'Query', publication?: { __typename: 'Publication', id: number, timestamp: any, content: any, publication_ref?: string | null, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } } | null };

export type PublicationStatsQueryVariables = Exact<{
  publication_ref: Scalars['String']['input'];
}>;


export type PublicationStatsQuery = { __typename?: 'Query', publicationStats?: { __typename: 'PublicationStats', reposts: number, quotes: number, comments: number, reactions: number, ref: string } | null };

export type PublicationInteractionsByViewerQueryVariables = Exact<{
  ref: Scalars['String']['input'];
  address: Scalars['String']['input'];
}>;


export type PublicationInteractionsByViewerQuery = { __typename?: 'Query', publicationInteractionsByViewer?: { __typename: 'PublicationViewerStats', reacted: boolean, quoted: boolean, quote_refs?: Array<string> | null, commented: boolean, comment_refs?: Array<string> | null, reposted: boolean, repost_refs?: Array<string> | null, ref: string } | null };

export type PublicationCommentsQueryVariables = Exact<{
  publication_ref: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type PublicationCommentsQuery = { __typename?: 'Query', publicationComments?: Array<{ __typename?: 'Publication', id: number, content: any, type: number, timestamp: any, publication_ref?: string | null, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } }> | null };

export const NewPublicationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewPublication"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Publication"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}}]}}]} as unknown as DocumentNode<NewPublicationFragment, unknown>;
export const FeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Feed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}}]}}]}}]} as unknown as DocumentNode<FeedQuery, FeedQueryVariables>;
export const MyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<MyProfileQuery, MyProfileQueryVariables>;
export const PublicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postRef"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postRef"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}}]}}]}}]} as unknown as DocumentNode<PublicationQuery, PublicationQueryVariables>;
export const PublicationStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicationStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicationStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}}]}}]}}]} as unknown as DocumentNode<PublicationStatsQuery, PublicationStatsQueryVariables>;
export const PublicationInteractionsByViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicationInteractionsByViewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicationInteractionsByViewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ref"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"reacted"}},{"kind":"Field","name":{"kind":"Name","value":"quoted"}},{"kind":"Field","name":{"kind":"Name","value":"quote_refs"}},{"kind":"Field","name":{"kind":"Name","value":"commented"}},{"kind":"Field","name":{"kind":"Name","value":"comment_refs"}},{"kind":"Field","name":{"kind":"Name","value":"reposted"}},{"kind":"Field","name":{"kind":"Name","value":"repost_refs"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}}]}}]}}]} as unknown as DocumentNode<PublicationInteractionsByViewerQuery, PublicationInteractionsByViewerQueryVariables>;
export const PublicationCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicationComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicationComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PublicationCommentsQuery, PublicationCommentsQueryVariables>;