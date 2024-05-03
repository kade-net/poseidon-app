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

export type CreateDelegateLinkIntentArgs = {
  delegate_address: Scalars['String']['input'];
  sender_address: Scalars['String']['input'];
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

export type Mutation = {
  __typename?: 'Mutation';
  acceptRequest: SerializedTransaction;
  createDelegateLinkIntent: SerializedTransaction;
  delegateAcceptRequest: SerializedTransaction;
  delegateDenyRequest: SerializedTransaction;
  delegateRemoveFromPhoneBook: SerializedTransaction;
  delegateRequestConversation: SerializedTransaction;
  denyRequest: SerializedTransaction;
  registerDelegate: SerializedTransaction;
  registerRequestInbox: SerializedTransaction;
  removeDelegate: SerializedTransaction;
  removeFromPhoneBook: SerializedTransaction;
  requestConversation: SerializedTransaction;
  send: SerializedTransaction;
};


export type MutationAcceptRequestArgs = {
  input: AcceptRequestArgs;
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


export type MutationRegisterDelegateArgs = {
  input: RegisterDelegateArgs;
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

export type Query = {
  __typename?: 'Query';
  empty?: Maybe<Scalars['String']['output']>;
};

export type RegisterDelegateArgs = {
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


export const RegisterRequestInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterRequestInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterRequestInboxInputArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerRequestInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RegisterRequestInboxMutation, RegisterRequestInboxMutationVariables>;
export const RequestConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestConversationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RequestConversationMutation, RequestConversationMutationVariables>;
export const AcceptRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptRequestArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<AcceptRequestMutation, AcceptRequestMutationVariables>;
export const SendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Send"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<SendMutation, SendMutationVariables>;
export const LiveInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"LiveInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liveInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inbox_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewer"}}},{"kind":"Argument","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hid"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"inbox_name"}},{"kind":"Field","name":{"kind":"Name","value":"sender_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}},{"kind":"Field","name":{"kind":"Name","value":"receiver"}}]}}]}}]} as unknown as DocumentNode<LiveInboxSubscription, LiveInboxSubscriptionVariables>;