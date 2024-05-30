import { SimpleTransaction, UserTransactionResponse } from '@aptos-labs/ts-sdk'
import { cancel, createMachine, setup, assign } from 'xstate'
import { AccountChanges, buildPortalTransaction, getSimulationResult, submitPortalTransaction } from '../../../../lib/transactions/portal-transactions'
import { aptos } from '../../../../contract'
import { Effect, Either } from 'effect'
import { MachineParams } from './types'

interface Context {
    simpleTransaction: SimpleTransaction | null
    simulatedTransaction: UserTransactionResponse | null
    accountChanges: AccountChanges | null
    errorMessage: string | null
    transactionHash: string | null
    module_arguments: string | null
    module_function: string | null
    type_arguments: string | null
}

type Events = MachineParams<{
    simulate: {
        module_arguments: string
        module_function: string
        type_arguments: string | null
    }
    submit: {}
    cancel: {}
    fail: {
        errorMessage: string
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
    transactionSuccessful: {
        transactionHash: string

    }
}>

export const inAppTransactionsMachine = setup({
    types: {
        context: {} as Context,
        events: {} as Events
    },
    actions: {
        startSimulation: async ({ context, event, self }, params: { module_arguments: string, module_function: string, type_arguments: string | null }) => {
            const { module_arguments, module_function, type_arguments } = params
            console.log("Starting simulation::", module_arguments, module_function)
            const result = await Effect.runPromise(
                Effect.either(buildPortalTransaction(aptos, {
                    module_arguments,
                    module_function,
                    type_arguments: type_arguments ? type_arguments : undefined
                }))
            )

            await Either.match(result, {
                onLeft(left) {
                    console.log("Error::", left.originalError)
                    self.send({
                        type: 'fail',
                        params: {
                            errorMessage: left._tag == 'TransactionBuildError' ? 'Transaction build error' : 'Generic build error'
                        }
                    })
                },
                async onRight(right) {
                    console.log("Transaction::", right)
                    const simpleTransaction = right
                    const simulationResult = await Effect.runPromise(
                        Effect.either(getSimulationResult(aptos, {
                            transaction: right!
                        }))
                    )

                    Either.match(simulationResult, {
                        onLeft(left) {
                            console.log("Error::", left.originalError)
                            self.send({
                                type: 'fail',
                                params: {
                                    errorMessage: left._tag == 'TransactionSimulationError' ? 'Transaction simulation error' : 'Generic simulation error'
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
                accountChanges: params.changes,
                simpleTransaction: params.transaction,
                module_arguments: params.module_arguments,
                module_function: params.module_function,
                type_arguments: params.type_arguments
            }
        }),
        startConfirmation: async ({ self, context, event }) => {
            const transactionResult = await Effect.runPromise(
                Effect.either(submitPortalTransaction(aptos, context.simpleTransaction!))
            )

            Either.match(transactionResult, {
                onLeft(left) {
                    console.log("Error::", left)
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
        },
        onError: assign((_, params: { errorMessage: string }) => {
            console.log("Error::", params.errorMessage)
            return {
                errorMessage: params.errorMessage
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
        })
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
                simulate: {
                    target: 'simulating',
                    actions: {
                        type: 'startSimulation',
                        params: ({ event }) => {
                            console.log("Event::", event)
                            return {
                                module_arguments: event.params.module_arguments,
                                module_function: event.params.module_function,
                                type_arguments: event.params.type_arguments
                            }
                        }
                    }
                }
            },

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
                                errorMessage: event.params.errorMessage
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
                    actions: 'startConfirmation'
                },
                cancel: {
                    target: 'closed',
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
                    target: 'closed'
                },
                retry: {
                    target: 'simulating',
                    actions: {
                        type: 'startSimulation',
                        params: ({ event, context }) => {
                            return {
                                module_arguments: context.module_arguments!,
                                module_function: context.module_function!,
                                type_arguments: context.type_arguments
                            }
                        }
                    }

                },

            },
        },
        failedSubmission: {
            on: {
                cancel: {
                    target: 'closed'
                },
                retry: {
                    target: 'simulated',
                    actions: 'onRetry'
                },
            }
        }
    }
})