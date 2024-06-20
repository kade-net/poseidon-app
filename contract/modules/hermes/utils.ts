import { Effect, Either } from "effect"
import { DecryptionError, EncryptionError, FetchError, InboxNotFoundError, NoPrivateKeyError, NoPublicKeyError, UnknownError } from "../../../utils/errors"
import { hermesClient } from "../../../data/apollo"
import { getInboxHistory, getPhoneBook } from "../../../lib/hermes-client/queries"
import { Envelope } from "../../../lib/hermes-client/__generated__/graphql"
import { TDM, dmSchema } from "../../../schema"
import delegateManager from "../../../lib/delegate-manager"
import storage from "../../../lib/storage"
import { isString, mean, sortBy } from "lodash"
import { queryClient } from "../../../data/query"
import nacl from "tweetnacl"
import naclUtil from "tweetnacl-util"
import { _generateSharedSecret, decryptMessageSecretBox } from "../../../utils/encryption"
import inboxes from "./inboxes"

export type INBOX_NAME = `@${string}:@${string}`

export type LOCAL_INBOX = {
    other_user: string
}

export type MESSAGE = TDM & {
    sender: string
    receiver: string
    timestamp: number
    isMine: boolean
    hid: string
    inbox_name: `@${string}:@${string}`
    ref: string,
    receiver_public_key?: string
    sender_public_key?: string
}

export function generateSharedSecret(_publicKey: string) {
    const delegatePrivateKey = delegateManager.private_key?.replace('0x', '')
    const publicKey = _publicKey?.replace('0x', '')

    if (!delegatePrivateKey) {
        throw new NoPrivateKeyError()
    }

    const secret = _generateSharedSecret(publicKey, delegatePrivateKey)

    return secret
}

interface initializeInboxArgs {
    inbox_name: INBOX_NAME,
    other_user: string
}

export function initializeInbox(args: initializeInboxArgs) {
    const { inbox_name, other_user } = args

    // 1. check if the inbox already exists, if it does short circuit
    const task = Effect.tryPromise({
        try: async () => {
            try {
                const inbox: LOCAL_INBOX = await storage.load({
                    key: 'inboxes',
                    id: serializeInboxName(inbox_name)
                })
                return inbox
            }
            catch (e) {
                console.log("Inbox not found")
                return null
            }
        },
        catch(error) {
            return new UnknownError(error)
        },
    })
        .pipe(
            Effect.flatMap((inbox) => {
                if (inbox) return Effect.succeed(inbox)
                return Effect.tryPromise({
                    try: async () => {
                        const inbox: LOCAL_INBOX = {
                            other_user
                        }
                        await storage.save({
                            key: 'inboxes',
                            id: serializeInboxName(inbox_name),
                            data: inbox
                        })

                        return inbox
                    },
                    catch(error) {
                        return new InboxNotFoundError(error)
                    },
                })

            })
        )

    return task
}

export function serializeInboxName(inbox_name: `@${string}:@${string}`) {
    if (inbox_name && isString(inbox_name)) {
        return inbox_name?.replaceAll('@', '') as `${string}:${string}`
    }
    return inbox_name
}

interface getMessageHistoryArgs {
    inbox_name: string
    other_user: string
}

