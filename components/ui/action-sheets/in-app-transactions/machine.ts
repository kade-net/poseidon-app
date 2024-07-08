import { SimpleTransaction, UserTransactionResponse } from '@aptos-labs/ts-sdk'
import { cancel, createMachine, setup, assign } from 'xstate'
import { AccountChanges, buildPortalTransaction, getSimulationResult, submitPortalTransaction } from '../../../../lib/transactions/portal-transactions'
import { aptos } from '../../../../contract'
import { Effect, Either } from 'effect'
import { MachineParams } from './types'
import petra from '../../../../lib/wallets/petra'
import { FunctionParameter } from '@kade-net/portals-parser'
import delegateManager from '../../../../lib/delegate-manager'
import settings from '../../../../lib/settings'

interface Context {
    simpleTransaction: SimpleTransaction | null
    simulatedTransaction: UserTransactionResponse | null
    accountChanges: AccountChanges | null
    errorMessage: string | null
    transactionHash: string | null
    module_arguments: string | null
    module_function: string | null
    type_arguments: string | null
    currentWallet: 'petra' | 'delegate' | null
}

type Events = MachineParams<{
    simulate: {
        module_arguments: string
        module_function: string
        type_arguments: string | null
        currentWallet?: 'petra' | 'delegate' | null
    }
    submit: {
        current_location?: string
    }
    cancel: {}
    fail: {
        errorMessage: string
        module_arguments?: string
        module_function?: string
        type_arguments?: string | null
    }
    error: {
        errorMessage: string
    }
    retry: {}
    succeed: {
        changes: AccountChanges
        transaction: SimpleTransaction
        module_arguments: string
        module_function: string
        type_arguments: string | null
    },
    connectionSucceded: {
        module_arguments: string
        module_function: string
        type_arguments: string | null
        currentWallet: 'petra' | 'delegate'
    },
    transactionSuccessful: {
        transactionHash: string
    },
    connect: {
        module_arguments: string
        module_function: string
        type_arguments: string | null
        currentWallet: 'petra' | 'delegate' | null
    },
}>

