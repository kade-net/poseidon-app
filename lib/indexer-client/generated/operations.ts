import * as Types from './types';

export type GetAccountCoinActivityQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetAccountCoinActivityQuery = { __typename?: 'query_root', coin_activities: Array<{ __typename?: 'coin_activities', transaction_timestamp?: any | null, transaction_version?: any | null, amount?: any | null, activity_type?: string | null, coin_type?: string | null, is_gas_fee?: boolean | null, is_transaction_success?: boolean | null, event_account_address?: string | null, event_creation_number?: number | null, event_sequence_number?: number | null, entry_function_id_str?: string | null, block_height?: any | null }> };

export type CoinActivityFieldsFragment = { __typename?: 'coin_activities', transaction_timestamp?: any | null, transaction_version?: any | null, amount?: any | null, activity_type?: string | null, coin_type?: string | null, is_gas_fee?: boolean | null, is_transaction_success?: boolean | null, event_account_address?: string | null, event_creation_number?: number | null, event_sequence_number?: number | null, entry_function_id_str?: string | null, block_height?: any | null };

export type GetAccountTokensTotalQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
}>;


export type GetAccountTokensTotalQuery = { __typename?: 'query_root', current_token_ownerships_v2_aggregate: { __typename?: 'current_token_ownerships_v2_aggregate', aggregate?: { __typename?: 'current_token_ownerships_v2_aggregate_fields', count: number } | null } };

export type GetAccountCurrentTokensQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetAccountCurrentTokensQuery = { __typename?: 'query_root', current_token_ownerships_v2: Array<{ __typename?: 'current_token_ownerships_v2', amount: any, last_transaction_version: any, property_version_v1: any, token_properties_mutated_v1?: any | null, token_standard: string, is_soulbound_v2?: boolean | null, current_token_data?: { __typename?: 'current_token_datas_v2', description: string, token_uri: string, token_name: string, token_data_id: string, token_properties: any, current_collection?: { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string } | null } | null }>, current_token_ownerships_v2_aggregate: { __typename?: 'current_token_ownerships_v2_aggregate', aggregate?: { __typename?: 'current_token_ownerships_v2_aggregate_fields', count: number } | null } };

export type GetTokenDataQueryVariables = Types.Exact<{
  idHash: Types.Scalars['String']['input'];
}>;


export type GetTokenDataQuery = { __typename?: 'query_root', current_token_datas_v2: Array<{ __typename?: 'current_token_datas_v2', last_transaction_version: any, description: string, token_uri: string, token_name: string, token_data_id: string, token_properties: any, current_collection?: { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string } | null }> };

export type GetTokenPendingClaimsQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetTokenPendingClaimsQuery = { __typename?: 'query_root', current_token_pending_claims: Array<{ __typename?: 'current_token_pending_claims', amount: any, from_address: string, to_address: string, last_transaction_version: any, last_transaction_timestamp: any, property_version: any, current_token_data_v2?: { __typename?: 'current_token_datas_v2', description: string, token_uri: string, token_name: string, token_data_id: string, token_properties: any, current_collection?: { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string } | null } | null }> };

