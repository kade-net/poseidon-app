import * as Types from './operations';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export const CoinActivityFieldsFragmentDoc = gql`
    fragment CoinActivityFields on coin_activities {
  transaction_timestamp
  transaction_version
  amount
  activity_type
  coin_type
  is_gas_fee
  is_transaction_success
  event_account_address
  event_creation_number
  event_sequence_number
  entry_function_id_str
  block_height
}
    `;
export const TokensDataFieldsFragmentDoc = gql`
    fragment TokensDataFields on tokens {
  creator_address
  collection_name
  name
  token_data_id_hash
  collection_data_id_hash
  property_version
  token_properties
  transaction_timestamp
  transaction_version
}
    `;
export const CollectionDataFieldsFragmentDoc = gql`
    fragment CollectionDataFields on current_collections_v2 {
  uri
  max_supply
  description
  collection_name
  collection_id
  creator_address
}
    `;
export const TokenDataFieldsFragmentDoc = gql`
    fragment TokenDataFields on current_token_datas_v2 {
  description
  token_uri
  token_name
  token_data_id
  current_collection {
    ...CollectionDataFields
  }
  token_properties
}
    ${CollectionDataFieldsFragmentDoc}`;
export const CurrentTokenPendingClaimsFragmentDoc = gql`
    fragment CurrentTokenPendingClaims on current_token_pending_claims {
  amount
  from_address
  to_address
  last_transaction_version
  last_transaction_timestamp
  property_version
  current_token_data_v2 {
    ...TokenDataFields
  }
}
    ${TokenDataFieldsFragmentDoc}`;
export const TokenActivitiesFragmentDoc = gql`
    fragment TokenActivities on token_activities {
  creator_address
  collection_name
  name
  token_data_id_hash
  collection_data_id_hash
  from_address
  to_address
  transaction_version
  transaction_timestamp
  coin_amount
  coin_type
  property_version
  transfer_type
  event_account_address
  event_creation_number
  event_sequence_number
  token_amount
}
    `;
export const GetAccountCoinActivityDocument = gql`
    query getAccountCoinActivity($address: String!, $offset: Int, $limit: Int) {
  coin_activities(
    where: {owner_address: {_eq: $address}}
    limit: $limit
    offset: $offset
    order_by: [{transaction_version: desc}, {event_account_address: desc}, {event_creation_number: desc}, {event_sequence_number: desc}]
  ) {
    ...CoinActivityFields
  }
}
    ${CoinActivityFieldsFragmentDoc}`;
