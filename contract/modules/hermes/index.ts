import { Effect, Either } from 'effect'
import delegateManager from '../../../lib/delegate-manager'
import { NoOwner, UnknownError } from '../../../utils/errors'
import { constructConvergenceTransaction, settleConvergenceTransaction } from '../../../utils/transactions'
import config from '../../../config'
import { AcceptRequestArgs, RegisterRequestInboxInputArgs, RequestConversationArgs, SendArgs } from '../../../lib/convergence-client/__generated__/graphql'
import { FunctionResponse } from '../../../utils/functions'
import { TDM } from '../../../schema'
import { INBOX_NAME, MESSAGE, encryptEnvelopeContent, getInboxMessages, retrieveMessagesFromPDS, saveIncomingMessage, saveOwnMessage, serializeInboxName } from './utils'
import { queryClient } from '../../../data/query'
import storage from '../../../lib/storage'
import { acceptMessageRequestUpdateCache, addConversationRequestToPending, disableDirectMessagingCacheUpdate, enableDirectMessagingCacheUpdate, removeAcceptedMessageRequestUpdateCache, removeConversationRequestFromPending } from './cache'
import posti from '../../../lib/posti'
import client, { hermesClient } from '../../../data/apollo'
import { getPhoneBook } from '../../../lib/hermes-client/queries'
import { isEmpty } from 'lodash'
import { GET_MY_PROFILE } from '../../../utils/queries'

class Hermes {

    async registerInbox(): Promise<FunctionResponse> {

        if (!delegateManager || !delegateManager.owner) {
            return {
                success: false,
                error: new NoOwner(),
                data: null
            }
        }

        enableDirectMessagingCacheUpdate()

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
                disableDirectMessagingCacheUpdate()
                posti.capture('hermes:registerInbox::', {
                    error: error
                })
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

        const using_owner = delegateManager.isDelegateOwner

        addConversationRequestToPending({
            address: user_address
        })

        const task = constructConvergenceTransaction({
            fee_payer_address: config.HERMES_MODULE_ADDRESS,
            name: using_owner ? 'requestConversation' : 'delegateRequestConversation',
            variables: {
                envelope: "",
                sender_address: using_owner ? delegateManager.owner! : delegateManager.account?.address().toString()!,
                user_address: user_address
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
                removeConversationRequestFromPending({
                    address: user_address
                })

                posti.capture('hermes:requestConversation::', {
                    error: error
                })
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

        const using_owner = delegateManager.isDelegateOwner


        acceptMessageRequestUpdateCache({
            address: requester_address
        })

        const task = constructConvergenceTransaction({
            fee_payer_address: config.HERMES_MODULE_ADDRESS,
            name: using_owner ? 'acceptRequest' : 'delegateAcceptRequest',
            variables: {
                requester_address: requester_address,
                sender_address: using_owner ? delegateManager.owner! : delegateManager.account?.address().toString()!,
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
                console.log("Error::", error)
                removeAcceptedMessageRequestUpdateCache({
                    address: requester_address
                })
                response.error = error
                posti.capture('hermes:acceptRequest::', {
                    error: error
                })
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
        const using_owner = delegateManager.isDelegateOwner

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
                        sender_address: using_owner ? delegateManager.owner! : delegateManager.account?.address().toString()!,
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
                posti.capture('hermes:send::', {
                    error: error
                })
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
                posti.capture('getInboxHistory', {
                    error: result.left
                })
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

    async getPDSData(inbox_name: string, other_user: string, retry?: boolean): Promise<Array<MESSAGE>> {

        const result = await retrieveMessagesFromPDS(inbox_name as INBOX_NAME)

        if (retry) {
            return result
        }
        if (isEmpty(result)) {
            await this.getInboxHistory(inbox_name, other_user)
            return this.getPDSData(inbox_name, other_user, true)
        }
        return result

    }

    // NOTE: we'll make the assumption its a valid envelope for now
    async saveIncomingMessage(envelope: any) {
        const result = await saveIncomingMessage(envelope)

        if (Either.isEither(result)) {
            if (Either.isLeft(result)) {
                console.log("Error::", result.left)
                posti.capture('saveIncomingMessage', {
                    error: result.left
                })
                // silent fail
            }

            if (Either.isRight(result)) {
                queryClient.invalidateQueries(['getDecryptedMessageHistory', result.right.inbox_name])
                return result.right
                // silent success
            }
        }
    }

    async getLastMessage(inbox_name: string, other_user: string) {

        const task = Effect.tryPromise({
            try: async () => {
                const messages: Array<MESSAGE> = queryClient.getQueryData(['getDecryptedMessageHistory', inbox_name]) ?? []
                return messages
            },
            catch(error) {
                return new UnknownError(error)
            },
        }).pipe(
            Effect.flatMap((messages) => {
                if (!isEmpty(messages)) {
                    const message = messages[messages.length - 1]
                    if (message) return Effect.succeed(message)
                }
                return Effect.tryPromise({
                    try: async () => {
                        const messages = await hermes.getPDSData(inbox_name, other_user)
                        return messages?.at(-1) ?? null
                    },
                    catch(error) {
                        return new UnknownError(error)
                    },
                })
            })
        )

        const eitherResult = await Effect.runPromise(Effect.either(task))

        if (Either.isLeft(eitherResult)) return null
        return eitherResult.right
    }

    // !!! IMPORTANT: this is a dev only function should never be called in prod
    async clearSavedMessages(inbox_name: string) {
        if (__DEV__) {
            await storage.clearMapForKey(serializeInboxName(inbox_name as INBOX_NAME))
            queryClient.invalidateQueries(['getDecryptedMessageHistory', inbox_name])
        }

    }


    // !!! IMPORTANT: this should only run for the testers at should probably be removed in prod
    async checkHasInboxIfNotRegister() {
        // assumption - is self delegate

        if (!delegateManager.owner) {
            return
        }
        try {
            const profile = await client.query({
                query: GET_MY_PROFILE,
                variables: {
                    address: delegateManager.owner!
                }
            })

            if (profile.data.account?.profile) {
                const phonebook = await hermesClient.query({
                    query: getPhoneBook,
                    variables: {
                        address: delegateManager.owner!
                    }
                })

                if (!phonebook.data.phoneBook) {
                    await this.registerInbox()
                }
                else {
                    console.log("phonebook already exists")
                }

            }
        }
        catch (e) {
            console.log("Error::", e)
            posti.capture('checkHasInboxIfNotRegister', {
                error: e
            })
        }
    }


}

const hermes = new Hermes()

export default hermes