import { Effect, Either } from 'effect'
import delegateManager from '../../../lib/delegate-manager'
import { NoOwner } from '../../../utils/errors'
import { constructConvergenceTransaction, settleConvergenceTransaction } from '../../../utils/transactions'
import config from '../../../config'
import { AcceptRequestArgs, RegisterRequestInboxInputArgs, RequestConversationArgs, SendArgs } from '../../../lib/convergence-client/__generated__/graphql'
import { FunctionResponse } from '../../../utils/functions'
import { TDM } from '../../../schema'
import { INBOX_NAME, encryptEnvelopeContent, getInboxMessages, retrieveMessagesFromPDS, saveIncomingMessage, saveOwnMessage, serializeInboxName } from './utils'
import { queryClient } from '../../../data/query'
import storage from '../../../lib/storage'

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

        const mainTask = encryptEnvelopeContent({
            content: args.data,
            inbox_name: args.inbox_name as INBOX_NAME,
        }).pipe(
            Effect.flatMap((encryptedMessage) => {
                return constructConvergenceTransaction({
                    fee_payer_address: config.HERMES_MODULE_ADDRESS,
                    name: 'send',
                    variables: {
                        content: encryptedMessage,
                        ref,
                        sender_address: delegateManager.owner!,
                        to: args.to
                    } as SendArgs
                })
            })
        )

        let response: FunctionResponse<string> = {
            success: false,
            error: null,
            data: null
        }

        await settleConvergenceTransaction({
            task: mainTask,
            onSettled: async (hash) => {
                console.log("Hash::", hash)
                await saveOwnMessage({
                    content: args.data.content,
                    inbox_name: args.inbox_name as INBOX_NAME,
                    ref,
                    sender: delegateManager.owner!,
                    isMine: true,
                    media: args.data.media,
                    receiver: args.to,
                })
                response.success = true
                response.data = hash
            },
            onError(error) {
                console.log("Error::", error)
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
                console.log("Error::", result.left)
                // TODO: handle error
                return []
            }
            else {
                return result.right
            }
        }
        return []
    }

    async getPDSData(inbox_name: string) {

        const result = await retrieveMessagesFromPDS(inbox_name as INBOX_NAME)

        return result

    }

    // NOTE: we'll make the assumption its a valid envelope for now
    async saveIncomingMessage(envelope: any) {
        const result = await saveIncomingMessage(envelope)

        if (Either.isEither(result)) {
            if (Either.isLeft(result)) {
                console.log("Error::", result.left)
                // silent fail
            }

            if (Either.isRight(result)) {
                queryClient.invalidateQueries(['getDecryptedMessageHistory', result.right.inbox_name])
                return result.right
                // silent success
            }
        }
    }

    // !!! IMPORTANT: this is a dev only function should never be called in prod
    async clearSavedMessages(inbox_name: string) {
        if (__DEV__) {
            await storage.clearMapForKey(serializeInboxName(inbox_name as INBOX_NAME))
            queryClient.invalidateQueries(['getDecryptedMessageHistory', inbox_name])
        }

    }


}

const hermes = new Hermes()

export default hermes