import '../global'
import 'react-native-get-random-values'
import * as bip39 from 'bip39'
import { AptosAccount, HexString } from 'aptos'
import * as SecureStore from 'expo-secure-store';
import { ACCOUNT_ENTRY_FUNCTIONS, ACCOUNT_VIEW_FUNCTIONS, APP_SUPPORT_API, KADE_ACCOUNT_ADDRESS, aptos } from '../contract';
import { Account, AccountAddress, AccountAuthenticator, Deserializer, Ed25519PrivateKey, RawTransaction, Serializer } from '@aptos-labs/ts-sdk';
import axios from 'axios';
import client, { convergenceClient } from '../data/apollo';
import { GET_MY_PROFILE } from '../utils/queries';
import Constants from 'expo-constants'
import posti from './posti';
import config from '../config';
import { CONFIRM_DELEGATE_LINKED, CREATE_ACCOUNT_LINK_INTENT, INIT_DELEGATE, UPDATE_CONNECTION } from './convergence-client/queries';
import { Connection } from './convergence-client/__generated__/graphql';
import { isEmpty } from 'lodash';


const DERIVATION_PATH = "m/44'/637'/0'/0'/0'"



class DelegateManager {
    private_key: string | null = null;
    account: AptosAccount | null = null;
    private _owner: string | null = null;
    signer: Account | null = null;

    get isDeligateRegistered() {
        try {
            const registered = SecureStore.getItem('deligate')
            if (registered) {
                return true
            }
            return false

        }
        catch (e) {
            return false
        }
    }

    get owner() {
        try {
            let current = this._owner
            if (!current) {
                current = SecureStore.getItem('owner')
            }
            return current

        }
        catch (e) {
            return null
        }
    }

    get mnemonic() {
        try {
            return SecureStore.getItem('mnemonic')

        }
        catch (e) {
            return null
        }
    }

    get isDelegateOwner() {
        return this.owner === this.account?.address()?.toString()
    }

    constructor() {

    }

    async fromMnemonic(mnemonic: string) {
        const isValid = bip39.validateMnemonic(mnemonic)

        if (!isValid) {
            throw new Error('Invalid mnemonic')
        }

        try {
            const account = AptosAccount.fromDerivePath(DERIVATION_PATH, mnemonic)
            this.private_key = account.toPrivateKeyObject().privateKeyHex
            await SecureStore.setItemAsync('private_key', this.private_key)
            this.signer = Account.fromPrivateKey({
                privateKey: new Ed25519PrivateKey(new HexString(this.private_key).toUint8Array())
            })
            this.account = account
            const delegate_address = account.address().toString()

            const dOwner = await aptos.view({
                payload: {
                    function: ACCOUNT_VIEW_FUNCTIONS.delegate_get_owner as any,
                    functionArguments: [delegate_address],
                    typeArguments: []
                }
            })

            const [user_kid, delegate_owner_address] = dOwner as [string, string]

            console.log('Delegate Owner::', user_kid, delegate_owner_address)

            if (user_kid == '0') {
                // delegate owns itself
                this.setOwner(delegate_address)
                return
            }

            this.setOwner(delegate_owner_address) // THEY ARE BOTH THEIR DELEGATE AND OWNER
        }
        catch (e) {
            if (e instanceof Error) {

                posti.capture('mnemonic-generation-failed', {
                    error: e ? e?.message : "unable to generate mnemonic",
                    stack: e?.stack ?? 'NO Stack'
                })
            }
            throw new Error('Unable to create account from mnemonic')
        }

        SecureStore.setItem('mnemonic', mnemonic)

    }

