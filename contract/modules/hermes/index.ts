import { Effect, Either } from 'effect'
import delegateManager from '../../../lib/delegate-manager'
import { EmptyError, NoOwner, UnknownError } from '../../../utils/errors'
import { convergenceClient } from '../../../data/apollo'
import { registerRequestInbox } from '../../../lib/convergence-client/queries'
import { constructConvergenceTransaction, settleConvergenceTransaction } from '../../../utils/transactions'
import config from '../../../config'
import { AcceptRequestArgs, RegisterRequestInboxInputArgs, RequestConversationArgs, SendArgs } from '../../../lib/convergence-client/__generated__/graphql'
import { FunctionResponse } from '../../../utils/functions'
import { TDM } from '../../../schema'
import { getInboxMessages } from './utils'

class Hermes {

    async registerInbox(): Promise<FunctionResponse> {

        if (!delegateManager || !delegateManager.owner) {
            return {
                success: false,
                error: new NoOwner(),
                data: null
            }
        }

        const task = constructConvergenceTransaction({
            fee_payer_address: config.HERMES_MODULE_ADDRESS,
            name: 'registerRequestInbox',
            variables: {
                address: delegateManager.owner!,
                public_key: delegateManager.account?.pubKey().toString()!
            } as RegisterRequestInboxInputArgs
        })

        let response: FunctionResponse<string> = {
            success: false,
            error: null,
            data: null
        }

        await settleConvergenceTransaction({
            task,
            onSettled: async (hash) => {
                response.data = hash
            },
            onError(error) {
                // TODO: deal with error here
                response.error = error
            },
        })

        return response

    }

    async requestConversation(user_address: string) {
        if (!delegateManager || !delegateManager.owner) {
            return {
                success: false,
                error: new NoOwner(),
                data: null
            }
        }

        const task = constructConvergenceTransaction({
            fee_payer_address: config.HERMES_MODULE_ADDRESS,
            name: 'requestConversation',
            variables: {
                envelope: "",
                sender_address: delegateManager.owner!,
                user_address: user_address,
            } as RequestConversationArgs
        })

        let response: FunctionResponse<string> = {
            success: false,
            error: null,
            data: null
        }

        await settleConvergenceTransaction({
            task,
            onSettled: async (hash) => {
                response.success = true
                response.data = hash
            },
            onError(error) {
                // TODO: deal with error here
                response.error = error
            },
        })

        return response

    }

    async acceptRequest(requester_address: string) {
        if (!delegateManager || !delegateManager.owner) {
            return {
                success: false,
                error: new NoOwner(),
                data: null
            }
        }

        const task = constructConvergenceTransaction({
            fee_payer_address: config.HERMES_MODULE_ADDRESS,
            name: 'acceptRequest',
            variables: {
                requester_address: requester_address,
                sender_address: delegateManager.owner!,
            } as AcceptRequestArgs
        })

        let response: FunctionResponse<string> = {
            success: false,
            error: null,
            data: null
        }

        await settleConvergenceTransaction({
            task,
            onSettled: async (hash) => {
                response.success = true
                response.data = hash
            },
            onError(error) {

                response.error = error
            }
        })

        return response
    }

    async send(args: {
        data: TDM,
        inbox_name: string,
        to: string
    }) {
        if (!delegateManager || !delegateManager.owner) {
            return {
                success: false,
                error: new NoOwner(),
                data: null
            }
        }

        const ref = `inbox::${args.inbox_name}::${Date.now()}::${delegateManager.owner}::dm`

        const task = constructConvergenceTransaction({
            fee_payer_address: config.HERMES_MODULE_ADDRESS,
            name: 'send',
            variables: {
                content: JSON.stringify(args.data),
                ref,
                sender_address: delegateManager.owner!,
                to: args.to
            } as SendArgs
        })

        let response: FunctionResponse<string> = {
            success: false,
            error: null,
            data: null
        }

        await settleConvergenceTransaction({
            task,
            onSettled: async (hash) => {
                response.success = true
                response.data = hash
            },
            onError(error) {
                response.error = error
            }
        })

        return response
    }

    async getInboxHistory(inbox_name: string, other_user: string) {
        const result = await Effect.runPromise(Effect.either(getInboxMessages({
            inbox_name,
            other_user
        })))

        if (Either.isEither(result)) {
            if (Either.isLeft(result)) {
                // TODO: handle error
                return []
            }
            else {
                return result.right
            }
        }
        return []
    }



}

const hermes = new Hermes()

export default hermes