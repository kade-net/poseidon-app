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


export const RegisterRequestInboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterRequestInbox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterRequestInboxInputArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerRequestInbox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RegisterRequestInboxMutation, RegisterRequestInboxMutationVariables>;
export const RequestConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestConversationArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RequestConversationMutation, RequestConversationMutationVariables>;
export const AcceptRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptRequestArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<AcceptRequestMutation, AcceptRequestMutationVariables>;
export const SendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Send"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw_transaction"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<SendMutation, SendMutationVariables>;