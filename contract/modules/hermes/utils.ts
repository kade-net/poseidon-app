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

export type INBOX_NAME = `@${string}:@${string}`

export type LOCAL_INBOX = {
    shared_secret: string
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
                return Effect.tryPromise({
                    try: async () => {
                        if (inbox) return inbox
                        // 2. check if there are any messages saved to that inbox, if there are get the public key of the other user
                        let messages: MESSAGE[] = []
                        try {
                            messages = await storage.getAllDataForKey<MESSAGE>(serializeInboxName(inbox_name))
                        }
                        catch (e) {
                            console.log("No messages found in the inbox")
                        }

                        let public_key: string | null = null
                        if (messages.length > 0) {
                            const firstMessage = messages.at(0)
                            public_key = (firstMessage?.sender == other_user ? firstMessage?.sender_public_key : firstMessage?.receiver_public_key) ?? null
                        }

                        if (!public_key) {
                            // 3. if there are no messages saved, query the public key of the other user

                            const phoneBookQuery = await hermesClient.query({
                                query: getPhoneBook,
                                variables: {
                                    address: other_user
                                }
                            })

                            if (phoneBookQuery.data?.phoneBook?.public_key) {
                                public_key = phoneBookQuery.data.phoneBook.public_key
                            }

                        }

                        if (!public_key) {
                            throw new NoPublicKeyError()
                        }

                        return public_key?.replaceAll('0x', '') as string
                    },
                    catch(error) {
                        return new UnknownError(error)
                    },
                })
            }),
            Effect.flatMap((public_key_or_inbox) => {
                return Effect.tryPromise({
                    try: async () => {
                        if (isString(public_key_or_inbox)) {
                            const shared_secret = generateSharedSecret(public_key_or_inbox)
                            const inbox: LOCAL_INBOX = {
                                shared_secret,
                                other_user
                            }
                            await storage.save({
                                key: 'inboxes',
                                id: serializeInboxName(inbox_name),
                                data: inbox
                            })

                            return inbox
                        }

                        return public_key_or_inbox
                    },
                    catch(error) {
                        return new UnknownError(error)
                    }
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
            Effect.flatMap((inbox) => {
                return Effect.tryPromise({
                    try: async () => {
                        const parsed = dmSchema.safeParse(args.content)

                        if (!parsed.success) {
                            throw parsed.error
                        }

                        const stringified = JSON.stringify(parsed.data)

                        const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
                        const messageUint8 = naclUtil.decodeUTF8(stringified);
                        const box = nacl.secretbox(messageUint8, nonce, Buffer.from(inbox.shared_secret, 'hex'));

                        const fullMessage = new Uint8Array(nonce.length + box.length);
                        fullMessage.set(nonce);
                        fullMessage.set(box, nonce.length);

                        const message = naclUtil.encodeBase64(fullMessage);

                        return message

                    },
                    catch(error) {
                        return new EncryptionError(error)
                    },
                })
            })
        )

    return encryptionTask

}

interface decryptEnvelopeArgs {
    envelope: Envelope
    shared_secret?: string
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
            return Effect.tryPromise({
                try: async () => {
                    if (cachedMessage) return cachedMessage
                    // not sure about this mismatch
                    const encryptedContent = args.envelope.content?.content ?? args.envelope.content
                    if (!isString(encryptedContent)) {

                        console.log("Invalid encrypted content", encryptedContent)
                        return null
                    }

                    try {


                        const decryptedContent = decryptMessageSecretBox(encryptedContent, args.shared_secret!)

                        const actualContent = JSON.parse(decryptedContent) as TDM

                        const message = {
                            content: actualContent?.content ?? '',
                            media: actualContent?.media ?? [],
                            timestamp: args.envelope.timestamp,
                            isMine: args.envelope.sender === delegateManager.owner!,
                            receiver: args.envelope.receiver,
                            sender: args.envelope.sender,
                            hid: args.envelope.hid,
                            inbox_name: args.envelope.inbox_name,
                            ref: args.envelope.ref,
                            // @ts-expect-error - Bad spelling :) 
                            receiver_public_key: args.envelope.receiver_public_key ?? args.envelope.reciever_public_key,
                            sender_public_key: args.envelope.sender_public_key
                        } as MESSAGE

                        await storeDecryptedMessage({ message })

                        return message
                    }
                    catch (e) {
                        console.log("Decryption error::", e)
                        return null
                    }

                },
                catch(error) {
                    console.log("Decryption error::", error)
                    // ignore ddecryption error
                }
            })
        }),
        Effect.flatMap((cachedMessage) => {
            return Effect.tryPromise({
                try: async () => {
                    if (cachedMessage) return cachedMessage
                    // go ahead and decrypt the message then store it

                    const actualContent = args.envelope.content as TDM

                    // TODO: decrypt the envelope content
                    const message = {
                        content: actualContent?.content ?? '',
                        media: actualContent?.media ?? [],
                        timestamp: args.envelope.timestamp,
                        isMine: args.envelope.sender === delegateManager.owner!,
                        receiver: args.envelope.receiver,
                        sender: args.envelope.sender,
                        hid: args.envelope.hid,
                        inbox_name: args.envelope.inbox_name,
                        ref: args.envelope.ref,
                        // @ts-expect-error - Bad spelling :) 
                        receiver_public_key: args.envelope.receiver_public_key ?? args.envelope.reciever_public_key,
                        sender_public_key: args.envelope.sender_public_key
                    } as MESSAGE

                    await storeDecryptedMessage({ message })

                    return message
                },
                catch(e) {
                    return new DecryptionError(e)
                }
            })
        })
    )


    return task
}

interface getDecryptedMessageHistoryArgs {
    messagesTask: ReturnType<typeof getEncryptedMessageHistory>
    shared_secret: string
}

export function getDecryptedMessageHistory(args: getDecryptedMessageHistoryArgs) {
    const task = args.messagesTask.pipe(Effect.flatMap((envelopes) => {
        return Effect.forEach(envelopes, (e) => decryptEnvelope({ envelope: e, shared_secret: args.shared_secret }))
    }))
    return task
}

// TODO: add effect to store them locally maybe instead of a full query we can use a last read or something for better caching


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
                }),
                shared_secret: inbox.shared_secret
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
    const inbox = await storage.load({
        key: 'inboxes',
        id: serializeInboxName(envelope.inbox_name as INBOX_NAME)
    })
    const task = decryptEnvelope({
        envelope: {
            ...envelope,
            id: envelope.hid,
        },
        shared_secret: inbox?.shared_secret
    })

    return Effect.runPromise(Effect.either(task))
}