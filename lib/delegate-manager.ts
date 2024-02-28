import '../global'
import 'react-native-get-random-values'
import { AptosAccount, HexString } from 'aptos'
import * as SecureStore from 'expo-secure-store';
import { ACCOUNT_ENTRY_FUNCTIONS, aptos } from '../contract';
import { Account, Ed25519PrivateKey, Serializer } from '@aptos-labs/ts-sdk';
import axios from 'axios';




class DelegateManager {
    private_key: string | null = null;
    account: AptosAccount | null = null;
    private _owner: string | null = null;

    get owner() {
        let current = this._owner
        if (!current) {
            current = SecureStore.getItem('owner')
        }
        return current
    }

    constructor() {

    }

    async createDelegate() {
        let account = new AptosAccount()
        this.private_key = account.toPrivateKeyObject().privateKeyHex
        return this.private_key
    }

    async init() {
        // TODO: remove this 
        await SecureStore.deleteItemAsync('private_key')


        let pk = await SecureStore.getItemAsync('private_key')

        if (!pk) {
            const private_key = await this.createDelegate()
            await SecureStore.setItemAsync('private_key', private_key)


            pk = private_key
        }

        this.account = new AptosAccount(new HexString(pk).toUint8Array())
    }

    async setOwner(owner: string) {
        this._owner = owner
        SecureStore.setItem('owner', owner)
    }

    async linkAccount(session_id: string | null) {

        if (!session_id) {
            throw new Error('No session found')
        }

        if (!this.private_key) {
            throw new Error('No private key found')
        }
        if (!this.owner) {
            throw new Error('No owner found')
        }
        let delegate = Account.fromPrivateKey({
            privateKey: new Ed25519PrivateKey(new HexString(this.private_key).toUint8Array())
        })

        const transaction = await aptos.transaction.build.simple({
            sender: delegate.accountAddress,
            withFeePayer: true,
            data: {
                function: ACCOUNT_ENTRY_FUNCTIONS.account_link_intent as any,
                functionArguments: [this.owner],
                typeArguments: []
            }
        })

        const txn_serializer = new Serializer()
        transaction.rawTransaction.serialize(txn_serializer)
        const u8_array = txn_serializer.toUint8Array()

        const signature = aptos.transaction.sign({
            signer: delegate,
            transaction,
        })

        const sig_serializer = new Serializer()
        signature.serialize(sig_serializer)
        const sig_u8_array = sig_serializer.toUint8Array()

        const n_array = sig_u8_array.map(x => x)

        // TODO: send transaction to the backend for fee sponsorship and submission
        const response = await axios.post("https://connector-psi.vercel.app/api/link-account", {
            delegate_address: this.account?.address()?.toString(),
            signature: Array.from(sig_u8_array),
            transaction: Array.from(u8_array)
        },
            {
                headers: {
                    'Authorization': `Bearer ${session_id}`,
                }
            })

        console.log(response.data)

        SecureStore.setItem('account-link', 'complete')
    }

}

export default new DelegateManager()