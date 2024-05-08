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


export type AccountFollowersArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type AccountFollowingArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type AccountPublicationsArgs = {
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['Int']['input']>;
};


export type AccountViewerArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  viewer?: InputMaybe<Scalars['Int']['input']>;
};

export type AccountStats = {
  __typename?: 'AccountStats';
  comments: Scalars['Int']['output'];
  delegates: Scalars['Int']['output'];
  followers: Scalars['Int']['output'];
  following: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  posts: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
  reposts: Scalars['Int']['output'];
};

export type AccountViewerStats = {
  __typename?: 'AccountViewerStats';
  followed: Scalars['Boolean']['output'];
  follows: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
};

export type Community = {
  __typename?: 'Community';
  creator: Account;
  description: Scalars['String']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  hosts?: Maybe<Array<Account>>;
  id: Scalars['Int']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  stats: CommunityStats;
  timestamp: Scalars['Date']['output'];
};

export type CommunityStats = {
  __typename?: 'CommunityStats';
  members: Scalars['Int']['output'];
  publications: Scalars['Int']['output'];
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

export type Membership = {
  __typename?: 'Membership';
  community: Community;
  community_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  timestamp: Scalars['Date']['output'];
  type: Scalars['Int']['output'];
  user: Account;
  user_kid: Scalars['Int']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  follow?: Maybe<Follow>;
  publication?: Maybe<Publication>;
  reaction?: Maybe<Reaction>;
  referenceDataId: Scalars['Int']['output'];
  referenceUser: Account;
  referenceUserId: Scalars['Int']['output'];
  timestamp: Scalars['Date']['output'];
  type: Scalars['Int']['output'];
};

export type Pagination = {
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  address: Scalars['String']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  creator: Scalars['Int']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  pfp?: Maybe<Scalars['String']['output']>;
};

export type Publication = {
  __typename?: 'Publication';
  children?: Maybe<Array<Publication>>;
  community?: Maybe<Community>;
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
  accountCommunities?: Maybe<Array<Community>>;
  accountPublications?: Maybe<Array<Publication>>;
  accountRelationship?: Maybe<AccountViewerStats>;
  accountStats?: Maybe<AccountStats>;
  accountUserName?: Maybe<Username>;
  accountViewerStats?: Maybe<AccountViewerStats>;
  accounts?: Maybe<Array<Account>>;
  accountsSearch?: Maybe<Array<Account>>;
  communities?: Maybe<Array<Community>>;
  communitiesSearch?: Maybe<Array<Community>>;
  community?: Maybe<Community>;
  communityPublications?: Maybe<Array<Publication>>;
  followers?: Maybe<Array<Account>>;
  following?: Maybe<Array<Account>>;
  membership?: Maybe<Membership>;
  memberships?: Maybe<Array<Account>>;
  publication?: Maybe<Publication>;
  publicationComments?: Maybe<Array<Publication>>;
  publicationInteractionsByViewer?: Maybe<PublicationViewerStats>;
  publicationStats?: Maybe<PublicationStats>;
  publications?: Maybe<Array<Publication>>;
  userNotifications?: Maybe<Array<Notification>>;
};


export type QueryAccountArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountCommunitiesArgs = {
  accountAddress: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryAccountPublicationsArgs = {
  accountAddress: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAccountRelationshipArgs = {
  accountAddress: Scalars['String']['input'];
  viewerAddress: Scalars['String']['input'];
};


export type QueryAccountStatsArgs = {
  accountAddress: Scalars['String']['input'];
};


export type QueryAccountUserNameArgs = {
  accountAddress: Scalars['String']['input'];
};


export type QueryAccountViewerStatsArgs = {
  accountAddress: Scalars['String']['input'];
  viewerAddress: Scalars['String']['input'];
};


export type QueryAccountsArgs = {
  pagination?: InputMaybe<Pagination>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryAccountsSearchArgs = {
  search: Scalars['String']['input'];
  userAddress: Scalars['String']['input'];
};


export type QueryCommunitiesArgs = {
  creator?: InputMaybe<Scalars['String']['input']>;
  following?: InputMaybe<Scalars['Boolean']['input']>;
  memberAddress?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<Pagination>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryCommunitiesSearchArgs = {
  memberAddress: Scalars['String']['input'];
  search: Scalars['String']['input'];
};


export type QueryCommunityArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCommunityPublicationsArgs = {
  communityId?: InputMaybe<Scalars['Int']['input']>;
  communityName?: InputMaybe<Scalars['String']['input']>;
  hide?: InputMaybe<Array<Scalars['String']['input']>>;
  muted?: InputMaybe<Array<Scalars['Int']['input']>>;
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryFollowersArgs = {
  accountAddress: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};


export type QueryFollowingArgs = {
  accountAddress: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};


export type QueryMembershipArgs = {
  communityName: Scalars['String']['input'];
  userAddress?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMembershipsArgs = {
  communityId?: InputMaybe<Scalars['Int']['input']>;
  communityName?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<Pagination>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryPublicationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  ref?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPublicationCommentsArgs = {
  hide?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  muted?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  creator_address?: InputMaybe<Scalars['String']['input']>;
  hide?: InputMaybe<Array<Scalars['String']['input']>>;
  muted?: InputMaybe<Array<Scalars['Int']['input']>>;
  pagination?: InputMaybe<Pagination>;
  reaction?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<Scalars['Int']['input']>;
  types?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryUserNotificationsArgs = {
  accountAddress: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
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

export type PublicationsQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  type?: InputMaybe<Scalars['Int']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  types?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  reaction?: InputMaybe<Scalars['Int']['input']>;
  hide?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  muted?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type PublicationsQuery = { __typename?: 'Query', publications?: Array<{ __typename: 'Publication', id: number, timestamp: any, content: any, type: number, publication_ref?: string | null, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, parent?: { __typename: 'Publication', id: number, timestamp: any, content: any, type: number, publication_ref?: string | null, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number } } | null, community?: { __typename?: 'Community', name: string, image: string } | null }> | null };

export type MyProfileQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type MyProfileQuery = { __typename?: 'Query', account?: { __typename?: 'Account', id: number, address: string, timestamp: any, profile?: { __typename?: 'Profile', address: string, display_name?: string | null, bio?: string | null, pfp?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } | null };

export type AccountStatsQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
}>;


export type AccountStatsQuery = { __typename?: 'Query', accountStats?: { __typename?: 'AccountStats', followers: number, following: number } | null };

export type AccountViewerStatsQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
  viewerAddress: Scalars['String']['input'];
}>;


export type AccountViewerStatsQuery = { __typename?: 'Query', accountViewerStats?: { __typename?: 'AccountViewerStats', id: number, follows: boolean, followed: boolean } | null };

export type PublicationQueryVariables = Exact<{
  postRef: Scalars['String']['input'];
}>;


export type PublicationQuery = { __typename?: 'Query', publication?: { __typename: 'Publication', id: number, timestamp: any, content: any, publication_ref?: string | null, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, parent?: { __typename: 'Publication', id: number, timestamp: any, content: any, type: number, creator_id: number, publication_ref?: string | null, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number } } | null } | null };

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
  hide?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  muted?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  sort?: InputMaybe<SortOrder>;
}>;


export type PublicationCommentsQuery = { __typename?: 'Query', publicationComments?: Array<{ __typename?: 'Publication', id: number, content: any, type: number, timestamp: any, publication_ref?: string | null, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } }> | null };

export type CommunitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  member?: InputMaybe<Scalars['String']['input']>;
}>;


export type CommunitiesQuery = { __typename?: 'Query', communities?: Array<{ __typename?: 'Community', id: number, name: string, description: string, image: string, timestamp: any, display_name?: string | null }> | null };

export type CommunityQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CommunityQuery = { __typename?: 'Query', community?: { __typename?: 'Community', id: number, name: string, description: string, image: string, timestamp: any, display_name?: string | null, creator: { __typename?: 'Account', address: string, username?: { __typename?: 'Username', username: string } | null }, stats: { __typename?: 'CommunityStats', members: number, publications: number } } | null };

export type CommunityPublicationsQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
  communityName: Scalars['String']['input'];
  hide?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  muted?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type CommunityPublicationsQuery = { __typename?: 'Query', communityPublications?: Array<{ __typename: 'Publication', id: number, timestamp: any, content: any, type: number, publication_ref?: string | null, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number }, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, parent?: { __typename: 'Publication', id: number, timestamp: any, content: any, type: number, publication_ref?: string | null, creator: { __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }, stats: { __typename?: 'PublicationStats', comments: number, quotes: number, reposts: number, reactions: number } } | null, community?: { __typename?: 'Community', name: string, image: string } | null }> | null };

export type MembershipQueryVariables = Exact<{
  communityName: Scalars['String']['input'];
  userAddress: Scalars['String']['input'];
}>;


export type MembershipQuery = { __typename?: 'Query', membership?: { __typename?: 'Membership', id: number, community_id: number, type: number, user_kid: number, timestamp: any, is_active: boolean } | null };

export type AccountsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type AccountsQuery = { __typename?: 'Query', accounts?: Array<{ __typename?: 'Account', id: number, address: string, timestamp: any, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }> | null };

export type FollowAccountQueryVariables = Exact<{
  address: Scalars['String']['input'];
  viewer: Scalars['String']['input'];
}>;


export type FollowAccountQuery = { __typename?: 'Query', account?: { __typename?: 'Account', viewer?: { __typename?: 'AccountViewerStats', followed: boolean, follows: boolean, id: number } | null } | null };

export type AccountRelationshipQueryVariables = Exact<{
  viewerAddress: Scalars['String']['input'];
  accountAddress: Scalars['String']['input'];
}>;


export type AccountRelationshipQuery = { __typename?: 'Query', accountRelationship?: { __typename?: 'AccountViewerStats', id: number, follows: boolean, followed: boolean } | null };

export type FollowersQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type FollowersQuery = { __typename?: 'Query', followers?: Array<{ __typename?: 'Account', address: string, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }> | null };

export type FollowingQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type FollowingQuery = { __typename?: 'Query', following?: Array<{ __typename?: 'Account', address: string, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }> | null };

export type MembershipsQueryVariables = Exact<{
  communityName: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MembershipsQuery = { __typename?: 'Query', memberships?: Array<{ __typename?: 'Account', id: number, address: string, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, display_name?: string | null, bio?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }> | null };

export type CommunitiesSearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
  memberAddress: Scalars['String']['input'];
}>;


export type CommunitiesSearchQuery = { __typename?: 'Query', communitiesSearch?: Array<{ __typename?: 'Community', id: number, name: string, description: string, image: string, timestamp: any, display_name?: string | null }> | null };

export type AccountsSearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
  userAddress: Scalars['String']['input'];
}>;


export type AccountsSearchQuery = { __typename?: 'Query', accountsSearch?: Array<{ __typename?: 'Account', address: string, id: number, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, bio?: string | null, display_name?: string | null } | null, username?: { __typename?: 'Username', username: string } | null }> | null };

export type UserNotificationsQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type UserNotificationsQuery = { __typename?: 'Query', userNotifications?: Array<{ __typename?: 'Notification', referenceUserId: number, type: number, timestamp: any, referenceDataId: number, referenceUser: { __typename?: 'Account', id: number, address: string, username?: { __typename?: 'Username', username: string } | null, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, display_name?: string | null } | null }, follow?: { __typename?: 'Follow', follower: { __typename?: 'Account', address: string, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, display_name?: string | null } | null } } | null, publication?: { __typename?: 'Publication', content: any, type: number, publication_ref?: string | null, creator: { __typename?: 'Account', address: string, profile?: { __typename?: 'Profile', address: string, pfp?: string | null, display_name?: string | null } | null }, parent?: { __typename?: 'Publication', content: any, type: number, publication_ref?: string | null } | null } | null, reaction?: { __typename?: 'Reaction', publication_id?: number | null, reaction: number, publication?: { __typename?: 'Publication', content: any } | null, creator: { __typename?: 'Account', address: string, profile?: { __typename?: 'Profile', address: string, display_name?: string | null, pfp?: string | null } | null, username?: { __typename?: 'Username', username: string } | null } } | null }> | null };

