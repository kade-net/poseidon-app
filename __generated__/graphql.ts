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
  comments?: Maybe<Array<Comment>>;
  delegates?: Maybe<Array<Delegate>>;
  followers?: Maybe<Array<Follow>>;
  following?: Maybe<Array<Follow>>;
  id: Scalars['Int']['output'];
  object_address: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  publications?: Maybe<Array<Publication>>;
  quotes?: Maybe<Array<Quote>>;
  reactions?: Maybe<Array<Reaction>>;
  reposts?: Maybe<Array<RePost>>;
  stats: AccountStats;
  timestamp: Scalars['Date']['output'];
  username?: Maybe<Username>;
};

export type AccountStats = {
  __typename?: 'AccountStats';
  comments: Scalars['Int']['output'];
  delegates: Scalars['Int']['output'];
  followers: Scalars['Int']['output'];
  following: Scalars['Int']['output'];
  publications: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
  reposts: Scalars['Int']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  comment_id?: Maybe<Scalars['Int']['output']>;
  comments?: Maybe<Array<Comment>>;
  content?: Maybe<Scalars['JSON']['output']>;
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  publication_id?: Maybe<Scalars['Int']['output']>;
  reactions?: Maybe<Array<Reaction>>;
  refference?: Maybe<PublicationRefference>;
  stats: CommentStats;
  timestamp: Scalars['Date']['output'];
};

export type CommentStats = {
  __typename?: 'CommentStats';
  comments: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
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
  comments?: Maybe<Array<Comment>>;
  content: Scalars['JSON']['output'];
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  quotes?: Maybe<Array<Quote>>;
  reactions?: Maybe<Array<Reaction>>;
  reposts?: Maybe<Array<RePost>>;
  stats: PublicationStats;
  timestamp: Scalars['Date']['output'];
};

export type PublicationRefference = Comment | Publication | Quote;

export type PublicationStats = {
  __typename?: 'PublicationStats';
  comments: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
  reposts: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts?: Maybe<Array<Account>>;
  comment?: Maybe<Comment>;
  comments?: Maybe<Array<Comment>>;
  publication?: Maybe<Publication>;
  publications?: Maybe<Array<Publication>>;
  quote?: Maybe<Quote>;
  quotes?: Maybe<Array<Quote>>;
  reaction?: Maybe<Reaction>;
  repost?: Maybe<RePost>;
  reposts?: Maybe<Array<RePost>>;
};


export type QueryAccountArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAccountsArgs = {
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryCommentArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCommentsArgs = {
  comment_type?: InputMaybe<Scalars['Int']['input']>;
  creator?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<Pagination>;
  refference_id?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryPublicationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPublicationsArgs = {
  creator?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryQuoteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryQuotesArgs = {
  creator?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<Pagination>;
  publication_id?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryReactionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRepostArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRepostsArgs = {
  creator?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<Pagination>;
  publication_id?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortOrder>;
};

export type Quote = {
  __typename?: 'Quote';
  comments?: Maybe<Array<Comment>>;
  content: Scalars['JSON']['output'];
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  publication: Publication;
  publication_id: Scalars['Int']['output'];
  reactions?: Maybe<Array<Reaction>>;
  stats: QuoteStats;
  timestamp: Scalars['Date']['output'];
};

export type QuoteStats = {
  __typename?: 'QuoteStats';
  comments: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
};

export type RePost = {
  __typename?: 'RePost';
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  publication: Publication;
  publication_id: Scalars['Int']['output'];
  timestamp: Scalars['Date']['output'];
};

export type Reaction = {
  __typename?: 'Reaction';
  comment_id?: Maybe<Scalars['Int']['output']>;
  creator: Account;
  creator_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  publication_id?: Maybe<Scalars['Int']['output']>;
  quote_id?: Maybe<Scalars['Int']['output']>;
  reaction: Scalars['Int']['output'];
  refference?: Maybe<PublicationRefference>;
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

export type FeedQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type FeedQuery = { __typename?: 'Query', publications?: Array<{ __typename?: 'Publication', id: number, timestamp: any, content: any, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', profile?: { __typename?: 'Profile', display_name?: string | null, pfp?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } }> | null };

export type MyProfileQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type MyProfileQuery = { __typename?: 'Query', account?: { __typename?: 'Account', id: number, profile?: { __typename?: 'Profile', display_name?: string | null, bio?: string | null, pfp?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } | null };

export type PostQueryVariables = Exact<{
  postId: Scalars['Int']['input'];
}>;


export type PostQuery = { __typename?: 'Query', publication?: { __typename?: 'Publication', id: number, timestamp: any, content: any, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', profile?: { __typename?: 'Profile', display_name?: string | null, pfp?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } } | null };


export const FeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Feed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FeedQuery, FeedQueryVariables>;
export const MyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<MyProfileQuery, MyProfileQueryVariables>;
export const PostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"POST"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PostQuery, PostQueryVariables>;