export const GetAccountTokensTotalDocument = gql`
    query getAccountTokensTotal($address: String!) {
  current_token_ownerships_v2_aggregate(
    where: {owner_address: {_eq: $address}, amount: {_gt: 0}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
export const GetAccountCurrentTokensDocument = gql`
    query getAccountCurrentTokens($address: String!, $offset: Int, $limit: Int) {
  current_token_ownerships_v2(
    where: {owner_address: {_eq: $address}, amount: {_gt: 0}, _or: [{table_type_v1: {_eq: "0x3::token::TokenStore"}}, {table_type_v1: {_is_null: true}}]}
    order_by: [{last_transaction_version: desc}, {token_data_id: desc}]
    offset: $offset
    limit: $limit
  ) {
    amount
    current_token_data {
      ...TokenDataFields
    }
    last_transaction_version
    property_version_v1
    token_properties_mutated_v1
    token_standard
    is_soulbound_v2
  }
  current_token_ownerships_v2_aggregate(
    where: {owner_address: {_eq: $address}, amount: {_gt: 0}}
  ) {
    aggregate {
      count
    }
  }
}
    ${TokenDataFieldsFragmentDoc}`;
export const GetTokenDataDocument = gql`
    query getTokenData($idHash: String!) {
  current_token_datas_v2(where: {token_data_id: {_eq: $idHash}}) {
    ...TokenDataFields
    last_transaction_version
  }
}
    ${TokenDataFieldsFragmentDoc}`;
export const GetTokenPendingClaimsDocument = gql`
    query getTokenPendingClaims($address: String!, $offset: Int, $limit: Int) {
  current_token_pending_claims(
    where: {_or: [{from_address: {_eq: $address}, amount: {_gt: "0"}}, {to_address: {_eq: $address}, amount: {_gt: "0"}}]}
    order_by: [{last_transaction_timestamp: desc}, {last_transaction_version: desc}]
    offset: $offset
    limit: $limit
  ) {
    ...CurrentTokenPendingClaims
  }
}
    ${CurrentTokenPendingClaimsFragmentDoc}`;
export const GetPendingClaimsForTokenDocument = gql`
    query getPendingClaimsForToken($token_data_id_hash: String!, $offset: Int, $limit: Int) {
  current_token_pending_claims(
    where: {token_data_id_hash: {_eq: $token_data_id_hash}, amount: {_gt: "0"}}
    order_by: [{last_transaction_timestamp: desc}, {last_transaction_version: desc}]
    offset: $offset
    limit: $limit
  ) {
    ...CurrentTokenPendingClaims
  }
}
    ${CurrentTokenPendingClaimsFragmentDoc}`;
export const GetActivitiesAggregateDocument = gql`
    query getActivitiesAggregate($account_address: String!) {
  address_events_summary(where: {account_address: {_eq: $account_address}}) {
    block_metadata {
      timestamp
    }
    num_distinct_versions
  }
}
    `;
export const GetTokenActivitiesDocument = gql`
    query getTokenActivities($idHash: String!, $offset: Int, $limit: Int) {
  token_activities(
    where: {token_data_id_hash: {_eq: $idHash}}
    order_by: [{transaction_timestamp: desc}, {transaction_version: desc}]
    offset: $offset
    limit: $limit
  ) {
    ...TokenActivities
  }
}
    ${TokenActivitiesFragmentDoc}`;
export const GetProcessorLastVersionDocument = gql`
    query getProcessorLastVersion($processor: String!) {
  processor_status(where: {processor: {_eq: $processor}}) {
    last_success_version
  }
}
    `;
export const GetConsolidatedActivitiesDocument = gql`
    query getConsolidatedActivities($address: String!, $max_transaction_version: bigint, $limit: Int, $where: [account_transactions_bool_exp!], $coin_activities_where: [coin_activities_bool_exp!], $token_activities_where: [token_activities_bool_exp!]) {
  account_transactions(
    where: {account_address: {_eq: $address}, transaction_version: {_lt: $max_transaction_version}, _and: $where}
    limit: $limit
    order_by: {transaction_version: desc}
  ) {
    transaction_version
    coin_activities(where: {_and: $coin_activities_where}) {
      activity_type
      amount
      aptos_names {
        domain
      }
      block_height
      coin_type
      coin_info {
        decimals
        name
        symbol
        coin_type
      }
      entry_function_id_str
      event_account_address
      event_creation_number
      event_sequence_number
      is_gas_fee
      is_transaction_success
      transaction_timestamp
      transaction_version
    }
    delegated_staking_activities(order_by: {event_index: desc}) {
      amount
      delegator_address
      event_index
      event_type
      pool_address
      transaction_version
    }
    token_activities(where: {_and: $token_activities_where}) {
      aptos_names_owner {
        domain
      }
      aptos_names_to {
        domain
      }
      coin_amount
      coin_type
      collection_data_id_hash
      collection_name
      creator_address
      current_token_data {
        metadata_uri
      }
      event_account_address
      event_creation_number
      event_sequence_number
      from_address
      name
      property_version
      to_address
      token_amount
      token_data_id_hash
      transaction_timestamp
      transaction_version
      transfer_type
    }
  }
}
    `;
export const GetDelegatedStakingRoyaltiesDocument = gql`
    query getDelegatedStakingRoyalties($address: String!, $pool: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $address}, pool_address: {_eq: $pool}}
    order_by: {transaction_version: desc}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `;
export const GetDelegatedStakingDocument = gql`
    query getDelegatedStaking($address: String!) {
  delegator_distinct_pool(where: {delegator_address: {_eq: $address}}) {
    delegator_address
    pool_address
    current_pool_balance {
      operator_commission_percentage
    }
    staking_pool_metadata {
      operator_address
      operator_aptos_name {
        domain
      }
    }
  }
}
    `;
export const GetDelegationPoolsDocument = gql`
    query getDelegationPools {
  delegated_staking_pools {
    staking_pool_address
    current_staking_pool {
      operator_address
    }
  }
}
    `;
export const GetNumberOfDelegatorsDocument = gql`
    query getNumberOfDelegators($poolAddress: String) {
  num_active_delegator_per_pool(
    where: {pool_address: {_eq: $poolAddress}, num_active_delegator: {_gt: "0"}}
    distinct_on: pool_address
  ) {
    num_active_delegator
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getAccountCoinActivity(variables: Types.GetAccountCoinActivityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetAccountCoinActivityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetAccountCoinActivityQuery>(GetAccountCoinActivityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAccountCoinActivity', 'query', variables);
    },
    getAccountTokensTotal(variables: Types.GetAccountTokensTotalQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetAccountTokensTotalQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetAccountTokensTotalQuery>(GetAccountTokensTotalDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAccountTokensTotal', 'query', variables);
    },
    getAccountCurrentTokens(variables: Types.GetAccountCurrentTokensQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetAccountCurrentTokensQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetAccountCurrentTokensQuery>(GetAccountCurrentTokensDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAccountCurrentTokens', 'query', variables);
    },
    getTokenData(variables: Types.GetTokenDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetTokenDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetTokenDataQuery>(GetTokenDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTokenData', 'query', variables);
    },
    getTokenPendingClaims(variables: Types.GetTokenPendingClaimsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetTokenPendingClaimsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetTokenPendingClaimsQuery>(GetTokenPendingClaimsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTokenPendingClaims', 'query', variables);
    },
    getPendingClaimsForToken(variables: Types.GetPendingClaimsForTokenQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetPendingClaimsForTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetPendingClaimsForTokenQuery>(GetPendingClaimsForTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPendingClaimsForToken', 'query', variables);
    },
    getActivitiesAggregate(variables: Types.GetActivitiesAggregateQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetActivitiesAggregateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetActivitiesAggregateQuery>(GetActivitiesAggregateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getActivitiesAggregate', 'query', variables);
    },
    getTokenActivities(variables: Types.GetTokenActivitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetTokenActivitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetTokenActivitiesQuery>(GetTokenActivitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTokenActivities', 'query', variables);
    },
    getProcessorLastVersion(variables: Types.GetProcessorLastVersionQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetProcessorLastVersionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetProcessorLastVersionQuery>(GetProcessorLastVersionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getProcessorLastVersion', 'query', variables);
    },
    getConsolidatedActivities(variables: Types.GetConsolidatedActivitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetConsolidatedActivitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetConsolidatedActivitiesQuery>(GetConsolidatedActivitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getConsolidatedActivities', 'query', variables);
    },
    getDelegatedStakingRoyalties(variables: Types.GetDelegatedStakingRoyaltiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetDelegatedStakingRoyaltiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetDelegatedStakingRoyaltiesQuery>(GetDelegatedStakingRoyaltiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDelegatedStakingRoyalties', 'query', variables);
    },
    getDelegatedStaking(variables: Types.GetDelegatedStakingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetDelegatedStakingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetDelegatedStakingQuery>(GetDelegatedStakingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDelegatedStaking', 'query', variables);
    },
    getDelegationPools(variables?: Types.GetDelegationPoolsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetDelegationPoolsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetDelegationPoolsQuery>(GetDelegationPoolsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getDelegationPools', 'query', variables);
    },
    getNumberOfDelegators(variables?: Types.GetNumberOfDelegatorsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Types.GetNumberOfDelegatorsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetNumberOfDelegatorsQuery>(GetNumberOfDelegatorsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNumberOfDelegators', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;