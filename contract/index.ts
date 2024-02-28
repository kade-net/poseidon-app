import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { AptosClient, Network, Provider } from "aptos";

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
}


export const client = new AptosClient('https://fullnode.testnet.aptoslabs.com')
export const provider = new Provider(Network.TESTNET)

export const aptosConfig = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(aptosConfig);