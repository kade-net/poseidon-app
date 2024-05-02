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

export type Contact = {
  __typename?: 'Contact';
  accepted: Scalars['Boolean']['output'];
  address: Scalars['String']['output'];
  envelope?: Maybe<Scalars['JSON']['output']>;
  timestamp?: Maybe<Scalars['Date']['output']>;
  user_address: Scalars['String']['output'];
};

export type Delegate = {
  __typename?: 'Delegate';
  address: Scalars['String']['output'];
  hid: Scalars['String']['output'];
  timestamp?: Maybe<Scalars['Date']['output']>;
  user_address: Scalars['String']['output'];
};

export type Envelope = {
  __typename?: 'Envelope';
  content?: Maybe<Scalars['JSON']['output']>;
  hid: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inbox_name: Scalars['String']['output'];
  receiver: Scalars['String']['output'];
  reciever_public_key: Scalars['String']['output'];
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

export enum InboxType {
  Received = 'RECEIVED',
  Sent = 'SENT'
}

export type Pagination = {
  page: Scalars['Int']['input'];
  size: Scalars['Int']['input'];
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
  inboxHistory?: Maybe<Array<Envelope>>;
  inboxes?: Maybe<Array<Inbox>>;
  phoneBook?: Maybe<PhoneBook>;
};


export type QueryInboxHistoryArgs = {
  inbox_name: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryInboxesArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  address: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<InboxType>;
};


export type QueryPhoneBookArgs = {
  address: Scalars['String']['input'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type GetPhoneBookQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetPhoneBookQuery = { __typename?: 'Query', phoneBook?: { __typename?: 'PhoneBook', address: string, hid: string, timestamp?: any | null, public_key: string } | null };

export type GetInboxesQueryVariables = Exact<{
  address: Scalars['String']['input'];
  type?: InputMaybe<InboxType>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetInboxesQuery = { __typename?: 'Query', inboxes?: Array<{ __typename?: 'Inbox', id: string, owner_address: string, initiator_address: string, timestamp?: any | null, hid: string, active: boolean }> | null };

export type InboxHistoryQueryVariables = Exact<{
  inbox_name: Scalars['String']['input'];
}>;


export type InboxHistoryQuery = { __typename?: 'Query', inboxHistory?: Array<{ __typename?: 'Envelope', id: string, ref: string, timestamp?: any | null, hid: string, inbox_name: string, sender_public_key: string, content?: any | null, reciever_public_key: string, sender: string, receiver: string }> | null };


export const GetPhoneBookDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPhoneBook"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneBook"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"hid"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"public_key"}}]}}]}}]} as unknown as DocumentNode<GetPhoneBookQuery, GetPhoneBookQueryVariables>;
export const GetInboxesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInboxes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InboxType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inboxes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_address"}},{"kind":"Field","name":{"kind":"Name","value":"initiator_address"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"hid"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]} as unknown as DocumentNode<GetInboxesQuery, GetInboxesQueryVariables>;
export const InboxHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InboxHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inboxHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inbox_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inbox_name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ref"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"hid"}},{"kind":"Field","name":{"kind":"Name","value":"inbox_name"}},{"kind":"Field","name":{"kind":"Name","value":"sender_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"reciever_public_key"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}},{"kind":"Field","name":{"kind":"Name","value":"receiver"}}]}}]}}]} as unknown as DocumentNode<InboxHistoryQuery, InboxHistoryQueryVariables>;