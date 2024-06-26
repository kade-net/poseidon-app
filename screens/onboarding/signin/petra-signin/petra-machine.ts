import { assign, setup } from "xstate";
import { MachineParams } from "../../../../components/ui/action-sheets/in-app-transactions/types";
import { disconnect } from "effect/Effect";

interface Context {
    connectionError: string
    signingError: string
    submittingError: string
}


type Events = MachineParams<{
    connect: {},
    connected: {},
    errorConnecting: {
        errorMessage: string
    },
    sign: {},
    signed: {},
    errorSigning: {
        errorMessage: string
    }
    submit: {},
    submitted: {},
    errorSubmitting: {
        errorMessage: string
    },
    disconnect: {},
    retryConnection: {},
    retrySigning: {},
    retrySubmitting: {},
}>

export const petraMachine = setup({
    types: {
        context: {

        } as Context,
        events: {

        } as Events
    },
    actions: {
        startConnection: async () => {

        },
        onError: assign(({ context }, params: { errorMessage: string }) => {
            return {
                connectionError: params.errorMessage
            }
        }),
        onErrorSigning: assign(({ context }, params: { errorMessage: string }) => {
            return {
                signingError: params.errorMessage
            }
        }),
        onErrorSubmitting: assign(({ context }, params: { errorMessage: string }) => {
            return {
                submittingError: params.errorMessage
            }
        })
    }
}).createMachine({
    initial: 'unconnected',
    context: {

    } as Context,
    states: {
        unconnected: {
            on: {
                connect: {
                    target: "connecting",
                    actions: "startConnection"
                }
            }
        },
        connecting: {
            on: {
                connected: {
                    target: "connected"
                },
                errorConnecting: {
                    target: "errorConnecting",
                    actions: {
                        type: 'onError',
                        params({ context, event }) {
                            return {
                                errorMessage: event.params.errorMessage
                            }
                        },
                    }
                }
            }
        },
        connected: {
            on: {
                sign: {
                    target: "signing"
                },
                disconnect: {
                    target: "disconnected",
                }
            }
        },
        signing: {
            on: {
                signed: {
                    target: 'submitting',
                },
                errorSigning: {
                    target: 'errorSigning',
                    actions: {
                        type: 'onErrorSigning',
                        params({ context, event }) {
                            return {
                                errorMessage: event.params.errorMessage
                            }
                        }
                    }
                }
            }
        },
        submitting: {
            on: {
                submitted: {
                    target: 'done'
                },
                errorSubmitting: {
                    target: 'errorSubmitting',
                    actions: {
                        type: 'onErrorSubmitting',
                        params({ context, event }) {
                            return {
                                errorMessage: event.params.errorMessage
                            }
                        }
                    }
                }
            }
        },
        errorConnecting: {
            on: {
                retryConnection: {
                    target: 'connecting'
                }
            }
        },
        errorSigning: {
            on: {
                retrySigning: {
                    target: 'signing'
                }
            }
        },
        errorSubmitting: {
            on: {
                retrySubmitting: {
                    target: 'submitting'
                }
            }
        },
        disconnected: {
            on: {
                connect: {
                    target: 'connecting'
                }
            }
        },
        done: {
            type: 'final'
        }
    }
})