export type AccountUserNameQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
}>;


export type AccountUserNameQuery = { __typename?: 'Query', accountUserName?: { __typename?: 'Username', username: string, owner_address: string, token_address: string, timestamp: any } | null };

export type AccountCommunitiesQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
}>;


export type AccountCommunitiesQuery = { __typename?: 'Query', accountCommunities?: Array<{ __typename?: 'Community', id: number, name: string, description: string, image: string, timestamp: any, display_name?: string | null, creator: { __typename?: 'Account', id: number, address: string }, hosts?: Array<{ __typename?: 'Account', address: string }> | null }> | null };


export const PublicationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hide"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"muted"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"creator_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}},{"kind":"Argument","name":{"kind":"Name","value":"reaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}}},{"kind":"Argument","name":{"kind":"Name","value":"hide"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hide"}}},{"kind":"Argument","name":{"kind":"Name","value":"muted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"muted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<PublicationsQuery, PublicationsQueryVariables>;
export const MyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<MyProfileQuery, MyProfileQueryVariables>;
export const AccountStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}}]}}]}}]} as unknown as DocumentNode<AccountStatsQuery, AccountStatsQueryVariables>;
export const AccountViewerStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountViewerStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewerAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountViewerStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewerAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewerAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"follows"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}}]}}]}}]} as unknown as DocumentNode<AccountViewerStatsQuery, AccountViewerStatsQueryVariables>;
export const PublicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Publication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postRef"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postRef"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"creator_id"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PublicationQuery, PublicationQueryVariables>;
export const PublicationStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicationStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicationStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}}]}}]}}]} as unknown as DocumentNode<PublicationStatsQuery, PublicationStatsQueryVariables>;
export const PublicationInteractionsByViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicationInteractionsByViewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicationInteractionsByViewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ref"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"reacted"}},{"kind":"Field","name":{"kind":"Name","value":"quoted"}},{"kind":"Field","name":{"kind":"Name","value":"quote_refs"}},{"kind":"Field","name":{"kind":"Name","value":"commented"}},{"kind":"Field","name":{"kind":"Name","value":"comment_refs"}},{"kind":"Field","name":{"kind":"Name","value":"reposted"}},{"kind":"Field","name":{"kind":"Name","value":"repost_refs"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}}]}}]}}]} as unknown as DocumentNode<PublicationInteractionsByViewerQuery, PublicationInteractionsByViewerQueryVariables>;
export const PublicationCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicationComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hide"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"muted"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortOrder"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicationComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publication_ref"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"hide"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hide"}}},{"kind":"Argument","name":{"kind":"Name","value":"muted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"muted"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PublicationCommentsQuery, PublicationCommentsQueryVariables>;
export const CommunitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Communities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"member"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"memberAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"member"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}}]} as unknown as DocumentNode<CommunitiesQuery, CommunitiesQueryVariables>;
export const CommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Community"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"}},{"kind":"Field","name":{"kind":"Name","value":"publications"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityQuery, CommunityQueryVariables>;
export const CommunityPublicationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunityPublications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hide"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"muted"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityPublications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"communityName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityName"}}},{"kind":"Argument","name":{"kind":"Name","value":"hide"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hide"}}},{"kind":"Argument","name":{"kind":"Name","value":"muted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"muted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"}},{"kind":"Field","name":{"kind":"Name","value":"reposts"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityPublicationsQuery, CommunityPublicationsQueryVariables>;
export const MembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Membership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityName"}}},{"kind":"Argument","name":{"kind":"Name","value":"userAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"community_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user_kid"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"is_active"}}]}}]}}]} as unknown as DocumentNode<MembershipQuery, MembershipQueryVariables>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const FollowAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FollowAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followed"}},{"kind":"Field","name":{"kind":"Name","value":"follows"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FollowAccountQuery, FollowAccountQueryVariables>;
export const AccountRelationshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountRelationship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewerAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountRelationship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"viewerAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewerAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"follows"}},{"kind":"Field","name":{"kind":"Name","value":"followed"}}]}}]}}]} as unknown as DocumentNode<AccountRelationshipQuery, AccountRelationshipQueryVariables>;
export const FollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Followers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<FollowersQuery, FollowersQueryVariables>;
export const FollowingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Following"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"following"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<FollowingQuery, FollowingQueryVariables>;
export const MembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Memberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"communityName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"communityName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"communityName"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<MembershipsQuery, MembershipsQueryVariables>;
export const CommunitiesSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunitiesSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communitiesSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}}]} as unknown as DocumentNode<CommunitiesSearchQuery, CommunitiesSearchQueryVariables>;
export const AccountsSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountsSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountsSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"userAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AccountsSearchQuery, AccountsSearchQueryVariables>;
export const UserNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"referenceUserId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"referenceDataId"}},{"kind":"Field","name":{"kind":"Name","value":"referenceUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"follow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follower"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"publication_ref"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publication_id"}},{"kind":"Field","name":{"kind":"Name","value":"reaction"}},{"kind":"Field","name":{"kind":"Name","value":"publication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserNotificationsQuery, UserNotificationsQueryVariables>;
export const AccountUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountUserName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountUserName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"owner_address"}},{"kind":"Field","name":{"kind":"Name","value":"token_address"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<AccountUserNameQuery, AccountUserNameQueryVariables>;
export const AccountCommunitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountCommunities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"size"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountCommunities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"Variable","name":{"kind":"Name","value":"size"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]}}]} as unknown as DocumentNode<AccountCommunitiesQuery, AccountCommunitiesQueryVariables>;