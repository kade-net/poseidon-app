import { Effect } from "effect"
import { DecryptionError, FetchError } from "../../../utils/errors"
import { hermesClient } from "../../../data/apollo"
import { getInboxHistory } from "../../../lib/hermes-client/queries"
import { Envelope } from "../../../lib/hermes-client/__generated__/graphql"
import { TDM } from "../../../schema"
import delegateManager from "../../../lib/delegate-manager"

export type MESSAGE = TDM & {
    sender: string
    receiver: string
    timestamp: number
    isMine: boolean
}

interface getMessageHistoryArgs {
    inbox_name: string
    other_user: string
}
export function getEncryptedMessageHistory(args: getMessageHistoryArgs) {
    const task = Effect.tryPromise({
        try: async () => {
            const messagesHistoryQuery = await hermesClient.query({
                query: getInboxHistory,
                variables: {
                    inbox_name: args.inbox_name
                }
            })

            return messagesHistoryQuery.data?.inboxHistory ?? []
        },
        catch(error) {
            return new FetchError(error)
        }
    })

    return task

}

interface decryptEnvelopeArgs {
    envelope: Envelope
}

export function decryptEnvelope(args: decryptEnvelopeArgs) {
    const task = Effect.tryPromise({
        try: async () => {
            console.log("COntent::", args.envelope.content)
            const actualContent = args.envelope.content as TDM

            // TODO: decrypt the envelope content
            return {
                content: actualContent?.content ?? "",
                media: actualContent?.media ?? [],
                timestamp: args.envelope.timestamp,
                isMine: args.envelope.sender === delegateManager.owner!,
                receiver: args.envelope.receiver,
                sender: args.envelope.sender,
            } as MESSAGE
        },
        catch(e) {
            return new DecryptionError(e)
        }
    })

    return task
}

interface getDecryptedMessageHistoryArgs {
    messagesTask: ReturnType<typeof getEncryptedMessageHistory>
}

export function getDecryptedMessageHistory(args: getDecryptedMessageHistoryArgs) {
    const task = args.messagesTask.pipe(Effect.flatMap((envelopes) => {
        return Effect.forEach(envelopes, (e) => decryptEnvelope({ envelope: e }))
    }))
    return task
}

// TODO: add effect to store them locally maybe instead of a full query we can use a last read or something for better caching


interface getInboxMessagesArgs {
    inbox_name: string
    other_user: string
}

export function getInboxMessages(args: getInboxMessagesArgs) {
    const messagesTask = getEncryptedMessageHistory({ inbox_name: args.inbox_name, other_user: args.other_user })
    return getDecryptedMessageHistory({ messagesTask })
}