    async createDelegateLinkIntent() {
        const pk = SecureStore.getItem('private_key')

        if (!pk || !this.signer) {
            throw new Error('No private key found')
        }


        try {
            const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/account/create-account-and-delegate-link-intent`, {
                delegate_address: this.account?.address()?.toString(),
                user_address: this.account?.address()?.toString(),
                username: this.username
            })

            const { raw_txn, signature } = response.data

            try {
                const txn_deserializer = new Deserializer(new Uint8Array(raw_txn))
                const signature_deserializer = new Deserializer(new Uint8Array(signature))

                const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
                const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

                const accountSignature = aptos.transaction.sign({
                    signer: this.signer,
                    transaction: {
                        rawTransaction: raw_txn_deserialized,
                        feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                    }
                })

                const commited_txn = await aptos.transaction.submit.simple({
                    senderAuthenticator: accountSignature,
                    transaction: {
                        rawTransaction: raw_txn_deserialized,
                        feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                    },
                    feePayerAuthenticator: signature_deserialized
                })

                return commited_txn
            }
            catch (e) {
                if (e instanceof Error) {

                    posti.capture('unable-to-create-delegate-link-intent', {
                        error: e?.message ? e.message : 'something went wrong',
                        stack: e?.stack ? e?.stack : 'unable to get stack trace'
                    })
                }
                throw new Error('Unable to submit transaction')
            }
        }
        catch (e) {

            if (e instanceof Error) {
                posti.capture('unable to register-delegate', {
                    error: e?.message ? e.message : 'unable to register delegate'
                })
            }
            throw new Error('Unable to register as delegate')
        }


    }

    async createAccountLinkIntent() {
        const pk = SecureStore.getItem('private_key')

        if (!pk || !this.signer) {
            throw new Error('No private key found')
        }

        try {
            const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/account/account-link-intent`, {
                delegate_address: this.account?.address()?.toString(),
                user_address: this.account?.address()?.toString(),
            })

            const { raw_txn, signature } = response.data

            try {
                const txn_deserializer = new Deserializer(new Uint8Array(raw_txn))
                const signature_deserializer = new Deserializer(new Uint8Array(signature))

                const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
                const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

                const accountSignature = aptos.transaction.sign({
                    signer: this.signer,
                    transaction: {
                        rawTransaction: raw_txn_deserialized,
                        feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                    }
                })

                const commited_txn = await aptos.transaction.submit.simple({
                    senderAuthenticator: accountSignature,
                    transaction: {
                        rawTransaction: raw_txn_deserialized,
                        feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                    },
                    feePayerAuthenticator: signature_deserialized
                })

                return commited_txn
            }
            catch (e) {
                if (e instanceof Error) {

                    posti.capture('unable-to-create-link-intent', {
                        error: e?.message ?? "Unable to create link intent",
                        stack: e?.stack ?? 'No Stack'
                    })
                }
                throw new Error('Unable to submit transaction')
            }
        }
        catch (e) {
            if (e instanceof Error) {
                posti.capture('unable to register-delegate', {
                    error: e?.message ? e.message : 'unable to register delegate'
                })
            }
            throw new Error('Unable to register as delegate')
        }
    }

    async generateMnemonic() {

        const savedMnemonic = SecureStore.getItem('mnemonic')

        if (savedMnemonic) {
            return savedMnemonic
        }

        const mnemonic = bip39.generateMnemonic()
        SecureStore.setItem('mnemonic', mnemonic)
        return mnemonic
    }

    async createDelegate() {
        const mnemonic = await this.generateMnemonic()
        console.log(mnemonic)
        let account = AptosAccount.fromDerivePath(DERIVATION_PATH, mnemonic)


        this.private_key = account.toPrivateKeyObject().privateKeyHex
        console.log(this.private_key)
        this.signer = Account.fromPrivateKey({
            privateKey: new Ed25519PrivateKey(new HexString(this.private_key).toUint8Array())
        })
        return this.private_key
    }

    async init(reset?: boolean) {

        let pk = await SecureStore.getItemAsync('private_key')

        if (!pk || reset) {
            const private_key = await this.createDelegate()
            await SecureStore.setItemAsync('private_key', private_key)


            pk = private_key
        }

        this.account = new AptosAccount(new HexString(pk).toUint8Array())
        this.signer = Account.fromPrivateKey({
            privateKey: new Ed25519PrivateKey(new HexString(pk).toUint8Array())
        })
        this.private_key = pk

        const dOwner = await aptos.view({
            payload: {
                function: ACCOUNT_VIEW_FUNCTIONS.delegate_get_owner as any,
                functionArguments: [this.account?.address()?.toString()],
                typeArguments: []
            }
        })

        const [user_kid, delegate_owner_address] = dOwner as [string, string]

        if (user_kid == '0') {
            console.log("No owner found")
            // delegate owns itself
            this.setOwner(this.account?.address()?.toString())
        }
        else {
            if (delegate_owner_address) {
                this.setOwner(delegate_owner_address)
            }

            const profile = this.owner ? await client.query({
                query: GET_MY_PROFILE,
                variables: {
                    address: this.owner!
                }
            }) : null

            if (profile?.data.account) {
                console.log('Profile::', profile.data.account)
                SecureStore.setItem('profile', 'registered')
                SecureStore.setItem('account', 'registered')
                SecureStore.setItem('deligate', 'registered')
                profile.data.account?.username?.username && SecureStore.setItem('username', profile.data.account?.username?.username)

            }
        }

        if (!this.owner || reset) {
            this.setOwner(this.account?.address()?.toString())
        }

        console.log('Owner::', this.owner)

        if (this.owner) {
            await client.query({
                query: GET_MY_PROFILE,
                variables: {
                    address: this.owner!
                }
            })
        }


    }

    async reloadAccount() {
        await client.query({
            query: GET_MY_PROFILE,
            variables: {
                address: this.owner!
            }
        })
    }

    async setOwner(owner: string) {
        this._owner = owner
        if (!isEmpty(owner)) {
            SecureStore.setItem('owner', owner)
        }
    }

    async setUsername(username: string) {
        SecureStore.setItem('username', username)
    }

    get username() {
        return SecureStore.getItem('username')
    }

    async linkAccount(connection: Connection, id: string) {
        const delegate_address = this.account?.address()?.toString()
        if (!connection || !connection.user_address || connection.delegate_address !== delegate_address) {
            throw new Error('No session found')
        }

        const serialized_data = await convergenceClient.mutate({
            mutation: INIT_DELEGATE,
            variables: {
                input: {
                    public_key: this.account?.pubKey()?.toString()!,
                    sender_address: this.account?.address()?.toString()!,
                    user_address: connection.user_address,
                }
            }
        })

        const data = serialized_data.data?.registerDelegateOnKadeAndHermes

        if (!data) {
            throw new Error('Unable to create account link intent')
        }

        const { raw_transaction, signature } = data

        const txn_deserializer = new Deserializer(new Uint8Array(raw_transaction))
        const signature_deserializer = new Deserializer(new Uint8Array(signature))
        const rawTransaction = RawTransaction.deserialize(txn_deserializer)
        const feePayerAuthenticator = AccountAuthenticator.deserialize(signature_deserializer)

        const accountSignature = aptos.transaction.sign({
            signer: this.signer!,
            transaction: {
                rawTransaction,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            }
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: accountSignature,
            transaction: {
                rawTransaction,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: feePayerAuthenticator
        })

        const txn_status = await aptos.transaction.waitForTransaction({
            transactionHash: commited_txn.hash
        })

        if (!txn_status.success) {
            throw new Error('Unable to link account')
        }

        try {
            await convergenceClient.mutate({
                mutation: CONFIRM_DELEGATE_LINKED,
                variables: {
                    input: {
                        connection_id: id
                    }
                }
            })
        }
        catch (e) {
            console.log("Failed to link delegate", e)
        }

        this.setOwner(connection.user_address)

        try {
            const profileQuery = await client.query({
                query: GET_MY_PROFILE,
                variables: {
                    address: connection.user_address
                }
            })

            if (profileQuery.data.account) {
                SecureStore.setItem('profile', 'registered')
                SecureStore.setItem('account', 'registered')
                SecureStore.setItem('deligate', 'registered')
                SecureStore.setItem('imported', 'true')
                profileQuery.data.account?.username?.username && SecureStore.setItem('username', profileQuery.data.account?.username?.username)

            }
            SecureStore.setItem('account', 'registered')
            SecureStore.setItem('deligate', 'registered')
            SecureStore.setItem('imported', 'true')

            return profileQuery.data?.account
        }
        catch (e) {
            SecureStore.setItem('account', 'registered')
            SecureStore.setItem('deligate', 'registered')
            SecureStore.setItem('imported', 'true')
            console.log('Unable to get profile')
            console.log("Error::", e)
            // TODO: caoture with posti
        }

    }

    async markAsRegistered() {
        SecureStore.setItem('deligate', 'registered')
    }


    // !!! IMPORTANT !!! - This is only for use in dev and internally for logout
    async nuke() {
        await SecureStore.deleteItemAsync('mnemonic')
        await SecureStore.deleteItemAsync('private_key')
        await SecureStore.deleteItemAsync('owner')
        await SecureStore.deleteItemAsync('username')
        await SecureStore.deleteItemAsync('deligate')
        await SecureStore.deleteItemAsync('account')
        await SecureStore.deleteItemAsync('profile')

        this._owner = null
        this.private_key = null
        this.signer = null
        this.account = null

        await this.init(true)
    }
}

export default new DelegateManager()