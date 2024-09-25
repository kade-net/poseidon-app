import { SerializedTransaction } from "../../convergence-client/__generated__/graphql";
import { ExecutableStep, Pipeline } from "../index";
import { Data, Effect } from "effect";
import { convergenceClient } from "../../../data/apollo";
import { FGS_REGISTER_INBOX } from "../../convergence-client/queries";
import { Client, generate_random_auth_string, getInbox, INBOX } from "@kade-net/fgs-rn";
import { Buffer } from 'buffer'
import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction } from "@aptos-labs/ts-sdk";
import { aptos, KADE_ACCOUNT_ADDRESS } from "../../../contract";
import * as SecureStore from 'expo-secure-store'
import { StoredFGSData } from "../../fgs/types";
import nacl from "tweetnacl";
import fgs from "../../fgs";

class UnableToCheckIfUserHasInbox extends Data.TaggedError('UnableToCheckIfUserHasInbox')<{
    initialError: any
}> {

}

class UnableToGetInboxArgs extends Data.TaggedError('UnableToGetInboxArgs')<{
    initialError: any
}> {

}

class UnableToGetSerializedTransaction extends Data.TaggedError('UnableToGetSerializedTransaction')<{
    initialError: any
}> {

}

class UnableToConstructAndSubmitTransaction extends Data.TaggedError('UnableToConstructAndSubmitTransaction')<{
    initialError: any
}> { }

class UnableToStoreAndInitializeFGSClient extends Data.TaggedError('UnableToStoreAndInitializeFGSClient')<{
    initialError: any
}> { }

