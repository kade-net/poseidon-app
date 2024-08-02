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

export type AcceptRequestArgs = {
  requester_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type AnchorTransaction = {
  __typename?: 'AnchorTransaction';
  anchor_amount?: Maybe<Scalars['Int']['output']>;
  receiver_address?: Maybe<Scalars['String']['output']>;
  sender_address?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['Date']['output']>;
  type?: Maybe<AnchorTransactionType>;
};

export enum AnchorTransactionType {
  Deposit = 'DEPOSIT',
  Transfer = 'TRANSFER',
  Withdraw = 'WITHDRAW'
}

export type Badge = {
  __typename?: 'Badge';
  owner: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['Date']['output']>;
  type: Scalars['String']['output'];
};

export type CAccount = {
  __typename?: 'CAccount';
  address: Scalars['String']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  pfp?: Maybe<Scalars['String']['output']>;
  public_key: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Connection = {
  __typename?: 'Connection';
  delegate_address?: Maybe<Scalars['String']['output']>;
  is_delegate_linked?: Maybe<Scalars['Boolean']['output']>;
  is_intent_created?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['Date']['output']>;
  user_address: Scalars['String']['output'];
};

export type Contact = {
  __typename?: 'Contact';
  accepted: Scalars['Boolean']['output'];
  address: Scalars['String']['output'];
  envelope?: Maybe<Scalars['JSON']['output']>;
  timestamp?: Maybe<Scalars['Date']['output']>;
  user_address: Scalars['String']['output'];
};

export type CreateDelegateLinkIntentArgs = {
  delegate_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type CreatePublicationReturnType = {
  __typename?: 'CreatePublicationReturnType';
  client_ref: Scalars['String']['output'];
  txn: SerializedTransaction;
};

export type Delegate = {
  __typename?: 'Delegate';
  address: Scalars['String']['output'];
  hid: Scalars['String']['output'];
  public_key?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['Date']['output']>;
  user_address: Scalars['String']['output'];
};

export type DelegateAcceptRequestArgs = {
  requester_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type DelegateDenyRequest = {
  requester_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type DelegateRemoveFromPhoneBook = {
  sender_address: Scalars['String']['input'];
  unwanted_address: Scalars['String']['input'];
};

export type DelegateRequestConversationArgs = {
  envelope: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type DenyRequestArgs = {
  requester_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type Envelope = {
  __typename?: 'Envelope';
  content?: Maybe<Scalars['JSON']['output']>;
  delegate_public_key?: Maybe<Scalars['String']['output']>;
  hid: Scalars['String']['output'];
  inbox_name: Scalars['String']['output'];
  receiver: Scalars['String']['output'];
  receiver_public_key: Scalars['String']['output'];
  ref: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  sender_public_key: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['Date']['output']>;
};

export type Inbox = {
  __typename?: 'Inbox';
  active: Scalars['Boolean']['output'];
  hid: Scalars['String']['output'];
  id: Scalars['String']['output'];
  initiator_address: Scalars['String']['output'];
  owner_address: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['Date']['output']>;
};

export type KeyValuePair = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptRequest: SerializedTransaction;
  addDelegateToKadeAndHermes: SerializedTransaction;
  adminRemoveAccount: Scalars['Boolean']['output'];
  cleanAnchorOrder?: Maybe<Scalars['String']['output']>;
  communityAddHost: Scalars['String']['output'];
  confirmAnchorOrder?: Maybe<Scalars['Boolean']['output']>;
  confirmDelegate?: Maybe<Scalars['Boolean']['output']>;
  confirmIntent?: Maybe<Scalars['Boolean']['output']>;
  createAccountAndDelegateLinkIntent: SerializedTransaction;
  createAccountLinkIntent: SerializedTransaction;
  createAnchorOrder?: Maybe<Scalars['String']['output']>;
  createCommunity: Scalars['String']['output'];
  createConnection?: Maybe<Scalars['String']['output']>;
  createDelegateLinkIntent: SerializedTransaction;
  createPublication: CreatePublicationReturnType;
  createPublicationWithRef: CreatePublicationReturnType;
  createReaction: SerializedTransaction;
  createReactionWithRef: SerializedTransaction;
  delegateAcceptRequest: SerializedTransaction;
  delegateDenyRequest: SerializedTransaction;
  delegateRemoveFromPhoneBook: SerializedTransaction;
  delegateRequestConversation: SerializedTransaction;
  delegateSendEnvelope: SerializedTransaction;
  deleteCommunity: Scalars['String']['output'];
  denyRequest: SerializedTransaction;
  followAccount: SerializedTransaction;
  initKadeAccountWithHermesInboxAndDelegate: SerializedTransaction;
  initSelfDelegateKadeAccountWithHermesInbox: SerializedTransaction;
  joinCommunity: Scalars['String']['output'];
  registerDelegate: SerializedTransaction;
  registerDelegateOnKadeAndHermes: SerializedTransaction;
  registerInboxAndDelegate: SerializedTransaction;
  registerRequestInbox: SerializedTransaction;
  removeCommunityHost: Scalars['String']['output'];
  removeDelegate: SerializedTransaction;
  removeFromPhoneBook: SerializedTransaction;
  removePublication: CreatePublicationReturnType;
  removePublicationWithRef: SerializedTransaction;
  removeReaction: SerializedTransaction;
  removeReactionWithRef: SerializedTransaction;
  requestConversation: SerializedTransaction;
  send: SerializedTransaction;
  setupSelfDelegate: SerializedTransaction;
  unfollowAccount: SerializedTransaction;
  updateCommunity: Scalars['String']['output'];
  updateConnection?: Maybe<Scalars['Boolean']['output']>;
  updateProfile: SerializedTransaction;
  uploadFile: UploadedFileResponse;
};


export type MutationAcceptRequestArgs = {
  input: AcceptRequestArgs;
};


export type MutationAddDelegateToKadeAndHermesArgs = {
  input: AddDelegateToKadeAndHermesArgs;
};


export type MutationAdminRemoveAccountArgs = {
  input: AdminRemoveAccountArgs;
};


export type MutationCleanAnchorOrderArgs = {
  input: CleanAnchorOrderInput;
};


export type MutationCommunityAddHostArgs = {
  input: AddHostInput;
};


export type MutationConfirmAnchorOrderArgs = {
  input: ConfirmAnchorOrderInput;
};


export type MutationConfirmDelegateArgs = {
  input: ConfirmDelegateInput;
};


export type MutationConfirmIntentArgs = {
  input: ConfirmIntentInput;
};


export type MutationCreateAccountAndDelegateLinkIntentArgs = {
  input: CreateAccountAndDelegateLinkIntentInput;
};


export type MutationCreateAccountLinkIntentArgs = {
  input: CreateAccountLinkIntentInput;
};


export type MutationCreateAnchorOrderArgs = {
  input: CreateAnchorOrderInput;
};


export type MutationCreateCommunityArgs = {
  input: CreateCommunityInput;
};


export type MutationCreateConnectionArgs = {
  input: CreateConnectionInput;
};


export type MutationCreateDelegateLinkIntentArgs = {
  input: CreateDelegateLinkIntentArgs;
};


export type MutationCreatePublicationArgs = {
  input: CreatePublicationInput;
};


export type MutationCreatePublicationWithRefArgs = {
  input: CreatePublicationWithRefInput;
};


export type MutationCreateReactionArgs = {
  input: CreateReactionInput;
};


export type MutationCreateReactionWithRefArgs = {
  input: CreateReactionWithRefInput;
};


export type MutationDelegateAcceptRequestArgs = {
  input: DelegateAcceptRequestArgs;
};


export type MutationDelegateDenyRequestArgs = {
  input: DelegateDenyRequest;
};


export type MutationDelegateRemoveFromPhoneBookArgs = {
  input: DelegateRemoveFromPhoneBook;
};


export type MutationDelegateRequestConversationArgs = {
  input: DelegateRequestConversationArgs;
};


export type MutationDelegateSendEnvelopeArgs = {
  input: SendArgs;
};


export type MutationDeleteCommunityArgs = {
  input: DeleteCommunityInput;
};


export type MutationDenyRequestArgs = {
  input: DenyRequestArgs;
};


export type MutationFollowAccountArgs = {
  input: FollowAccountInput;
};


export type MutationInitKadeAccountWithHermesInboxAndDelegateArgs = {
  input: InitKadeAccountWithHermesInboxAndDelegateArgs;
};


export type MutationInitSelfDelegateKadeAccountWithHermesInboxArgs = {
  input: InitSelfDelegateKadeAccountWithHermesInboxArgs;
};


export type MutationJoinCommunityArgs = {
  input: JoinCommunityInput;
};


export type MutationRegisterDelegateArgs = {
  input: RegisterDelegateArgs;
};


export type MutationRegisterDelegateOnKadeAndHermesArgs = {
  input: RegisterDelegateOnKadeAndHermesArgs;
};


export type MutationRegisterInboxAndDelegateArgs = {
  input: RegisterInboxAndDelegateArg;
};


export type MutationRegisterRequestInboxArgs = {
  input: RegisterRequestInboxInputArgs;
};


export type MutationRemoveCommunityHostArgs = {
  input: RemoveCommunityHostInput;
};


export type MutationRemoveDelegateArgs = {
  input: RemoveDelegateArgs;
};


export type MutationRemoveFromPhoneBookArgs = {
  input: RemoveFromPhoneBookArgs;
};


export type MutationRemovePublicationArgs = {
  input: RemovePublicationInput;
};


export type MutationRemovePublicationWithRefArgs = {
  input: RemovePublicationWithRefInput;
};


export type MutationRemoveReactionArgs = {
  input: RemoveReactionInput;
};


export type MutationRemoveReactionWithRefArgs = {
  input: RemoveReactionWithRefInput;
};


export type MutationRequestConversationArgs = {
  input: RequestConversationArgs;
};


export type MutationSendArgs = {
  input: SendArgs;
};


export type MutationSetupSelfDelegateArgs = {
  input: SetupSelfDelegateArgs;
};


export type MutationUnfollowAccountArgs = {
  input: UnfollowAccountInput;
};


export type MutationUpdateCommunityArgs = {
  input: UpdateCommunityInput;
};


export type MutationUpdateConnectionArgs = {
  input: UpdateConnectionInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUploadFileArgs = {
  input: UploadFileInput;
};

export type PhoneBook = {
  __typename?: 'PhoneBook';
  address: Scalars['String']['output'];
  contacts?: Maybe<Array<Contact>>;
  delegates?: Maybe<Array<Delegate>>;
  hid: Scalars['String']['output'];
  public_key: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['Date']['output']>;
};

export type Portal = {
  __typename?: 'Portal';
  created_at?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  post_id: Scalars['Int']['output'];
  url: Scalars['String']['output'];
  user_kid: Scalars['Int']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  accounts: Array<CAccount>;
  anchorTransactions: Array<AnchorTransaction>;
  connection?: Maybe<Connection>;
  getRanking?: Maybe<Ranking>;
  phoneBook?: Maybe<PhoneBook>;
  portals?: Maybe<Array<Portal>>;
};


export type QueryAccountsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  viewer?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAnchorTransactionsArgs = {
  user_address: Scalars['String']['input'];
};


export type QueryConnectionArgs = {
  connection_id: Scalars['String']['input'];
};


export type QueryGetRankingArgs = {
  duration?: InputMaybe<Scalars['String']['input']>;
  user_address: Scalars['String']['input'];
};


export type QueryPhoneBookArgs = {
  address: Scalars['String']['input'];
};

export type Ranking = {
  __typename?: 'Ranking';
  badges?: Maybe<Array<Badge>>;
  points: Scalars['Int']['output'];
  rank: Scalars['String']['output'];
};

export type RegisterDelegateArgs = {
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type RegisterRequestInboxInputArgs = {
  address: Scalars['String']['input'];
  public_key: Scalars['String']['input'];
};

export type RemoveDelegateArgs = {
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type RemoveFromPhoneBookArgs = {
  sender_address: Scalars['String']['input'];
  unwanted_address: Scalars['String']['input'];
};

export type RequestConversationArgs = {
  envelope: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type SendArgs = {
  content: Scalars['String']['input'];
  ref: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  to: Scalars['String']['input'];
};

export type SerializedTransaction = {
  __typename?: 'SerializedTransaction';
  raw_transaction: Array<Scalars['Int']['output']>;
  signature: Array<Scalars['Int']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  liveInbox: Envelope;
};


export type SubscriptionLiveInboxArgs = {
  inbox_name: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Date']['input']>;
  viewer: Scalars['String']['input'];
};

export type UploadFileDimensions = {
  height: Scalars['Int']['input'];
  width: Scalars['Int']['input'];
};

export type UploadFileInput = {
  delegate_address: Scalars['String']['input'];
  dimensions?: InputMaybe<UploadFileDimensions>;
  file_byte_size: Scalars['Int']['input'];
  file_name: Scalars['String']['input'];
  file_type: Scalars['String']['input'];
};

export type UploadedFileResponse = {
  __typename?: 'UploadedFileResponse';
  file_url: Scalars['String']['output'];
  upload_url: Scalars['String']['output'];
};

export type AddDelegateToKadeAndHermesArgs = {
  delegate_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type AddHostInput = {
  community_name: Scalars['String']['input'];
  host_address: Scalars['String']['input'];
  host_username: Scalars['String']['input'];
  member_address: Scalars['String']['input'];
  member_username: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type AdminRemoveAccountArgs = {
  user_address: Scalars['String']['input'];
};

export type CleanAnchorOrderInput = {
  user_address: Scalars['String']['input'];
};

export type ConfirmAnchorOrderInput = {
  anchor_amount: Scalars['Int']['input'];
  user_address: Scalars['String']['input'];
};

export type ConfirmDelegateInput = {
  connection_id: Scalars['String']['input'];
};

export type ConfirmIntentInput = {
  connection_id: Scalars['String']['input'];
};

export type CreateAccountAndDelegateLinkIntentInput = {
  delegate_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateAccountLinkIntentInput = {
  delegate_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type CreateAnchorOrderInput = {
  anchor_amount: Scalars['Int']['input'];
  apt_amount: Scalars['Int']['input'];
  user_address: Scalars['String']['input'];
};

export type CreateCommunityInput = {
  creator_address: Scalars['String']['input'];
  description: Scalars['String']['input'];
  image: Scalars['String']['input'];
  name: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  topics: Array<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type CreateConnectionInput = {
  user_address: Scalars['String']['input'];
};

export type CreatePublicationInput = {
  delegate_address: Scalars['String']['input'];
  payload?: InputMaybe<CreatePublicationPayload>;
  reference_kid?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePublicationMedia = {
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type CreatePublicationPayload = {
  community?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  media?: InputMaybe<Array<CreatePublicationMedia>>;
  mentions?: InputMaybe<Array<KeyValuePair>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreatePublicationWithRefInput = {
  delegate_address: Scalars['String']['input'];
  parent_ref: Scalars['String']['input'];
  payload?: InputMaybe<CreatePublicationPayload>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateReactionInput = {
  delegate_address: Scalars['String']['input'];
  reaction: Scalars['Int']['input'];
  reference_kid: Scalars['Int']['input'];
};

export type CreateReactionWithRefInput = {
  delegate_address: Scalars['String']['input'];
  reaction: Scalars['Int']['input'];
  ref: Scalars['String']['input'];
};

export type DeleteCommunityInput = {
  community_name: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type FollowAccountInput = {
  delegate_address: Scalars['String']['input'];
  following_address: Scalars['String']['input'];
};

export type InitKadeAccountWithHermesInboxAndDelegateArgs = {
  delegate_address: Scalars['String']['input'];
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type InitSelfDelegateKadeAccountWithHermesInboxArgs = {
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type JoinCommunityInput = {
  community_name: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterDelegateOnKadeAndHermesArgs = {
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type RegisterInboxAndDelegateArg = {
  delegate_address: Scalars['String']['input'];
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type RemoveCommunityHostInput = {
  community_name: Scalars['String']['input'];
  host_address: Scalars['String']['input'];
  host_username: Scalars['String']['input'];
  member_address: Scalars['String']['input'];
  member_username: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
};

export type RemovePublicationInput = {
  delegate_address: Scalars['String']['input'];
  kid: Scalars['Int']['input'];
};

export type RemovePublicationWithRefInput = {
  delegate_address: Scalars['String']['input'];
  ref: Scalars['String']['input'];
};

export type RemoveReactionInput = {
  delegate_address: Scalars['String']['input'];
  kid: Scalars['Int']['input'];
};

export type RemoveReactionWithRefInput = {
  delegate_address: Scalars['String']['input'];
  ref: Scalars['String']['input'];
};

export type SetupSelfDelegateArgs = {
  sender_address: Scalars['String']['input'];
};

export type UnfollowAccountInput = {
  delegate_address: Scalars['String']['input'];
  unfollowing_address: Scalars['String']['input'];
};

export type UpdateCommunityInput = {
  community: Scalars['String']['input'];
  description: Scalars['String']['input'];
  display_name: Scalars['String']['input'];
  image: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UpdateConnectionInput = {
  connection_id: Scalars['String']['input'];
  delegate_address: Scalars['String']['input'];
};

export type UpdateProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  delegate_address: Scalars['String']['input'];
  display_name?: InputMaybe<Scalars['String']['input']>;
  pfp?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterRequestInboxMutationVariables = Exact<{
  args: RegisterRequestInboxInputArgs;
}>;


export type RegisterRequestInboxMutation = { __typename?: 'Mutation', registerRequestInbox: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type RequestConversationMutationVariables = Exact<{
  args: RequestConversationArgs;
}>;


export type RequestConversationMutation = { __typename?: 'Mutation', requestConversation: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type AcceptRequestMutationVariables = Exact<{
  args: AcceptRequestArgs;
}>;


export type AcceptRequestMutation = { __typename?: 'Mutation', acceptRequest: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type DelegateAcceptRequestMutationVariables = Exact<{
  args: DelegateAcceptRequestArgs;
}>;


export type DelegateAcceptRequestMutation = { __typename?: 'Mutation', delegateAcceptRequest: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type DelegateRequestConversationMutationVariables = Exact<{
  args: DelegateRequestConversationArgs;
}>;


export type DelegateRequestConversationMutation = { __typename?: 'Mutation', delegateRequestConversation: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type SendMutationVariables = Exact<{
  args: SendArgs;
}>;


export type SendMutation = { __typename?: 'Mutation', send: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type DelegateSendEnvelopeMutationVariables = Exact<{
  args: SendArgs;
}>;


export type DelegateSendEnvelopeMutation = { __typename?: 'Mutation', delegateSendEnvelope: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type LiveInboxSubscriptionVariables = Exact<{
  inbox_name: Scalars['String']['input'];
  viewer: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Date']['input']>;
}>;


export type LiveInboxSubscription = { __typename?: 'Subscription', liveInbox: { __typename?: 'Envelope', hid: string, content?: any | null, ref: string, timestamp?: any | null, inbox_name: string, sender_public_key: string, receiver_public_key: string, sender: string, receiver: string, delegate_public_key?: string | null } };

export type AccountsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  viewer?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'CAccount', pfp?: string | null, address: string, username: string, bio?: string | null, display_name?: string | null, public_key: string }> };

export type GetConnectionQueryVariables = Exact<{
  connection_id: Scalars['String']['input'];
}>;


export type GetConnectionQuery = { __typename?: 'Query', connection?: { __typename?: 'Connection', user_address: string, delegate_address?: string | null, timestamp?: any | null, is_delegate_linked?: boolean | null, is_intent_created?: boolean | null } | null };

export type UpdateConnectionMutationVariables = Exact<{
  input: UpdateConnectionInput;
}>;


export type UpdateConnectionMutation = { __typename?: 'Mutation', updateConnection?: boolean | null };

export type CreateAccountLinkIntentMutationVariables = Exact<{
  input: CreateAccountLinkIntentInput;
}>;


export type CreateAccountLinkIntentMutation = { __typename?: 'Mutation', createAccountLinkIntent: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type ConfirmDelegateMutationVariables = Exact<{
  input: ConfirmDelegateInput;
}>;


export type ConfirmDelegateMutation = { __typename?: 'Mutation', confirmDelegate?: boolean | null };

export type RegisterDelegateMutationVariables = Exact<{
  input: RegisterDelegateArgs;
}>;


export type RegisterDelegateMutation = { __typename?: 'Mutation', registerDelegate: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type Init_Account_And_InboxMutationVariables = Exact<{
  input: InitSelfDelegateKadeAccountWithHermesInboxArgs;
}>;


export type Init_Account_And_InboxMutation = { __typename?: 'Mutation', initSelfDelegateKadeAccountWithHermesInbox: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type Init_DelegateMutationVariables = Exact<{
  input: RegisterDelegateOnKadeAndHermesArgs;
}>;


export type Init_DelegateMutation = { __typename?: 'Mutation', registerDelegateOnKadeAndHermes: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type AnchorTransactionsQueryVariables = Exact<{
  user_address: Scalars['String']['input'];
}>;


export type AnchorTransactionsQuery = { __typename?: 'Query', anchorTransactions: Array<{ __typename?: 'AnchorTransaction', sender_address?: string | null, receiver_address?: string | null, anchor_amount?: number | null, timestamp?: any | null, type?: AnchorTransactionType | null }> };

export type AdminRemoveAccountMutationVariables = Exact<{
  input: AdminRemoveAccountArgs;
}>;


export type AdminRemoveAccountMutation = { __typename?: 'Mutation', adminRemoveAccount: boolean };

export type SetupSelfDelegateMutationVariables = Exact<{
  input: SetupSelfDelegateArgs;
}>;


export type SetupSelfDelegateMutation = { __typename?: 'Mutation', setupSelfDelegate: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type CreatePublicationMutationVariables = Exact<{
  args: CreatePublicationInput;
}>;


export type CreatePublicationMutation = { __typename?: 'Mutation', createPublication: { __typename?: 'CreatePublicationReturnType', client_ref: string, txn: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } } };

export type CreatePublicationWithRefMutationVariables = Exact<{
  args: CreatePublicationWithRefInput;
}>;


export type CreatePublicationWithRefMutation = { __typename?: 'Mutation', createPublicationWithRef: { __typename?: 'CreatePublicationReturnType', client_ref: string, txn: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } } };

export type RemovePublicationMutationVariables = Exact<{
  args: RemovePublicationInput;
}>;


export type RemovePublicationMutation = { __typename?: 'Mutation', removePublication: { __typename?: 'CreatePublicationReturnType', client_ref: string, txn: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } } };

export type RemovePublicationWithRefMutationVariables = Exact<{
  args: RemovePublicationWithRefInput;
}>;


export type RemovePublicationWithRefMutation = { __typename?: 'Mutation', removePublicationWithRef: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type CreateReactionMutationVariables = Exact<{
  args: CreateReactionInput;
}>;


export type CreateReactionMutation = { __typename?: 'Mutation', createReaction: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type CreateReactionWithRefMutationVariables = Exact<{
  args: CreateReactionWithRefInput;
}>;


export type CreateReactionWithRefMutation = { __typename?: 'Mutation', createReactionWithRef: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type RemoveReactionWithRefMutationVariables = Exact<{
  args: RemoveReactionWithRefInput;
}>;


export type RemoveReactionWithRefMutation = { __typename?: 'Mutation', removeReactionWithRef: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type RemoveReactionMutationVariables = Exact<{
  args: RemoveReactionInput;
}>;


export type RemoveReactionMutation = { __typename?: 'Mutation', removeReaction: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type UploadFileMutationVariables = Exact<{
  args: UploadFileInput;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'UploadedFileResponse', upload_url: string, file_url: string } };

export type UpdateProfileMutationVariables = Exact<{
  args: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type FollowAccountMutationVariables = Exact<{
  args: FollowAccountInput;
}>;


export type FollowAccountMutation = { __typename?: 'Mutation', followAccount: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type UnfollowAccountMutationVariables = Exact<{
  args: UnfollowAccountInput;
}>;


export type UnfollowAccountMutation = { __typename?: 'Mutation', unfollowAccount: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type CreateCommunityMutationVariables = Exact<{
  args: CreateCommunityInput;
}>;


export type CreateCommunityMutation = { __typename?: 'Mutation', createCommunity: string };

export type CommunityAddHostMutationVariables = Exact<{
  args: AddHostInput;
}>;


export type CommunityAddHostMutation = { __typename?: 'Mutation', communityAddHost: string };

export type JoinCommunityMutationVariables = Exact<{
  args: JoinCommunityInput;
}>;


export type JoinCommunityMutation = { __typename?: 'Mutation', joinCommunity: string };

export type RemoveCommunityHostMutationVariables = Exact<{
  args: RemoveCommunityHostInput;
}>;


export type RemoveCommunityHostMutation = { __typename?: 'Mutation', removeCommunityHost: string };

export type UpdateCommunityMutationVariables = Exact<{
  args: UpdateCommunityInput;
}>;


export type UpdateCommunityMutation = { __typename?: 'Mutation', updateCommunity: string };

export type DeleteCommunityMutationVariables = Exact<{
  args: DeleteCommunityInput;
}>;


export type DeleteCommunityMutation = { __typename?: 'Mutation', deleteCommunity: string };

export type PortalsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortalsQuery = { __typename?: 'Query', portals?: Array<{ __typename?: 'Portal', name?: string | null, description?: string | null, icon?: string | null, url: string, post_id: number, user_kid: number, username?: string | null, created_at?: any | null }> | null };

export type GetRankingQueryVariables = Exact<{
  user_address: Scalars['String']['input'];
}>;


export type GetRankingQuery = { __typename?: 'Query', getRanking?: { __typename?: 'Ranking', rank: string, points: number, badges?: Array<{ __typename?: 'Badge', type: string, owner: string, timestamp?: any | null }> | null } | null };


export const RegisterRequestInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterRequestInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterRequestInboxInputArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerRequestInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RegisterRequestInboxMutation, RegisterRequestInboxMutationVariables>;
export const RequestConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestConversationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RequestConversationMutation, RequestConversationMutationVariables>;
export const AcceptRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptRequestArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<AcceptRequestMutation, AcceptRequestMutationVariables>;
export const DelegateAcceptRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DelegateAcceptRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DelegateAcceptRequestArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delegateAcceptRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<DelegateAcceptRequestMutation, DelegateAcceptRequestMutationVariables>;
export const DelegateRequestConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DelegateRequestConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DelegateRequestConversationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delegateRequestConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<DelegateRequestConversationMutation, DelegateRequestConversationMutationVariables>;
export const SendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Send"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<SendMutation, SendMutationVariables>;
export const DelegateSendEnvelopeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DelegateSendEnvelope"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delegateSendEnvelope"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<DelegateSendEnvelopeMutation, DelegateSendEnvelopeMutationVariables>;
export const LiveInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"LiveInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liveInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inbox_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}}},{"kind":"Argument","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hid"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"inbox_name"}},{"kind":"Field","name":{"kind":"Name","value":"sender_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}},{"kind":"Field","name":{"kind":"Name","value":"receiver"}},{"kind":"Field","name":{"kind":"Name","value":"delegate_public_key"}}]}}]}}]} as unknown as DocumentNode<LiveInboxSubscription, LiveInboxSubscriptionVariables>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"public_key"}}]}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const GetConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"connection_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"connection_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"connection_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_address"}},{"kind":"Field","name":{"kind":"Name","value":"delegate_address"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"is_delegate_linked"}},{"kind":"Field","name":{"kind":"Name","value":"is_intent_created"}}]}}]}}]} as unknown as DocumentNode<GetConnectionQuery, GetConnectionQueryVariables>;
export const UpdateConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateConnectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateConnectionMutation, UpdateConnectionMutationVariables>;
export const CreateAccountLinkIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccountLinkIntent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createAccountLinkIntentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccountLinkIntent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<CreateAccountLinkIntentMutation, CreateAccountLinkIntentMutationVariables>;
export const ConfirmDelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmDelegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"confirmDelegateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmDelegate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ConfirmDelegateMutation, ConfirmDelegateMutationVariables>;
export const RegisterDelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterDelegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDelegateArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDelegate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RegisterDelegateMutation, RegisterDelegateMutationVariables>;
export const Init_Account_And_InboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"init_account_and_inbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"initSelfDelegateKadeAccountWithHermesInboxArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initSelfDelegateKadeAccountWithHermesInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<Init_Account_And_InboxMutation, Init_Account_And_InboxMutationVariables>;
export const Init_DelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"init_delegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"registerDelegateOnKadeAndHermesArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDelegateOnKadeAndHermes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<Init_DelegateMutation, Init_DelegateMutationVariables>;
export const AnchorTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AnchorTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anchorTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sender_address"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_address"}},{"kind":"Field","name":{"kind":"Name","value":"anchor_amount"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<AnchorTransactionsQuery, AnchorTransactionsQueryVariables>;
export const AdminRemoveAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminRemoveAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"adminRemoveAccountArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminRemoveAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AdminRemoveAccountMutation, AdminRemoveAccountMutationVariables>;
export const SetupSelfDelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setupSelfDelegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"setupSelfDelegateArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setupSelfDelegate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<SetupSelfDelegateMutation, SetupSelfDelegateMutationVariables>;
export const CreatePublicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPublication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createPublicationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPublication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"client_ref"}},{"kind":"Field","name":{"kind":"Name","value":"txn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePublicationMutation, CreatePublicationMutationVariables>;
export const CreatePublicationWithRefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePublicationWithRef"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createPublicationWithRefInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPublicationWithRef"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"client_ref"}},{"kind":"Field","name":{"kind":"Name","value":"txn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePublicationWithRefMutation, CreatePublicationWithRefMutationVariables>;
export const RemovePublicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePublication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"removePublicationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePublication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"client_ref"}},{"kind":"Field","name":{"kind":"Name","value":"txn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]}}]} as unknown as DocumentNode<RemovePublicationMutation, RemovePublicationMutationVariables>;
export const RemovePublicationWithRefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePublicationWithRef"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"removePublicationWithRefInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePublicationWithRef"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RemovePublicationWithRefMutation, RemovePublicationWithRefMutationVariables>;
export const CreateReactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createReactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<CreateReactionMutation, CreateReactionMutationVariables>;
export const CreateReactionWithRefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReactionWithRef"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createReactionWithRefInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReactionWithRef"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<CreateReactionWithRefMutation, CreateReactionWithRefMutationVariables>;
export const RemoveReactionWithRefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveReactionWithRef"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"removeReactionWithRefInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeReactionWithRef"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RemoveReactionWithRefMutation, RemoveReactionWithRefMutationVariables>;
export const RemoveReactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"removeReactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RemoveReactionMutation, RemoveReactionMutationVariables>;
export const UploadFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upload_url"}},{"kind":"Field","name":{"kind":"Name","value":"file_url"}}]}}]}}]} as unknown as DocumentNode<UploadFileMutation, UploadFileMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const FollowAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"followAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<FollowAccountMutation, FollowAccountMutationVariables>;
export const UnfollowAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfollowAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"unfollowAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<UnfollowAccountMutation, UnfollowAccountMutationVariables>;
export const CreateCommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCommunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createCommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCommunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<CreateCommunityMutation, CreateCommunityMutationVariables>;
export const CommunityAddHostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommunityAddHost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"addHostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communityAddHost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<CommunityAddHostMutation, CommunityAddHostMutationVariables>;
export const JoinCommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinCommunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"joinCommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinCommunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<JoinCommunityMutation, JoinCommunityMutationVariables>;
export const RemoveCommunityHostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCommunityHost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"removeCommunityHostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCommunityHost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<RemoveCommunityHostMutation, RemoveCommunityHostMutationVariables>;
export const UpdateCommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCommunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateCommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCommunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<UpdateCommunityMutation, UpdateCommunityMutationVariables>;
export const DeleteCommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCommunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"deleteCommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCommunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<DeleteCommunityMutation, DeleteCommunityMutationVariables>;
export const PortalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Portals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"post_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_kid"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<PortalsQuery, PortalsQueryVariables>;
export const GetRankingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRanking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRanking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<GetRankingQuery, GetRankingQueryVariables>;