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
import client, { convergenceClient } from '../../data/apollo';
import { GET_MY_PROFILE, GET_PUBLICATION, GET_PUBLICATIONS } from '../../utils/queries';
import localStore from '../../lib/local-store';
import { getAuthenticatorsAndRawTransaction } from './helpers';
import storage from '../../lib/storage';
import posti from '../../lib/posti';
import { Utils } from '../../utils';
import { Effect } from 'effect';
import { BuildTransactionError, DeserializationError, TransactionFetchError, TransactionSubmissionError } from '../../utils/errors';
import { INIT_ACCOUNT_AND_INBOX } from '../../lib/convergence-client/queries';
import { enableDirectMessagingCacheUpdate } from './hermes/cache';

class AccountContract {

    mutedUsers: Array<number> = []

    locked: boolean = false

    lock() {
        console.log("Locked::")
        this.locked = true
    }

    unlock() {
        console.log("Unlocked")
        this.locked = false
    }

    waitForUnlock(): Promise<boolean> {
        return new Promise<boolean>(async (res, rej) => {
            if (this.locked) {
                console.log("Waiting for unlock")
                await Utils.sleep(1000)
                return res(this.waitForUnlock())
            } else {
                console.log("Resolved unlock")
                res(true)
            }
        })
    }

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
        console.log("PROFILE:: ", profile)
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
        const task = Effect.tryPromise({
            try: async () => {
                const serialized = await convergenceClient.mutate({
                    mutation: INIT_ACCOUNT_AND_INBOX,
                    variables: {
                        input: {
                            public_key: delegateManager.signer?.publicKey.toString()!,
                            sender_address: delegateManager.account?.address()?.toString()!,
                            username: delegateManager.username!
                        }
                    }
                })

                const args = serialized?.data?.initSelfDelegateKadeAccountWithHermesInbox

                if (!args || !args.raw_transaction || !args.signature) {
                    throw new Error("Invalid response")
                }

                return args
            },
            catch(e) {
                return new TransactionFetchError(e)
            }
        })
            .pipe(
                Effect.flatMap((serialized_args) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const txn_deserializer = new Deserializer(new Uint8Array(serialized_args.raw_transaction))
                            const signature_deserializer = new Deserializer(new Uint8Array(serialized_args.signature))

                            const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
                            const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

                            return {
                                raw_txn_deserialized,
                                signature_deserialized
                            }
                        },
                        catch(e) {
                            return new DeserializationError(e)
                        }
                    })
                }),
                Effect.flatMap((deserialized_args) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const accountSignature = aptos.transaction.sign({
                            signer: delegateManager.signer!,
                            transaction: {
                                rawTransaction: deserialized_args.raw_txn_deserialized,
                                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)  
                            },
                        })

                            const pendingTransaction = await aptos.transaction.submit.simple({
                                senderAuthenticator: accountSignature,
                                transaction: {
                                rawTransaction: deserialized_args.raw_txn_deserialized,
                                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                            },
                            feePayerAuthenticator: deserialized_args.signature_deserialized
                        })

                            return pendingTransaction
                        },
                        catch(error) {
                            return new BuildTransactionError(error)
                        },
                    })
                }),
                Effect.flatMap((pending) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const status = await aptos.transaction.waitForTransaction({
                                transactionHash: pending.hash
                            })

                            if (!status.success) {
                                throw new Error("Transaction failed")
                            }

                            return pending

                        },
                        catch(error) {
                            return new TransactionSubmissionError(error)
                        },
                    })
                }),
                Effect.tap(() => {
                    delegateManager.setOwner(delegateManager.account?.address()?.toString()!)
                    // enable direct messaging cache update
                    enableDirectMessagingCacheUpdate()
                    this.markAsRegistered()
                })
        )

        return Effect.runPromise(Effect.either(task))
    }

    async followAccount(following_address: string, search?: string, storeUpdated?: boolean) {

        if (!delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!storeUpdated) {
            await localStore.addFollow(following_address, search)
        }

        if (this.locked) {
            await this.waitForUnlock()
            await this.followAccount(following_address, search, true)
            return
        } else {
            this.lock()
        }

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
                this.unlock()
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
                this.unlock()
                throw new Error("Transaction failed")
            }

        }
        catch (e) {
            this.unlock()
            await localStore.removeFollow(following_address)
            throw e
        }
    }

    async unFollowAccount(unfollowing_address: string, search?: string, storeUpdated?: boolean) {
        if (!delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!storeUpdated) {
            localStore.removeFollow(unfollowing_address, search)
        }

        if (this.locked) {
            const unlocked = await this.waitForUnlock()
            await this.unFollowAccount(unfollowing_address, search, true)
            return
        } else {
            this.lock()
        }

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
                this.unlock()
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
                this.unlock()
                throw new Error("Transaction failed")
            }

        }
        catch (e) {
            await localStore.addFollow(unfollowing_address)
            this.unlock()
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
                functionArguments: [delegateManager.owner],
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