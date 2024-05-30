import { AccountAddress, Aptos, SimpleTransaction, UserTransactionResponse } from "@aptos-labs/ts-sdk"
import { aptos } from "../../contract"
import delegateManager from "../delegate-manager"
import { Effect } from "effect"
import { TransactionBuildError, TransactionSimulationError } from "./errors"
import { TransactionFailedError, TransactionSubmissionError } from "../../utils/errors"

const WITHDRAW_EVENT_TYPE = "0x1::coin::WithdrawEvent"
const DEPOSIT_EVENT_TYPE = "0x1::coin::DepositEvent"
const FUNGIBLE_ASSET_METADATA = "0x1::fungible_asset::Metadata"
const MINT_EVENT = '0x4::collection::MintEvent'

interface AcquiredAsset {
    type: 'nft' | 'fungible_asset' | 'none'
    amount: number
    metadata?: {
        image: string
        name: string
    }
}

export interface AccountChanges {
    gas_used: number
    withdrawn_amount: number
    total_amount: number
    acquired_assets: AcquiredAsset[]
}

function extractDepositAndWithdrawalEvents(simulatedTransaction: UserTransactionResponse) {

    if (!simulatedTransaction.success) throw new Error(simulatedTransaction.vm_status)
    const DELEGATE_ADDRESS = delegateManager.account?.address().toString()!
    const depositEvent = simulatedTransaction.events.find((event) => event.type == DEPOSIT_EVENT_TYPE) ?? null
    const withdrawEvent = simulatedTransaction.events.find((event) => event.type == WITHDRAW_EVENT_TYPE) ?? null
    const fungible_asset = simulatedTransaction.events.find((event) => event.type == FUNGIBLE_ASSET_METADATA) ?? null
    const mintEvent = simulatedTransaction.events.find((event) => event.type == MINT_EVENT) ?? null
    const mintedNFTs = simulatedTransaction.events.filter((event) => event.type == MINT_EVENT)

    const GAS_UNIT_PRICE_APT = parseInt(simulatedTransaction?.gas_unit_price ?? 0) / 100000000
    const GAS_USED_APT = parseInt(simulatedTransaction?.gas_used ?? 0) / 100000000
    // console.log("GasUsed::", GAS_USED_APT)
    const withdraw_amount = (withdrawEvent?.guid?.account_address === DELEGATE_ADDRESS ? parseInt(withdrawEvent?.data?.amount ?? 0) : 0) / 100_000_000
    // console.log("WithdrawAmount::", withdraw_amount)
    const total_amount = -(withdraw_amount + GAS_USED_APT)
    let transactionAmount = 0;

    return {
        gas_used: GAS_USED_APT,
        withdrawn_amount: withdraw_amount,
        total_amount: total_amount,
        acquired_assets: mintedNFTs.map((mintedNFTs) => {
            return {
                amount: 1,
                type: 'nft',
            } as AcquiredAsset
        })
    }
}

export interface buildPortalTransactionArgs {
    module_function: string,
    module_arguments: string
    type_arguments?: string
}

export function buildPortalTransaction(aptos: Aptos, args: buildPortalTransactionArgs) {
    const { module_arguments, module_function, type_arguments } = args

    // console.log("Args::", args)

    // return Effect.tryPromise({
    //     try: async () => {
    //         console.log("Address::", delegateManager.account?.address().toString())
    //         const transaction = await aptos.transferCoinTransaction({
    //             amount: 5,
    //             sender: delegateManager.account?.address().toString()!,
    //             recipient: AccountAddress.from("0xf6391863cca7d50afc4c998374645c8306e92988c93c6eb4b56972dd571f8467"),
    //             options: {
    //                 maxGasAmount: 1000,
    //             }
    //         })

    //         // await aptos.transaction.signAndSubmitTransaction({
    //         //     signer: delegateManager.signer!,
    //         //     transaction
    //         // })

    //         return transaction
    //     },
    //     catch(error) {
    //         return new TransactionBuildError({
    //             originalError: error
    //         })
    //     },
    // })

    const functionArguments = module_arguments?.split(",")?.map((parameter) => {
        if (parameter.startsWith("0x")) return parameter

        const v = parseInt(parameter)

        if (isNaN(v)) {
            return parameter
        }

        return v
    })

    console.log("FunctionArguments::", functionArguments)

    const task = Effect.tryPromise({
        try: async () => {
            const transaction = await aptos.transaction.build.simple({
                sender: delegateManager.account?.address().toString()!,
                data: {
                    function: module_function as any,
                    functionArguments,
                    typeArguments: type_arguments ? type_arguments?.split(",") : []
                },
                options: {
                    expireTimestamp: Date.now() + 1000 * 60 * 60 * 24,
                }
            })

            return transaction

        },
        catch(error) {
            return new TransactionBuildError({
                originalError: error
            })
        },
    })

    return task
}


interface getSimulationResultArgs {
    transaction: SimpleTransaction
}

export function getSimulationResult(aptos: Aptos, args: getSimulationResultArgs) {

    // return Effect.sleep(3000).pipe(
    //     Effect.flatMap(() => Effect.succeed(null))
    // )
    const { transaction } = args

    const task = Effect.tryPromise({
        try: async () => {
            const [_transaction] = await aptos.transaction.simulate.simple({
                signerPublicKey: delegateManager.signer?.publicKey!,
                transaction
            })

            const changes = extractDepositAndWithdrawalEvents(_transaction)

            return {
                changes,
                isSuccessful: _transaction.success,
                transaction: _transaction,
                vm_status: _transaction.vm_status,
            }

        },
        catch(error) {
            return new TransactionSimulationError({
                originalError: error
            })
        },
    })

    return task
}

export function submitPortalTransaction(aptos: Aptos, transaction: SimpleTransaction) {
    // return Effect.sleep(3000).pipe(
    //     Effect.flatMap(() => Effect.succeed(null))
    // )
    const task = Effect.tryPromise({
        try: async () => {
            // transaction.rawTransaction.payload
            const commitedTxn = await aptos.transaction.signAndSubmitTransaction({
                signer: delegateManager.signer!,
                transaction
            })

            console.log("CommitedTxn::", commitedTxn)

            return commitedTxn
        },
        catch(error) {
            console.log("Error::", error)
            return new TransactionSubmissionError(error)
        }
    }).pipe(
        Effect.flatMap((commitedTxn) => {
            return Effect.tryPromise({
                try: async () => {
                    const status = await aptos.transaction.waitForTransaction({
                        transactionHash: commitedTxn.hash
                    })

                    if (!status.success) throw new Error("Unable to submit transaction")

                    return commitedTxn.hash
                },
                catch(error) {
                    console.log("Error::", error)
                    return new TransactionFailedError(error)
                },
            })
        })
    )

    return task
}
