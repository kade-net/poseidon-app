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

export type Mutation = {
  __typename?: 'Mutation';
  acceptRequest: SerializedTransaction;
  cleanAnchorOrder?: Maybe<Scalars['String']['output']>;
  confirmAnchorOrder?: Maybe<Scalars['Boolean']['output']>;
  confirmDelegate?: Maybe<Scalars['Boolean']['output']>;
  confirmIntent?: Maybe<Scalars['Boolean']['output']>;
  createAccountLinkIntent: SerializedTransaction;
  createAnchorOrder?: Maybe<Scalars['String']['output']>;
  createConnection?: Maybe<Scalars['String']['output']>;
  createDelegateLinkIntent: SerializedTransaction;
  delegateAcceptRequest: SerializedTransaction;
  delegateDenyRequest: SerializedTransaction;
  delegateRemoveFromPhoneBook: SerializedTransaction;
  delegateRequestConversation: SerializedTransaction;
  denyRequest: SerializedTransaction;
  initSelfDelegateKadeAccountWithHermesInbox: SerializedTransaction;
  registerDelegate: SerializedTransaction;
  registerDelegateOnKadeAndHermes: SerializedTransaction;
  registerRequestInbox: SerializedTransaction;
  removeDelegate: SerializedTransaction;
  removeFromPhoneBook: SerializedTransaction;
  requestConversation: SerializedTransaction;
  send: SerializedTransaction;
  updateConnection?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAcceptRequestArgs = {
  input: AcceptRequestArgs;
};


export type MutationCleanAnchorOrderArgs = {
  input: CleanAnchorOrderInput;
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


export type MutationCreateAccountLinkIntentArgs = {
  input: CreateAccountLinkIntentInput;
};


export type MutationCreateAnchorOrderArgs = {
  input: CreateAnchorOrderInput;
};


export type MutationCreateConnectionArgs = {
  input: CreateConnectionInput;
};


export type MutationCreateDelegateLinkIntentArgs = {
  input: CreateDelegateLinkIntentArgs;
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


export type MutationDenyRequestArgs = {
  input: DenyRequestArgs;
};


export type MutationInitSelfDelegateKadeAccountWithHermesInboxArgs = {
  input: InitSelfDelegateKadeAccountWithHermesInboxArgs;
};


export type MutationRegisterDelegateArgs = {
  input: RegisterDelegateArgs;
};


export type MutationRegisterDelegateOnKadeAndHermesArgs = {
  input: RegisterDelegateOnKadeAndHermesArgs;
};


export type MutationRegisterRequestInboxArgs = {
  input: RegisterRequestInboxInputArgs;
};


export type MutationRemoveDelegateArgs = {
  input: RemoveDelegateArgs;
};


export type MutationRemoveFromPhoneBookArgs = {
  input: RemoveFromPhoneBookArgs;
};


export type MutationRequestConversationArgs = {
  input: RequestConversationArgs;
};


export type MutationSendArgs = {
  input: SendArgs;
};


export type MutationUpdateConnectionArgs = {
  input: UpdateConnectionInput;
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

export type Query = {
  __typename?: 'Query';
  accounts: Array<CAccount>;
  anchorTransactions: Array<AnchorTransaction>;
  connection?: Maybe<Connection>;
  phoneBook?: Maybe<PhoneBook>;
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


export type QueryPhoneBookArgs = {
  address: Scalars['String']['input'];
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

export type CreateAccountLinkIntentInput = {
  delegate_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type CreateAnchorOrderInput = {
  anchor_amount: Scalars['Int']['input'];
  apt_amount: Scalars['Int']['input'];
  user_address: Scalars['String']['input'];
};

export type CreateConnectionInput = {
  user_address: Scalars['String']['input'];
};

export type InitSelfDelegateKadeAccountWithHermesInboxArgs = {
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterDelegateOnKadeAndHermesArgs = {
  public_key: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
  user_address: Scalars['String']['input'];
};

export type UpdateConnectionInput = {
  connection_id: Scalars['String']['input'];
  delegate_address: Scalars['String']['input'];
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

export type SendMutationVariables = Exact<{
  args: SendArgs;
}>;


export type SendMutation = { __typename?: 'Mutation', send: { __typename?: 'SerializedTransaction', raw_transaction: Array<number>, signature: Array<number> } };

export type LiveInboxSubscriptionVariables = Exact<{
  inbox_name: Scalars['String']['input'];
  viewer: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Date']['input']>;
}>;


export type LiveInboxSubscription = { __typename?: 'Subscription', liveInbox: { __typename?: 'Envelope', hid: string, content?: any | null, ref: string, timestamp?: any | null, inbox_name: string, sender_public_key: string, receiver_public_key: string, sender: string, receiver: string } };

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


export const RegisterRequestInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterRequestInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterRequestInboxInputArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerRequestInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RegisterRequestInboxMutation, RegisterRequestInboxMutationVariables>;
export const RequestConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestConversationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RequestConversationMutation, RequestConversationMutationVariables>;
export const AcceptRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptRequestArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<AcceptRequestMutation, AcceptRequestMutationVariables>;
export const SendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Send"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<SendMutation, SendMutationVariables>;
export const LiveInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"LiveInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liveInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inbox_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}}},{"kind":"Argument","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hid"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"inbox_name"}},{"kind":"Field","name":{"kind":"Name","value":"sender_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}},{"kind":"Field","name":{"kind":"Name","value":"receiver"}}]}}]}}]} as unknown as DocumentNode<LiveInboxSubscription, LiveInboxSubscriptionVariables>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}},{"kind":"Field","name":{"kind":"Name","value":"public_key"}}]}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const GetConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"connection_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"connection_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"connection_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_address"}},{"kind":"Field","name":{"kind":"Name","value":"delegate_address"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"is_delegate_linked"}},{"kind":"Field","name":{"kind":"Name","value":"is_intent_created"}}]}}]}}]} as unknown as DocumentNode<GetConnectionQuery, GetConnectionQueryVariables>;
export const UpdateConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateConnectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateConnectionMutation, UpdateConnectionMutationVariables>;
export const CreateAccountLinkIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccountLinkIntent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createAccountLinkIntentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccountLinkIntent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<CreateAccountLinkIntentMutation, CreateAccountLinkIntentMutationVariables>;
export const ConfirmDelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmDelegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"confirmDelegateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmDelegate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ConfirmDelegateMutation, ConfirmDelegateMutationVariables>;
export const RegisterDelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterDelegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDelegateArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDelegate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RegisterDelegateMutation, RegisterDelegateMutationVariables>;
export const Init_Account_And_InboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"init_account_and_inbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"initSelfDelegateKadeAccountWithHermesInboxArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initSelfDelegateKadeAccountWithHermesInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<Init_Account_And_InboxMutation, Init_Account_And_InboxMutationVariables>;
export const Init_DelegateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"init_delegate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"registerDelegateOnKadeAndHermesArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDelegateOnKadeAndHermes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<Init_DelegateMutation, Init_DelegateMutationVariables>;