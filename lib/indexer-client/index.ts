import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk';
import Constants from 'expo-constants'
import { DefaultNetworks, defaultNetworks } from './networks';
import config from '../../config';
import { Network } from 'aptos';

const CURRENT_NETWORK = config.APTOS_NETWORK ?? 'testnet' as 'mainnet' | 'testnet' | 'devnet'

export default function makeClient(endpoint: string) {
    const graphqlClient = new GraphQLClient(endpoint);
    return getSdk(graphqlClient);
}

export type {
    CoinActivityFieldsFragment,
    CollectionDataFieldsFragment,
    CurrentTokenPendingClaimsFragment,
    TokenActivitiesFragment,
    TokenDataFieldsFragment,
} from './generated/operations';

export const poseidonIndexerClient = makeClient(
    CURRENT_NETWORK === Network.MAINNET ? defaultNetworks[DefaultNetworks.Mainnet].indexerUrl! :
        defaultNetworks[DefaultNetworks.Testnet].indexerUrl!
)