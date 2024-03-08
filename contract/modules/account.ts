import '../../global'
import 'react-native-get-random-values'
import axios from "axios";
import { z } from "zod";
import delegateManager from "../../lib/delegate-manager";
import { KADE_ACCOUNT_ADDRESS, APP_SUPPORT_API, aptos, ACCOUNT_VIEW_FUNCTIONS } from "..";
import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";
import { TPROFILE, profileSchema } from "../../schema";
import * as SecureStore from 'expo-secure-store'
import client from '../../data/apollo';
import { GET_MY_PROFILE } from '../../utils/queries';
import localStore from '../../lib/local-store';

class AccountContract {

    get isImported() {
        const imported = SecureStore.getItem('imported')
        if (imported) {
            return true
        }
        return false
    }

    get isProfileRegistered() {
        const registered = SecureStore.getItem('profile')
        if (registered) {
            return true
        }
        return false
    }

    get isAccountRegistered() {
        const registered = SecureStore.getItem('account')
        if (registered) {
            return true
        }
        return false
    }

    async updateProfile(profile: TPROFILE) {
        if (!delegateManager.signer) {
            throw new Error("No account found")
        }

        await localStore.updateProfile(profile)

        const parsed = profileSchema.safeParse(profile)
        if (!parsed.success) {
            throw new Error("Invalid profile")
        }

        const data = parsed.data

        const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/account/update-profile`, {
            ...data,
            delegate_address: delegateManager.account?.address()?.toString()
        })

        const { raw_txn, signature } = response.data

        const txn_deserializer = new Deserializer(new Uint8Array(raw_txn))
        const signature_deserializer = new Deserializer(new Uint8Array(signature))

        const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
        const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

        const accountSignature = aptos.transaction.sign({
            signer: delegateManager.signer,
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

        const status = await aptos.transaction.waitForTransaction({
            transactionHash: commited_txn.hash
        })

        if (status.success) {
            await this.markProfileAsRegistered()
        }
        else {
            await localStore.removeProfile()
            throw new Error("Transaction failed")
        }
    }

    async setupWithSelfDelegate() {
        if (!delegateManager.signer || !delegateManager.account || !delegateManager.username) {
            throw new Error("No account found")
        }

        const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/account/account-setup-with-self-delegate`, {
            user_address: delegateManager.account?.address()?.toString(),
            username: delegateManager.username
        })

        const { raw_txn, signature } = response.data

        const txn_deserializer = new Deserializer(new Uint8Array(raw_txn))
        const signature_deserializer = new Deserializer(new Uint8Array(signature))

        const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
        const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

        const accountSignature = aptos.transaction.sign({
            signer: delegateManager.signer,
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


    async getAccount() {
        if (!delegateManager.account) {
            throw new Error("No account found")
        }

        const response = await aptos.view({
            payload: {
                function: ACCOUNT_VIEW_FUNCTIONS.get_account as any,
                functionArguments: [delegateManager.account?.address()?.toString()],
                typeArguments: []
            }
        })

        const data = response as [
            string,
            Array<string>
        ]

        const [kid, delegates] = data

        if (kid === "0") {
            return null
        }

        return {
            kid: parseInt(kid),
            delegates
        }


    }


    async markAsRegistered() {
        SecureStore.setItem('account', 'registered')
    }

    async markProfileAsRegistered() {
        SecureStore.setItem('profile', 'registered')
    }

    async markAsImported() {
        SecureStore.setItem('imported', 'true')
    }

}

export default new AccountContract()