const initializeFGSAccountSteps: Array<ExecutableStep<{ newInbox: Omit<INBOX, 'timestamp'>, secret_signature: string, alreadyCreated?: boolean }>> = [
    {
        name: 'check if the user has already created an inbox',
        execute: (delegate, { prevResult, context }) => {
            return Effect.tryPromise({
                try: async () => {
                    const INBOX_ADDRESS = delegate.account?.address().toString()!


                    try {
                        const inbox = await getInbox(INBOX_ADDRESS)

                        if (!inbox) {
                            return {
                                context: {
                                    alreadyCreated: false,
                                } as any,
                                prevResult: null
                            }
                        }

                        const signature = delegate.signer?.sign(Buffer.from(inbox.rand_auth_string, 'utf-8')).toUint8Array().slice(0, 32)!

                        const secret_signature = Buffer.from(signature).toString('hex')

                        return {
                            context: {
                                alreadyCreated: true,
                                newInbox: inbox,
                                secret_signature
                            },
                            prevResult: null
                        }
                    }
                    catch (e) {

                        return {
                            context: {
                                alreadyCreated: false,
                            } as any,
                            prevResult: null
                        }
                    }


                },
                catch(e) {
                    return new UnableToCheckIfUserHasInbox({ initialError: e })
                }
            })
        }
    },
    {
        name: 'get inbox parameters',
        execute: (delegate, { prevResult, context }) => {
            return Effect.tryPromise({
                try: async () => {
                    if (context.alreadyCreated) return {
                        context,
                        prevResult: context.newInbox
                    }
                    const INBOX_ADDRESS = delegate.account?.address().toString()!

                    const rand_auth_string = generate_random_auth_string({
                        inbox_owner: INBOX_ADDRESS,
                    })

                    const signature = delegate.signer?.sign(Buffer.from(rand_auth_string, 'utf-8')).toUint8Array().slice(0, 32)!
                    const secret_signature = Buffer.from(signature).toString('hex')


                    const inbox = await Client.getNewAccountInbox({
                        address: INBOX_ADDRESS,
                        node: 'poseidon',
                        secret_signature,
                        random_auth_string: rand_auth_string
                    })

                    return {
                        context: { newInbox: inbox, secret_signature },
                        prevResult: inbox
                    }
                },
                catch(e) {
                    return new UnableToGetInboxArgs({ initialError: e })
                }
            })
        }
    },
    {
        name: 'get transaction from convergence',
        execute(delegate, { prevResult: _prevResult, context }) {
            const prevResult = _prevResult as INBOX
            return Effect.tryPromise({
                try: async () => {

                    if (context.alreadyCreated) return {
                        context,
                        prevResult: null
                    }

                    const INBOX_ADDRESS = delegate.account?.address().toString()!
                    const mutationResult = await convergenceClient.mutate({
                        mutation: FGS_REGISTER_INBOX,
                        variables: {
                            input: {
                                sign_public_key: prevResult.sign_public_key,
                                node: 'poseidon',
                                encrypt_public_key: prevResult.encrypt_public_key,
                                encrypted_private_key_set: prevResult.encrypted_private_key_set,
                                randAuthString: prevResult.rand_auth_string,
                                sender_address: INBOX_ADDRESS
                            }
                        }
                    })

                    const result = mutationResult.data?.fgsRegisterInbox ?? null

                    if (!result) {
                        throw new Error("Unable to get transaction from convergence")
                    }

                    return {
                        context,
                        prevResult: result
                    }
                },
                catch(e) {
                    return new UnableToGetSerializedTransaction({
                        initialError: e
                    })
                }
            })
        }
    },
    {
        name: 'construct and submit on chain transaction',
        execute(delegate, { prevResult: _prevResult, context }) {

            const prevResult = _prevResult as SerializedTransaction

            return Effect.tryPromise({
                try: async () => {

                    if (context.alreadyCreated) return {
                        context,
                        prevResult: null
                    }

                    const txn_deserializer = new Deserializer(new Uint8Array(prevResult.raw_transaction))
                    const signature_deserializer = new Deserializer(new Uint8Array(prevResult.signature))

                    const raw_transaction = RawTransaction.deserialize(txn_deserializer)
                    const signature = AccountAuthenticator.deserialize(signature_deserializer)

                    const accountSignature = aptos.transaction.sign({
                        signer: delegate.signer!,
                        transaction: {
                            rawTransaction: raw_transaction,
                            feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                        }
                    })

                    const pendingTransaction = await aptos.transaction.submit.simple({
                        senderAuthenticator: accountSignature,
                        transaction: {
                            rawTransaction: raw_transaction,
                            feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                        },
                        feePayerAuthenticator: signature
                    })

                    const status = await aptos.waitForTransaction({
                        transactionHash: pendingTransaction.hash
                    })

                    if (!status.success) {
                        throw new Error("Transaction failed")
                    }

                    return {
                        context,
                        prevResult: status
                    }
                },
                catch(error) {
                    return new UnableToConstructAndSubmitTransaction({
                        initialError: error
                    })
                },
            })
        }
    },
    {
        name: 'save inbox locally for future use',
        execute(delegate, { prevResult, context }) {
            return Effect.tryPromise({
                try: async () => {

                    const INBOX_ADDRESS = delegate.account?.address().toString()!
                    // INFO: Though inbox can be changed, this is an operation that will probably not be done by users for a while, so we can safely assume it will not change
                    const client = await Client.init({
                        inbox_address: INBOX_ADDRESS,
                        secret_signature: context.secret_signature
                    })

                    // set client on singleton
                    fgs.setClient(client)

                    const encryptionSecret = Buffer.from(client.encryptionKeyPair.secretKey).toString('hex')
                    const signSecret = Buffer.from(client.signKeyPair.secretKey).toString('hex')


                    await SecureStore.setItemAsync(`fgs_inbox_${INBOX_ADDRESS}`, JSON.stringify({
                        encryptionSecret,
                        signSecret,
                        secret_signature: context.secret_signature,
                    } satisfies StoredFGSData))


                    return {
                        context,
                        prevResult: client
                    }
                },
                catch(error) {
                    console.error("Unable to save inbox locally", error)
                    return new UnableToStoreAndInitializeFGSClient({
                        initialError: error
                    })
                }
            })
        }
    }
]


export const initializeFGSAccountPipeline = new Pipeline(initializeFGSAccountSteps)

