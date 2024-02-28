import { Account, Aptos, AptosConfig, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";

export const USERNAMES_COLLECTION_ADDRESS = '0x90f80a1e3d3ffb9f96455eba717e55d1ee233a909d1f604f23b4bbae0686d38a'

export const MODULE_ADDRESS = '0x809001fa9030e21dbe72a45291ddf227610e9c228025c8d93670ddd894f4141d'

export const ACCOUNTS_RESOURCE_ADDRESS = '0x3859907505843da95c7171838d9233c29268140c26ef4c9c487af52847fe58b9';

export const PUBLICATIONS_RESOURCE_ADDRESS = '0x5ea08b646aae75a8512b78e6a163dda14da8eb89c5ed4cc63e43b6c84e86b64c'

export const USERNAMES_RESOURCE_ADDRESS = '0xd996c8fa72572b43f809d46f372adf738c8c9b644c970d8e1f92b7652ef5983b'

export const ACCOUNT_CONTRACT = `${MODULE_ADDRESS}::accounts`

export const PUBLICATION_CONTRACT = `${MODULE_ADDRESS}::publications`

export const USERNAME_CONTRACT = `${MODULE_ADDRESS}::usernames`


export const ACCOUNT_ENTRY_FUNCTIONS = {
    create_account_and_delegate_link_intent: `${ACCOUNT_CONTRACT}::create_account_and_delegate_link_intent`,
    account_link_intent: `${ACCOUNT_CONTRACT}::account_link_intent`,
    delegate_link_intent: `${ACCOUNT_CONTRACT}::delegate_link_intent`,
    update_profile: `${ACCOUNT_CONTRACT}::update_profile`,
    follow_account: `${ACCOUNT_CONTRACT}::follow_account`,
    unfollow_account: `${ACCOUNT_CONTRACT}::unfollow_account`,
}

export const ACCOUNT_VIEW_FUNCTIONS = {
    get_account: `${ACCOUNT_CONTRACT}::get_account`,
    delegate_get_owner: `${ACCOUNT_CONTRACT}::delegate_get_owner`,
}

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



export const aptosConfig = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(aptosConfig);


export const APP_SUPPORT_API = 'https://f47c-41-80-117-115.ngrok-free.app'

export const KADE_ACCOUNT_ADDRESS = '0x809001fa9030e21dbe72a45291ddf227610e9c228025c8d93670ddd894f4141d'