export function getEncryptedMessageHistory(args: getMessageHistoryArgs) {
    const task = Effect.tryPromise({
        try: async () => {
            const previousMessages = await storage.getAllDataForKey<MESSAGE>(args.inbox_name)
            const lastMessage = previousMessages[previousMessages.length - 1]
            const last_timestamp = lastMessage?.timestamp ?? undefined
            const messagesHistoryQuery = await hermesClient.query({
                query: getInboxHistory,
                variables: {
                    inbox_name: args.inbox_name,
                    timestamp: last_timestamp
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

interface storeDecryptedMessageArgs {
    message: MESSAGE
}
export async function storeDecryptedMessage(args: storeDecryptedMessageArgs) {
    const { message } = args
    await storage.save({
        key: serializeInboxName(message.inbox_name),
        id: message.ref?.replaceAll('-', '') ?? message.hid,
        data: message
    })

}


export async function getCachedDecryptedMessage(inbox_name: INBOX_NAME, hid: string) {
    try {
        const message = await storage.load({
            key: serializeInboxName(inbox_name),
            id: hid?.replaceAll('-', '')
        })

        return message as MESSAGE

    }
    catch (e) {
        // NOTE: we will always assume it failed cause it was not found
        // TODO: we may want to handle this better
        return null
    }
}

interface encryptEnvelopeArgs {
    content: TDM
    inbox_name: INBOX_NAME
}

export function encryptEnvelopeContent(args: encryptEnvelopeArgs) {

    const encryptionTask = Effect.tryPromise({
        try: async () => {
            const inbox: LOCAL_INBOX = await storage.load({
                key: 'inboxes',
                id: serializeInboxName(args.inbox_name)
            })


            return inbox
        },
        catch(error) {
            return new InboxNotFoundError(error)
        }
    })
        .pipe(
            Effect.flatMap((inbox) => inboxes.generateBroadCast(args.content, inbox.other_user))

        )

    return encryptionTask

}

interface decryptEnvelopeArgs {
    envelope: Envelope
}

export function decryptEnvelope(args: decryptEnvelopeArgs) {
    const task = Effect.tryPromise({
        try: async () => {
            const savedMessage = await getCachedDecryptedMessage(args.envelope.inbox_name as INBOX_NAME, args?.envelope?.ref ?? args.envelope.hid)
            return savedMessage
        },
        catch(error) {
            return new DecryptionError({
                message: 'Could not retrieve the message from the cache, proceeding with this excluded'
            })
        }
    }).pipe(
        Effect.flatMap((cachedMessage) => {
            if (cachedMessage) return Effect.succeed(cachedMessage)
            return inboxes.deserializeBroadCast(args.envelope, JSON.stringify(args.envelope.content))

        }),
        Effect.tap((message) => {
            storeDecryptedMessage({ message })
        })
    )


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

interface getInboxMessagesArgs {
    inbox_name: string
    other_user: string
}

export function getInboxMessages(args: getInboxMessagesArgs) {
    const inboxInitializationTask = initializeInbox({ inbox_name: args.inbox_name as INBOX_NAME, other_user: args.other_user })
    return inboxInitializationTask.pipe(
        Effect.flatMap((inbox) => {
            return getDecryptedMessageHistory({
                messagesTask: getEncryptedMessageHistory({
                    inbox_name: args.inbox_name, other_user: args.other_user,
                })
            })
        })
    )

}

export async function retrieveMessagesFromPDS(inbox_name: INBOX_NAME) {
    const messages = await storage.getAllDataForKey<MESSAGE>(serializeInboxName(inbox_name))
    const sortedMessages = sortBy(messages, 'timestamp')
    return sortedMessages
}


export async function saveOwnMessage(message: Omit<MESSAGE, "hid" | "timestamp">) {
    await storage.save({
        key: serializeInboxName(message.inbox_name),
        id: message.ref?.replaceAll('-', ''),
        data: {
            ...message,
            timestamp: Date.now()
        }
    })

    queryClient.invalidateQueries(['getDecryptedMessageHistory', message.inbox_name])
}

export async function removeMessageFromPDS(inbox_name: string, ref: string) {
    await storage.remove({
        key: serializeInboxName(inbox_name as INBOX_NAME),
        id: ref
    })
}

export async function saveIncomingMessage(envelope: Envelope) {
    const task = decryptEnvelope({
        envelope: {
            ...envelope,
            id: envelope.hid,
        },
    })

    return Effect.runPromise(Effect.either(task))
}


const GM_SEARCH_REGEX = /(^|\s)gm(\s|$)|gmgm/gi
const LFG_SEARCH_REGEX = /(^|\s)lfg(\s|$)|lfglfg/gi
const LFM_SEARCH_REGEX = /(^|\s)lfm(\s|$)|lfmlfm/gi
const GN_SEARCH_REGEX = /(^|\s)gn(\s|$)|gngn/gi

const TEXT_MAP = {
    "GM": GM_SEARCH_REGEX,
    "LFG": LFG_SEARCH_REGEX,
    "LFM": LFM_SEARCH_REGEX,
    "GN": GN_SEARCH_REGEX,
} as const

export const getReactionType = (content: string) => {
    for (const key in TEXT_MAP) {
        const k: keyof typeof TEXT_MAP = key as any
        if (TEXT_MAP?.[k]?.test(content)) {
            return key
        }
    }
    return null

}