import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction } from "@aptos-labs/ts-sdk"
import { aptos } from "../contract"
import delegateManager from "../lib/delegate-manager"
import * as convergenceMutations from '../lib/convergence-client/queries'
import { Effect, Either } from "effect"
import { convergenceClient } from "../data/apollo"
import { AccountSignatureError, DeserializationError, TransactionFailedError, TransactionFetchError, TransactionGenerationError, TransactionSubmissionError, UnknownError } from "./errors"
import config from "../config"

interface deserializeTransactionArgs {
    raw_transaction: Array<number>
    signature: Array<number>
}


export function deserializeTransaction(args: deserializeTransactionArgs) {
    const { raw_transaction, signature } = args

    const transaction_deserializer = new Deserializer(new Uint8Array(raw_transaction))
    const signature_deserializer = new Deserializer(new Uint8Array(signature))

    const deserialized_transaction = RawTransaction.deserialize(transaction_deserializer)
    const deserialized_signature = AccountAuthenticator.deserialize(signature_deserializer)

    return {
        deserialized_transaction,
        deserialized_signature
    }

}

type generateAccountSignatureArgs = ReturnType<typeof deserializeTransaction> & {
    fee_payer_address: string
}

export function generateAccountSignature(args: generateAccountSignatureArgs) {
    const account_signature = aptos.transaction.sign({
        signer: delegateManager.signer!,
        transaction: {
            rawTransaction: args.deserialized_transaction,
            feePayerAddress: AccountAddress.from(args.fee_payer_address)
        }
    })

    return account_signature
}

type generateUnsubmitedTransactionArgs = ReturnType<typeof deserializeTransaction> & {
    account_signature: AccountAuthenticator
    fee_payer_address: string
}

export function generateUnsubmitedTransaction(args: generateUnsubmitedTransactionArgs) {
    const { deserialized_signature, deserialized_transaction, account_signature, fee_payer_address } = args

    const transaction = aptos.transaction.submit.simple({
        senderAuthenticator: account_signature,
        transaction: {
            rawTransaction: deserialized_transaction,
            feePayerAddress: AccountAddress.from(fee_payer_address)
        },
        feePayerAuthenticator: deserialized_signature
    })

    return transaction

}


interface constructConvergenceTransactionArgs<InputArgs = any> {
    name: keyof typeof convergenceMutations,
    variables: InputArgs
    fee_payer_address: string
}

export function constructConvergenceTransaction<InputArgs = any>(args: constructConvergenceTransactionArgs<InputArgs>) {

    const task = Effect.tryPromise({
        try: async () => {
            const result = await convergenceClient.mutate({
                mutation: convergenceMutations[args.name],
                variables: {
                    // @ts-ignore 
                    args: args.variables
                }
            })

            console.log("Result::", result)
            // @ts-ignore // TODO: Fix this
            const data = result?.data?.[args.name]

            if (!data) throw new Error("Response is null")

            return data
        },
        catch(error) {
            return new TransactionFetchError(error)
        },
    })
        .pipe(
            Effect.flatMap((data) => {
                return Effect.try({
                    try: () => {
                        const deserialized = deserializeTransaction(data)
                        return deserialized
                    },
                    catch(error) {
                        return new DeserializationError(error)
                    },
                })
            }),
            Effect.flatMap((deserialized) => {
                return Effect.try({
                    try() {
                        const account_signature = generateAccountSignature({
                            ...deserialized,
                            fee_payer_address: config.HERMES_MODULE_ADDRESS
                        })

                        return {
                            ...deserialized,
                            account_signature
                        }
                    },
                    catch(error) {
                        return new AccountSignatureError(error)
                    },
                })
            }),
            Effect.flatMap((transactionArgs) => {
                return Effect.try({
                    try() {
                        const transaction = generateUnsubmitedTransaction({
                            ...transactionArgs,
                            fee_payer_address: config.HERMES_MODULE_ADDRESS
                        })

                        return transaction
                    },
                    catch(error) {
                        return new TransactionGenerationError(error)
                    }
                })
            }),
            Effect.flatMap((unsubmittedTransaction) => {
                return Effect.tryPromise({
                    try: async () => {
                        const commited_txn = await unsubmittedTransaction

                        return commited_txn
                    },
                    catch(e) {
                        return new TransactionSubmissionError(e)
                    }
                })
            }),
            Effect.flatMap((pendingResponse) => {
                return Effect.tryPromise({
                    try: async () => {
                        const status = await aptos.waitForTransaction({
                            transactionHash: pendingResponse.hash
                        })

                        if (!status.success) {
                            throw new Error("Transaction Failed")
                        }

                        return status.hash
                    },
                    catch(e) {
                        return new TransactionFailedError(e)
                    }
                })
            })
        )

    return task

}

type ExtractSecond<T> = T extends Effect.Effect<any, infer U, any> ? U : never;

type Errors = ExtractSecond<ReturnType<typeof constructConvergenceTransaction>>;

interface settleConvergenceTransactionArgs {
    task: ReturnType<typeof constructConvergenceTransaction>
    onSettled: (hash: string) => Promise<void>
    onError: (errors: Errors | UnknownError) => void
}

export async function settleConvergenceTransaction(args: settleConvergenceTransactionArgs) {
    const { task, onSettled, onError } = args
    const result = await Effect.runPromise(Effect.either(task))

    if (Either.isEither(result)) {
        if (Either.isLeft(result)) {
            onError(result.left)
        }
        if (Either.isRight(result)) {
            return await onSettled(result.right)
        }
    } else {
        onError(new UnknownError("Not an either"))
    }
}