export const inAppTransactionsMachine = setup({
    types: {
        context: {} as Context,
        events: {} as Events
    },
    actions: {
        onConnect: assign((_, params: { module_arguments: string, module_function: string, type_arguments: string | null, currentWallet: 'petra' | 'delegate' | null }) => {
            return {
                module_arguments: params.module_arguments,
                module_function: params.module_function,
                type_arguments: params.type_arguments,
                currentWallet: params.currentWallet
            }
        }),
        startSimulation: async ({ context, event, self }, params: { module_arguments: string, module_function: string, type_arguments: string | null, connectWallet: 'petra' | 'delegate' | null }) => {
            const { module_arguments, module_function, type_arguments, connectWallet } = params
            const currentWallet = settings.active?.preffered_wallet ?? connectWallet
            console.log("Current Wallet:", currentWallet)
            const CURRENT_ADDRESS = currentWallet === 'petra' ? petra.sharedSecret?.address : currentWallet == 'delegate' ? delegateManager.account?.address()?.toString() : null
            const result = await Effect.runPromise(
                Effect.either(buildPortalTransaction(aptos, {
                    module_arguments: module_arguments ?? context.module_arguments,
                    module_function: module_function ?? context.module_function,
                    type_arguments: type_arguments ?? context.type_arguments ?? undefined,
                    user_address: CURRENT_ADDRESS! // TODO: this assumption may be false
                }))
            )

            await Either.match(result, {
                onLeft(left) {
                    console.log("Error::", left.originalError)
                    self.send({
                        type: 'fail',
                        params: {
                            errorMessage: left._tag == 'TransactionBuildError' ? 'Transaction build error' : 'Generic build error',
                            module_arguments: module_arguments ?? context.module_arguments,
                            module_function: module_function ?? context.module_function,
                            type_arguments: type_arguments ?? context.type_arguments ?? undefined
                        }
                    })
                },
                async onRight(right) {
                    console.log("Transaction::", right)
                    const simpleTransaction = right
                    const simulationResult = await Effect.runPromise(
                        Effect.either(getSimulationResult(aptos, {
                            transaction: right!,
                            user_public_key: currentWallet === 'delegate' ? delegateManager.account?.pubKey()?.toString()! : petra.sharedSecret?.user_public_key!
                        }))
                    )

                    Either.match(simulationResult, {
                        onLeft(left) {
                            const MSG = left.originalError?.message

                            self.send({
                                type: 'fail',
                                params: {
                                    errorMessage: left._tag == 'TransactionSimulationError' ?
                                        MSG == "INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE" ?
                                            `Insufficient balance, this may happen when you don't have enough to cover the gas fee` : left?.originalError?.message ??
                                            'Transaction simulation error'
                                        : 'Generic simulation error',
                                    module_arguments: module_arguments ?? context.module_arguments,
                                    module_function: module_function ?? context.module_function,
                                    type_arguments: type_arguments ?? context.type_arguments ?? undefined
                                }
                            })
                        },
                        onRight(right) {
                            self.send({
                                type: 'succeed',
                                params: {
                                    changes: right?.changes!,
                                    transaction: simpleTransaction!,
                                    module_arguments: params.module_arguments,
                                    module_function: params.module_function,
                                    type_arguments: params.type_arguments
                                }
                            })
                        }
                    })
                }
            })

        },
        onSimulated: assign((_, params: {
            changes: AccountChanges,
            transaction: SimpleTransaction,
            module_arguments: string,
            module_function: string,
            type_arguments: string | null
        }) => {

            return {
                accountChanges: params.changes ?? _.context.accountChanges,
                simpleTransaction: params.transaction ?? _.context.simpleTransaction,
                module_arguments: params.module_arguments ?? _.context.module_arguments,
                module_function: params.module_function ?? _.context.module_function,
                type_arguments: params.type_arguments ?? _.context.type_arguments
            }
        }),
        startConfirmation: async ({ self, context, event }, params: { current_location?: string }) => {

            try {

                const active = settings.active

                if (active?.preffered_wallet == 'delegate') {
                    const transactionResult = await Effect.runPromise(
                        Effect.either(submitPortalTransaction(aptos, context.simpleTransaction!))
                    )

                    Either.match(transactionResult, {
                        onLeft(left) {

                            self.send({
                                type: 'fail',
                                params: {
                                    errorMessage: left._tag == "TransactionSubmissionError" ? "Unable to submit transaction" :
                                        left._tag == "TransactionFailedError" ? "Transaction failed" : "Generic submission error"
                                }
                            })
                        },
                        onRight(right) {
                            self.send({
                                type: 'transactionSuccessful',
                                params: {
                                    transactionHash: right ?? ""
                                }
                            })
                        }
                    })
                }
                else {
                    await petra.signAndSumbitTransaction({
                        functionArguments: FunctionParameter.prepareForSubmission(FunctionParameter.deserializeAll(context.module_arguments!)),
                        transactionFunction: context.module_function!,
                        type: "entry_function_payload"
                    }, params?.current_location)

                }

            }
            catch (error) {
                self.send({
                    type: 'fail',
                    params: {
                        errorMessage: "Unable to open petra"
                    }
                })
            }
        },
        onError: assign(({ context }, params: { errorMessage: string }) => {
            console.log("Error::", params.errorMessage)
            console.log("Context::", context)
            return {
                ...(context ?? null),
                ...(params ?? null)
            }
        }),
        onCancel: async ({ context, event }) => {

        },
        onRetry: async ({ context, event }) => {

        },
        onTransactionSuccessful: assign((_, params: { transactionHash: string }) => {
            return {
                transactionHash: params.transactionHash
            }
        }),
        onConnectionRetry: async ({ context, event }) => {

        }
    },
}).createMachine({
    initial: 'closed',
    context: {
        simpleTransaction: null,
        simulatedTransaction: null,
        accountChanges: null,
        errorMessage: null
    } as Context,
    states: {
        closed: {

            on: {
                // simulate: {
                //     target: 'simulating',
                //     actions: {
                //         type: 'startSimulation',
                //         params: ({ event }) => {
                //             console.log("Event::", event)
                //             return {
                //                 module_arguments: event.params.module_arguments,
                //                 module_function: event.params.module_function,
                //                 type_arguments: event.params.type_arguments
                //             }
                //         }
                //     }
                // },
                connect: {
                    target: 'connection',
                    actions: {
                        type: 'onConnect',
                        params: ({ event }) => {
                            return {
                                module_arguments: event.params.module_arguments,
                                module_function: event.params.module_function,
                                type_arguments: event.params.type_arguments,
                                currentWallet: event.params.currentWallet
                            }
                        }
                    }
                }
            },
        },
        connection: {
            on: {
                simulate: {
                    target: 'simulating',
                    actions: {
                        type: 'startSimulation',
                        params: ({ event }) => {
                            return {
                                module_arguments: event.params.module_arguments,
                                module_function: event.params.module_function,
                                type_arguments: event.params.type_arguments,
                                connectWallet: event.params.currentWallet ?? null
                            }
                        }
                    }
                },
                connect: {
                    target: 'connecting',
                    actions: {
                        type: 'onConnect',
                        params({ context, event }) {
                            return {
                                module_arguments: event.params.module_arguments,
                                module_function: event.params.module_function,
                                type_arguments: event.params.type_arguments,
                                currentWallet: event.params.currentWallet
                            }
                        },
                    }
                }
            }
        },
        connecting: {
            on: {
                connectionSucceded: {
                    target: 'simulating',
                    actions: {
                        type: 'startSimulation',
                        params: ({ event, context }) => {

                            return {
                                module_arguments: event.params.module_arguments!,
                                module_function: event.params.module_function,
                                type_arguments: event.params.type_arguments,
                                connectWallet: event.params.currentWallet
                            }
                        }
                    }
                },
                fail: {
                    target: "failedConnection",
                    actions: {
                        type: "onError",
                        params: ({ event }) => {
                            return {
                                errorMessage: event.params.errorMessage
                            }
                        },
                    }
                }
            }
        },
        simulating: {
            on: {
                succeed: {
                    target: 'simulated',
                    actions: {
                        type: 'onSimulated',
                        params: ({ event }) => {
                            return {
                                changes: event.params.changes,
                                transaction: event.params.transaction,
                                module_arguments: event.params.module_arguments,
                                module_function: event.params.module_function,
                                type_arguments: event.params.type_arguments
                            }
                        }
                    }
                },
                fail: {
                    target: 'failedSimulation',
                    actions: {
                        type: 'onError',
                        params: ({ event }) => {
                            console.log("Event Error::", event.params)
                            return {
                                ...event.params
                            }

                        }
                    }
                }
            }
        },
        simulated: {
            on: {
                submit: {
                    target: 'submitting',
                    actions: {
                        type: 'startConfirmation',
                        params: ({ event, context }) => {
                            return {
                                current_location: event.params.current_location
                            }
                        }
                    }

                },
                cancel: {
                    target: 'done',
                    actions: 'onCancel'
                }
            }
        },
        submitting: {
            on: {
                transactionSuccessful: {
                    target: 'successful',
                    actions: {
                        type: 'onTransactionSuccessful',
                        params: ({ event }) => {
                            return {
                                transactionHash: event.params.transactionHash
                            }
                        }
                    }
                },
                fail: {
                    target: 'failedSubmission',
                },
            }

        },
        successful: {
            type: 'final'
        },
        failedSimulation: {
            on: {
                cancel: {
                    target: 'done'
                },
                retry: {
                    target: 'simulating',
                    actions: {
                        type: 'startSimulation',
                        params: ({ event, context }) => {
                            console.log("Context Data::", context)
                            console.log("Event Data::", event)
                            return {
                                module_arguments: context.module_arguments!,
                                module_function: context.module_function!,
                                type_arguments: context.type_arguments,
                                connectWallet: context.currentWallet! // TODO: this assumes this would have already been set
                            }
                        }
                    }

                },

            },
        },
        failedSubmission: {
            on: {
                cancel: {
                    target: 'done'
                },
                retry: {
                    target: 'simulated',
                    actions: 'onRetry'
                },
            }
        },
        failedConnection: {
            on: {
                cancel: {
                    target: 'done'
                },
                retry: {
                    target: 'connecting',
                    actions: 'onConnectionRetry'
                }
            }
        },
        done: {
            type: 'final'
        }
    }
})