import '../global'
import 'react-native-get-random-values'
import * as bip39 from 'bip39'
import { AptosAccount, HexString } from 'aptos'
import * as SecureStore from 'expo-secure-store';
import { ACCOUNT_ENTRY_FUNCTIONS, APP_SUPPORT_API, KADE_ACCOUNT_ADDRESS, aptos } from '../contract';
import { Account, AccountAddress, AccountAuthenticator, Deserializer, Ed25519PrivateKey, RawTransaction, Serializer } from '@aptos-labs/ts-sdk';
import axios from 'axios';


const DERIVATION_PATH = "m/44'/637'/0'/0'/0'"



class DelegateManager {
    private_key: string | null = null;
    account: AptosAccount | null = null;
    private _owner: string | null = null;
    signer: Account | null = null;

    get isDeligateRegistered() {
        const registered = SecureStore.getItem('deligate')
        if (registered) {
            return true
        }
        return false
    }

    get owner() {
        let current = this._owner
        if (!current) {
            current = SecureStore.getItem('owner')
        }
        return current
    }

    get mnemonic() {
        return SecureStore.getItem('mnemonic')
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
            this.setOwner(account.address().toString()) // THEY ARE BOTH THEIR DELEGATE AND OWNER
        }
        catch (e) {
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
                throw new Error('Unable to submit transaction')
            }
        }
        catch (e) {
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
                throw new Error('Unable to submit transaction')
            }
        }
        catch (e) {
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

    async init() {
        console.log("Owner::", this.owner)
        let pk = await SecureStore.getItemAsync('private_key')

        if (!pk) {
            const private_key = await this.createDelegate()
            await SecureStore.setItemAsync('private_key', private_key)


            pk = private_key
        }

        this.account = new AptosAccount(new HexString(pk).toUint8Array())
        this.signer = Account.fromPrivateKey({
            privateKey: new Ed25519PrivateKey(new HexString(pk).toUint8Array())
        })
        this.private_key = pk


    }

    async setOwner(owner: string) {
        this._owner = owner
        SecureStore.setItem('owner', owner)
    }

    async setUsername(username: string) {
        SecureStore.setItem('username', username)
    }

    get username() {
        return SecureStore.getItem('username')
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

        SecureStore.setItem('deligate', 'registered')
    }

    async markAsRegistered() {
        SecureStore.setItem('deligate', 'registered')
    }


    // !!! IMPORTANT !!! - This is only for use in dev 
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
    }
}

export default new DelegateManager()