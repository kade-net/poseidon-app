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
import { GET_MY_PROFILE, GET_PUBLICATION, GET_PUBLICATIONS } from '../../utils/queries';
import localStore from '../../lib/local-store';
import { getAuthenticatorsAndRawTransaction } from './helpers';
import storage from '../../lib/storage';
import posti from '../../lib/posti';

class AccountContract {

    mutedUsers: Array<number> = []



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
        console.log("KADE ADDRESS:: ", KADE_ACCOUNT_ADDRESS)
        if (!delegateManager.signer || !delegateManager.account || !delegateManager.username) {
            throw new Error("No account found")
        }

        const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/account/account-setup-with-self-delegate`, {
            user_address: delegateManager.account?.address()?.toString(),
            username: delegateManager.username
        })

        const { raw_txn, signature } = response.data

        console.log("RAW TXN:: ", raw_txn)
        console.log("SIGNATURE:: ", signature)

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

    async followAccount(following_address: string, search?: string) {
        if (!delegateManager.signer) {
            throw new Error("No account found")
        }

        await localStore.addFollow(following_address, search)

        try {
            const txn_details = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/account/follow`, {
                following_address,
                delegate_address: delegateManager.account?.address()?.toString()
            })

            const { raw_txn_desirialized, sender_signature, fee_payer_signature } = txn_details

            const commited_txn = await aptos.transaction.submit.simple({
                senderAuthenticator: sender_signature,
                transaction: {
                    rawTransaction: raw_txn_desirialized,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: fee_payer_signature
            })

            const status = await aptos.transaction.waitForTransaction({
                transactionHash: commited_txn.hash
            })

            if (status.success) {
                return true
            }
            else {
                posti.capture('follow-account', {
                    user: delegateManager.owner,
                    delegate: delegateManager.account?.address(),
                    following_address,
                    error: 'Transaction failed'
                })
                await localStore.removeFollow(following_address)
                throw new Error("Transaction failed")
            }

        }
        catch (e) {
            await localStore.removeFollow(following_address)
            throw e
        }
    }

    async unFollowAccount(unfollowing_address: string, search?: string) {
        if (!delegateManager.signer) {
            throw new Error("No account found")
        }
        localStore.removeFollow(unfollowing_address, search)

        try {
            const txn_details = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/account/unfollow`, {
                unfollowing_address,
                delegate_address: delegateManager.account?.address()?.toString()
            })

            const { raw_txn_desirialized, sender_signature, fee_payer_signature } = txn_details

            const commited_txn = await aptos.transaction.submit.simple({
                senderAuthenticator: sender_signature,
                transaction: {
                    rawTransaction: raw_txn_desirialized,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: fee_payer_signature
            })


            const status = await aptos.transaction.waitForTransaction({
                transactionHash: commited_txn.hash
            })

            if (status.success) {
                return true
            }
            else {
                posti.capture('unfollow-account-error', {
                    user: delegateManager.owner,
                    delegate: delegateManager.account?.address(),
                    error: 'Unable to unfollow account',
                    unfollowing_address
                })
                await localStore.addFollow(unfollowing_address)
                throw new Error("Transaction failed")
            }

        }
        catch (e) {
            await localStore.addFollow(unfollowing_address)
            throw e
        }
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

    async nuke() {
        await SecureStore.deleteItemAsync('account')
        await SecureStore.deleteItemAsync('profile')
        await SecureStore.deleteItemAsync('imported')
        await SecureStore.deleteItemAsync('username')
    }

    async muteUser(id: number, address: string) {
        storage.save({
            key: 'muted',
            id: id.toString(),
            data: {
                muted: true,
                userAddress: address,
                id: id,
                at: Date.now()
            }
        })

        this.mutedUsers.push(id)

        client.refetchQueries({
            include: [GET_PUBLICATIONS]
        })
    }

    async unMuteUser(id: number) {
        storage.remove({
            key: 'muted',
            id: id.toString()
        })

        this.mutedUsers = this.mutedUsers.filter((muted) => muted !== id)
    }


    async loadMutedUsers() {
        try {
            const muted = await storage.getAllDataForKey('muted')
            this.mutedUsers = muted.map((muted) => muted.id)

        }
        catch (e) {
            this.mutedUsers = []
        }
    }

}

export default new AccountContract()