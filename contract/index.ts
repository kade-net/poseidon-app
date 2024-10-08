import Constants from 'expo-constants'
import { Account, Aptos, AptosConfig, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import config from '../config';

export const USERNAMES_COLLECTION_ADDRESS = '0x32464b70d881e7847f49c7826145bca69337448cee5ed03f563d814d83f155fa'

export const MODULE_ADDRESS = config.MODULE_ADDRESS

export const COMMUNITY_MODULE_ADDRESS = config.COMMUNITY_MODULE_ADDRESS

export const ACCOUNTS_RESOURCE_ADDRESS = '0x149e9a5f5dc3179720f0f5ddece23fdfda209fbaa6e24ee604a844e614425715';

export const PUBLICATIONS_RESOURCE_ADDRESS = '0x475f52e760b2b3eb00e5b5dc4907f936054a089046377162f65e723a499dd058'

export const USERNAMES_RESOURCE_ADDRESS = '0xfc5fad0f8b01316ca88f0b4a28d1e7cdf66802e707ca5869eec4764580fde925'

export const ACCOUNT_CONTRACT = `${MODULE_ADDRESS}::accounts` as const

export const PUBLICATION_CONTRACT = `${MODULE_ADDRESS}::publications`

export const USERNAME_CONTRACT = `${MODULE_ADDRESS}::usernames`

export const COMMUNITY_MODULE = `${COMMUNITY_MODULE_ADDRESS}::community` as const
export const ANCHORS_MODULE = `${COMMUNITY_MODULE_ADDRESS}::anchor` as const


export const ACCOUNT_ENTRY_FUNCTIONS = {
    create_account_and_delegate_link_intent: `${ACCOUNT_CONTRACT}::create_account_and_delegate_link_intent`,
    account_link_intent: `${ACCOUNT_CONTRACT}::account_link_intent`,
    delegate_link_intent: `${ACCOUNT_CONTRACT}::delegate_link_intent`,
    update_profile: `${ACCOUNT_CONTRACT}::update_profile`,
    follow_account: `${ACCOUNT_CONTRACT}::follow_account`,
    unfollow_account: `${ACCOUNT_CONTRACT}::unfollow_account`,
    account_setup_with_self_delegate: `${ACCOUNT_CONTRACT}::account_setup_with_self_delegate`,
}

export const ACCOUNT_VIEW_FUNCTIONS = {
    get_account: `${ACCOUNT_CONTRACT}::get_account`,
    delegate_get_owner: `${ACCOUNT_CONTRACT}::delegate_get_owner`,
    get_current_username: `${ACCOUNT_CONTRACT}::get_current_username` as const,
} as const

export const PUBLICATION_ENTRY_FUNCTIONS = {
    create_publication: `${PUBLICATION_CONTRACT}::create_publication`,
    remove_publication: `${PUBLICATION_CONTRACT}::remove_publication`,
    create_comment: `${PUBLICATION_CONTRACT}::create_comment`,
    remove_comment: `${PUBLICATION_CONTRACT}::remove_comment`,
    create_repost: `${PUBLICATION_CONTRACT}::create_repost`,
    remove_repost: `${PUBLICATION_CONTRACT}::remove_repost`,
    create_quote: `${PUBLICATION_CONTRACT}::create_quote`,
    remove_quote: `${PUBLICATION_CONTRACT}::remove_quote`,
    create_reaction: `${PUBLICATION_CONTRACT}::create_reaction`,
    remove_reaction: `${PUBLICATION_CONTRACT}::remove_reaction`,
}

export const USERNAME_VIEW_FUNCTIONS = {
    is_username_claimed: `${USERNAME_CONTRACT}::is_username_claimed`,
    is_address_username_owner: `${USERNAME_CONTRACT}::is_address_username_owner`,
}

export const USERNAME_ENTRY_FUNCTIONS = {
    claim_username: `${USERNAME_CONTRACT}::claim_username`,
}

export const ANCHORS_VIEW_FUNCTIONS = {
    get_balance: `${ANCHORS_MODULE}::get_balance` as const
}



export const aptosConfig = new AptosConfig({ network: config.APTOS_NETWORK });
export const aptos = new Aptos(aptosConfig); 


export const APP_SUPPORT_API = config.APP_SUPPORT_API

export const COMMUNITY_SUPPORT_API = config.COMMUNITY_SUPPORT_API

export const KADE_ACCOUNT_ADDRESS = config.KADE_ACCOUNT_ADDRESS