export type GetPendingClaimsForTokenQueryVariables = Types.Exact<{
  token_data_id_hash: Types.Scalars['String']['input'];
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetPendingClaimsForTokenQuery = { __typename?: 'query_root', current_token_pending_claims: Array<{ __typename?: 'current_token_pending_claims', amount: any, from_address: string, to_address: string, last_transaction_version: any, last_transaction_timestamp: any, property_version: any, current_token_data_v2?: { __typename?: 'current_token_datas_v2', description: string, token_uri: string, token_name: string, token_data_id: string, token_properties: any, current_collection?: { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string } | null } | null }> };

export type GetActivitiesAggregateQueryVariables = Types.Exact<{
  account_address: Types.Scalars['String']['input'];
}>;


export type GetActivitiesAggregateQuery = { __typename?: 'query_root', address_events_summary: Array<{ __typename?: 'address_events_summary', num_distinct_versions?: any | null, block_metadata?: { __typename?: 'block_metadata_transactions', timestamp: any } | null }> };

export type GetTokenActivitiesQueryVariables = Types.Exact<{
  idHash: Types.Scalars['String']['input'];
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetTokenActivitiesQuery = { __typename?: 'query_root', token_activities: Array<{ __typename?: 'token_activities', creator_address?: string | null, collection_name?: string | null, name?: string | null, token_data_id_hash?: string | null, collection_data_id_hash?: string | null, from_address?: string | null, to_address?: string | null, transaction_version?: any | null, transaction_timestamp?: any | null, coin_amount?: string | null, coin_type?: string | null, property_version?: any | null, transfer_type?: string | null, event_account_address?: string | null, event_creation_number?: number | null, event_sequence_number?: number | null, token_amount?: any | null }> };

export type TokenDataFieldsFragment = { __typename?: 'current_token_datas_v2', description: string, token_uri: string, token_name: string, token_data_id: string, token_properties: any, current_collection?: { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string } | null };

export type TokensDataFieldsFragment = { __typename?: 'tokens', creator_address?: string | null, collection_name?: string | null, name?: string | null, token_data_id_hash?: string | null, collection_data_id_hash?: string | null, property_version?: any | null, token_properties?: any | null, transaction_timestamp?: any | null, transaction_version?: any | null };

export type CollectionDataFieldsFragment = { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string };

export type CurrentTokenPendingClaimsFragment = { __typename?: 'current_token_pending_claims', amount: any, from_address: string, to_address: string, last_transaction_version: any, last_transaction_timestamp: any, property_version: any, current_token_data_v2?: { __typename?: 'current_token_datas_v2', description: string, token_uri: string, token_name: string, token_data_id: string, token_properties: any, current_collection?: { __typename?: 'current_collections_v2', uri: string, max_supply?: any | null, description: string, collection_name: string, collection_id: string, creator_address: string } | null } | null };

export type TokenActivitiesFragment = { __typename?: 'token_activities', creator_address?: string | null, collection_name?: string | null, name?: string | null, token_data_id_hash?: string | null, collection_data_id_hash?: string | null, from_address?: string | null, to_address?: string | null, transaction_version?: any | null, transaction_timestamp?: any | null, coin_amount?: string | null, coin_type?: string | null, property_version?: any | null, transfer_type?: string | null, event_account_address?: string | null, event_creation_number?: number | null, event_sequence_number?: number | null, token_amount?: any | null };

export type GetProcessorLastVersionQueryVariables = Types.Exact<{
  processor: Types.Scalars['String']['input'];
}>;


export type GetProcessorLastVersionQuery = { __typename?: 'query_root', processor_status: Array<{ __typename?: 'processor_status', last_success_version: any }> };

export type GetConsolidatedActivitiesQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
  max_transaction_version?: Types.InputMaybe<Types.Scalars['bigint']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  where?: Types.InputMaybe<Array<Types.Account_Transactions_Bool_Exp> | Types.Account_Transactions_Bool_Exp>;
  coin_activities_where?: Types.InputMaybe<Array<Types.Coin_Activities_Bool_Exp> | Types.Coin_Activities_Bool_Exp>;
  token_activities_where?: Types.InputMaybe<Array<Types.Token_Activities_Bool_Exp> | Types.Token_Activities_Bool_Exp>;
}>;


export type GetConsolidatedActivitiesQuery = { __typename?: 'query_root', account_transactions: Array<{ __typename?: 'account_transactions', transaction_version: any, coin_activities: Array<{ __typename?: 'coin_activities', activity_type?: string | null, amount?: any | null, block_height?: any | null, coin_type?: string | null, entry_function_id_str?: string | null, event_account_address?: string | null, event_creation_number?: number | null, event_sequence_number?: number | null, is_gas_fee?: boolean | null, is_transaction_success?: boolean | null, transaction_timestamp?: any | null, transaction_version?: any | null, aptos_names: Array<{ __typename?: 'current_aptos_names', domain?: string | null }>, coin_info?: { __typename?: 'coin_infos', decimals?: number | null, name?: string | null, symbol?: string | null, coin_type?: string | null } | null }>, delegated_staking_activities: Array<{ __typename?: 'delegated_staking_activities', amount: any, delegator_address: string, event_index: any, event_type: string, pool_address: string, transaction_version: any }>, token_activities: Array<{ __typename?: 'token_activities', coin_amount?: string | null, coin_type?: string | null, collection_data_id_hash?: string | null, collection_name?: string | null, creator_address?: string | null, event_account_address?: string | null, event_creation_number?: number | null, event_sequence_number?: number | null, from_address?: string | null, name?: string | null, property_version?: any | null, to_address?: string | null, token_amount?: any | null, token_data_id_hash?: string | null, transaction_timestamp?: any | null, transaction_version?: any | null, transfer_type?: string | null, aptos_names_owner: Array<{ __typename?: 'current_aptos_names', domain?: string | null }>, aptos_names_to: Array<{ __typename?: 'current_aptos_names', domain?: string | null }>, current_token_data?: { __typename?: 'current_token_datas', metadata_uri?: string | null } | null }> }> };

export type GetDelegatedStakingRoyaltiesQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
  pool?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetDelegatedStakingRoyaltiesQuery = { __typename?: 'query_root', delegated_staking_activities: Array<{ __typename?: 'delegated_staking_activities', amount: any, delegator_address: string, event_index: any, event_type: string, pool_address: string, transaction_version: any }> };

export type GetDelegatedStakingQueryVariables = Types.Exact<{
  address: Types.Scalars['String']['input'];
}>;


export type GetDelegatedStakingQuery = { __typename?: 'query_root', delegator_distinct_pool: Array<{ __typename?: 'delegator_distinct_pool', delegator_address?: string | null, pool_address?: string | null, current_pool_balance?: { __typename?: 'current_delegated_staking_pool_balances', operator_commission_percentage: any } | null, staking_pool_metadata?: { __typename?: 'current_staking_pool_voter', operator_address: string, operator_aptos_name: Array<{ __typename?: 'current_aptos_names', domain?: string | null }> } | null }> };

export type GetDelegationPoolsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDelegationPoolsQuery = { __typename?: 'query_root', delegated_staking_pools: Array<{ __typename?: 'delegated_staking_pools', staking_pool_address: string, current_staking_pool?: { __typename?: 'current_staking_pool_voter', operator_address: string } | null }> };

export type GetNumberOfDelegatorsQueryVariables = Types.Exact<{
  poolAddress?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetNumberOfDelegatorsQuery = { __typename?: 'query_root', num_active_delegator_per_pool: Array<{ __typename?: 'num_active_delegator_per_pool', num_active_delegator?: any | null }> };
