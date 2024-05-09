import { Effect, Either } from "effect"
import { DecryptionError, DelegateFetchError, InboxNotFoundError, MessageNotFoundError, UnableToEncryptMessage, UnableToGenerateSharedSecret, UnableToSerializeBroadCast, UnableToStoreDelegate, UnableToStoreInboxHeaders, UnknownError } from "../../../utils/errors"
import { hermesClient } from "../../../data/apollo"
import { getDelegate, getInbox, getPhoneBook } from "../../../lib/hermes-client/queries"
import delegateManager from "../../../lib/delegate-manager"
import { _generateSharedSecret, decryptMessageSecretBox, encryptMessageSecretBox } from "../../../utils/encryption"
import storage from "../../../lib/storage"
import { Envelope, GetInboxQuery } from "../../../lib/hermes-client/__generated__/graphql"
import { MESSAGE, serializeInboxName } from "./utils"
import { TDM } from "../../../schema"
import { broadcast } from "effect/Stream"

interface InboxHeaders {
    current: string
    to: string
    current_public_key: string
    to_public_key: string
    current_shared_secret: string | null
    to_shared_secret: string
    id: string
}

interface Delegate {
    is_mine: boolean
    address: string
    public_key: string
    shared_secret: string | null
}

interface Inbox {
    header: InboxHeaders
    delegates: Array<Delegate>

}

interface BroadCast {
    _tag: 'BroadCast',
    version: "2024-05-08",
    recipients: Record<string, string>,
}

class Inboxes {

    activeInbox: Inbox | null = null

    constructor() {

    }

    private loadInboxTask(other_user: string) {
        const task = Effect.tryPromise({
            try: async () => {
                const inboxQuery = await hermesClient.query({
                    query: getInbox,
                    variables: {
                        address: other_user,
                        viewer: delegateManager.owner!
                    }
                })

                const inbox = inboxQuery.data?.inbox

                if (!inbox) {
                    throw new InboxNotFoundError()
                }

                const otherPhoneBook = await hermesClient.query({
                    query: getPhoneBook,
                    variables: {
                        address: other_user
                    }
                })

                if (!otherPhoneBook.data?.phoneBook) {

                    throw new InboxNotFoundError()
                }

                return {
                    inbox,
                    other: otherPhoneBook.data?.phoneBook
                }
            },
            catch(error) {
                console.log("Error::", error)
                return new InboxNotFoundError(error)
            },
        })
            .pipe(
                Effect.flatMap(({ inbox, other }) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const userDelegatesQuery = await hermesClient.query({
                                query: getDelegate,
                                variables: {
                                    address: delegateManager.owner!
                                }
                            })

                            const currentUserDelegates = userDelegatesQuery.data?.delegates ?? []

                            const otherDelegatesQuery = await hermesClient.query({
                                query: getDelegate,
                                variables: {
                                    address: other_user
                                }
                            })

                            const otherUserDelegates = otherDelegatesQuery.data?.delegates ?? []

                            const delegates: Array<Delegate> = [...currentUserDelegates, ...otherUserDelegates]?.map((oldDelegate) => {

                                const delegate = {
                                    is_mine: oldDelegate.address === delegateManager.owner,
                                    address: oldDelegate.address,
                                    public_key: oldDelegate.public_key!, // assumption is that public key is present at this point
                                    shared_secret: null
                                }

                                return delegate

                            })

                            const currentDelegate = delegates.find((delegate) => delegate.address === delegateManager.account?.address()?.toString())

                            if (!currentDelegate && !delegateManager.isDelegateOwner) {
                                throw new InboxNotFoundError()
                            }

                            return {
                                delegates: delegates.filter((delegate) => delegate.address !== currentDelegate?.address),
                                other,
                                inbox,
                                active_delegate: currentDelegate,

                            }
                        },
                        catch(e) {
                            return new DelegateFetchError(e)
                        }
                    })
                }),
                Effect.flatMap((args) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const { delegates, inbox, other, active_delegate } = args

                            const otherSharedSecret = _generateSharedSecret(other.public_key!, delegateManager.private_key!)

                            return {
                                delegates,
                                inbox,
                                otherSharedSecret,
                                other,
                                active_delegate
                            }

                        },
                        catch(error) {
                            return new UnableToGenerateSharedSecret(error)
                        },
                    })
                }),
                Effect.flatMap((args) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const { delegates, inbox, other, otherSharedSecret, active_delegate } = args

                            const delegatesWithSharedSecret = delegates.map((delegate) => {
                                const sharedSecret = _generateSharedSecret(delegate.public_key, delegateManager.private_key!)
                                return {
                                    ...delegate,
                                    shared_secret: sharedSecret
                                }
                            })

                            return {
                                delegates: delegatesWithSharedSecret,
                                inbox,
                                other,
                                otherSharedSecret,
                                active_delegate
                            }
                        },
                        catch(error) {
                            return new UnableToGenerateSharedSecret(error)
                        },
                    })
                }),
                Effect.flatMap((args) => {
                    return Effect.tryPromise({
                        try: async () => {

                            const phoneBook = hermesClient.readQuery({
                                query: getPhoneBook,
                                variables: {
                                    address: delegateManager.owner!
                                }
                            })

                            if (!phoneBook?.phoneBook) {
                                throw new InboxNotFoundError()
                            }

                            if (delegateManager.isDelegateOwner) {
                                return {
                                    ...args,
                                    ownerSharedSecret: null,
                                    phoneBook: phoneBook.phoneBook
                                }
                            }
                            else {

                                const ownerSharedSecret = _generateSharedSecret(phoneBook.phoneBook.public_key, delegateManager.private_key!)

                                return {
                                    ...args,
                                    ownerSharedSecret,
                                    phoneBook: phoneBook.phoneBook
                                }
                            }
                        },
                        catch(error) {
                            return new UnableToGenerateSharedSecret(error)
                        },
                    })
                }),
                Effect.flatMap((args) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const headers: InboxHeaders = {
                                current: delegateManager.owner!,
                                to: args.other.address,
                                current_public_key: args.phoneBook.public_key,
                                current_shared_secret: args.ownerSharedSecret,
                                to_public_key: args.other.public_key,
                                to_shared_secret: args.otherSharedSecret,
                                id: args.inbox.id
                            }

                            return {
                                header: headers,
                                delegates: args.delegates,
                                active_delegate: args.active_delegate,
                                inbox: args.inbox
                            }
                        },
                        catch(error) {
                            return new UnknownError(error)
                        },
                    })

                })
            )

        return task
    }

    private persistInboxTask(inbox: Inbox & { inbox: GetInboxQuery['inbox'] }) {

        const inbox_name = `${inbox.header.current}:${inbox.header.to}`

        const task = Effect.tryPromise({
            try: async () => {
                await storage.save({
                    key: `headers:${inbox_name}`,
                    data: inbox.header
                })
            },
            catch(error) {
                return new UnableToStoreInboxHeaders(error)
            },
        })
            .pipe(
                Effect.flatMap(() => {
                    return Effect.tryPromise({
                        try: async () => {
                            for (const delegate of inbox.delegates) {
                                await storage.save({
                                    key: `delegates:${inbox_name}`,
                                    id: delegate.address,
                                    data: delegate
                                })
                            }
                        },
                        catch(error) {
                            return new UnableToStoreDelegate(error)
                        },
                    })
                })
            )

        return task
    }

    async loadInbox(other_user: string) {

        await this.cleanInbox(other_user)
        let existingHeaders: InboxHeaders | null = null
        let delegates = new Array<Delegate>()
        try {
            existingHeaders = await storage.load<InboxHeaders>({
                key: `headers:${delegateManager.owner}:${other_user}`
            })
        }
        catch (e) {
            // ignore 
        }

        // TODO: change this to run periodically just in case the user adds new delegates
        if (!existingHeaders) {
            const eitherResult = await Effect.runPromise(Effect.either(this.loadInboxTask(other_user)))

            if (Either.isEither(eitherResult)) {
                if (Either.isLeft(eitherResult)) {
                    console.log("Unable to load Inbox", eitherResult.left)
                    throw eitherResult.left
                } else {
                    const persistEitherResult = await Effect.runPromise(Effect.either(this.persistInboxTask(eitherResult.right)))
                    if (Either.isLeft(persistEitherResult)) {
                        console.log("Unable to persist Inbox", persistEitherResult.left)
                        throw persistEitherResult.left
                    }

                    existingHeaders = eitherResult.right.header
                    delegates = eitherResult.right.delegates
                }
            }
        }

        if (!existingHeaders) {
            throw new InboxNotFoundError()
        }

        this.activeInbox = {
            header: existingHeaders,
            delegates
        }


    }

    generateBroadCast(originalMessage: TDM, recipient: string) {

        const task = Effect.tryPromise({
            try: async () => {
                if (!this.activeInbox) {
                    await this.loadInbox(recipient)
                }

                if (!this.activeInbox) {
                    throw new InboxNotFoundError()
                }

                return this.activeInbox
            },
            catch(error) {
                return new InboxNotFoundError(error)
            },
        })
            .pipe(
                Effect.flatMap((inbox) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const messageString = JSON.stringify(originalMessage)
                            const encryptedMessages: Array<[string, string]> = []

                            for (const delegate of (inbox?.delegates ?? [])) {
                                const encryptedMessage = encryptMessageSecretBox(messageString, delegate.shared_secret!)
                                encryptedMessages.push([delegate.address, encryptedMessage])
                            }

                            if (inbox?.header.current !== delegateManager.account?.address()?.toString()) {
                                const encryptedMessage = encryptMessageSecretBox(messageString, inbox?.header.current_shared_secret!)
                                encryptedMessages.push([delegateManager.owner!, encryptedMessage])
                            }

                            const endUserMessage = encryptMessageSecretBox(messageString, inbox?.header.to_shared_secret!)

                            encryptedMessages.push([inbox?.header.to, endUserMessage])

                            const recipients = Object.fromEntries(encryptedMessages)

                            const broadcast: BroadCast = {
                                _tag: "BroadCast",
                                recipients,
                                version: "2024-05-08"
                            }

                            return broadcast

                        },
                        catch(error) {
                            return new UnableToEncryptMessage(error)
                        },
                    })
                }),
                Effect.flatMap((broadcast) => {
                    return Effect.try({
                        try() {
                            const stringified = JSON.stringify(broadcast)
                            return stringified
                        },
                        catch(error) {
                            return new UnableToSerializeBroadCast(error)
                        },
                    })
                })
            )

        return task

    }

    deserializeBroadCast(envelope: Envelope, broadcast: string) {
        const baseBroadCast = JSON.parse(broadcast) as BroadCast
        const my_address = delegateManager.account?.address()?.toString()!

        const task = Effect.tryPromise({
            try: async () => {
                const myMessage: string | null = baseBroadCast.recipients[my_address] ?? null
                if (!myMessage) {
                    console.log("No message for me")
                    return null
                }
                return myMessage
            },
            catch(e) {
                return new MessageNotFoundError(e)
            }
        })
            .pipe(
                Effect.flatMap((message) => {
                    return Effect.tryPromise({
                        try: async () => {
                            if (!this.activeInbox) {
                                await this.loadInbox(
                                    envelope.sender == delegateManager.owner ? envelope.receiver : envelope.sender
                                )
                            }

                            if (!this.activeInbox) {
                                throw new InboxNotFoundError()
                            }

                            // Maybe I sent the message, so instead grab the one meant for the recipient, as that's the one I can decrypt
                            const finalMessage = message ? message : baseBroadCast.recipients[this.activeInbox.header.to]

                            return {
                                message: finalMessage,
                                inbox: this.activeInbox
                            }
                        },
                        catch(error) {
                            return new InboxNotFoundError(error)
                        },
                    })
                }),
                Effect.flatMap(({ inbox, message }) => {
                    return Effect.tryPromise({
                        try: async () => {
                            const delegate = inbox?.delegates?.find((delegate) => delegate.public_key == envelope.delegate_public_key)
                            const shared_secret = delegate?.shared_secret ?? inbox?.header.to_shared_secret

                            const decryptedMessage = decryptMessageSecretBox(message, shared_secret!)

                            const tdm = JSON.parse(decryptedMessage) as TDM

                            return tdm
                        },
                        catch(error) {
                            return new DecryptionError(error)
                        },
                    })
                }),
                Effect.flatMap((tdm) => {
                    return Effect.tryPromise({
                        try: async () => {

                            const message: MESSAGE = {
                                content: tdm.content,
                                hid: envelope.hid,
                                inbox_name: envelope.inbox_name as any,
                                isMine: delegateManager.owner == envelope.sender,
                                media: tdm.media,
                                receiver: envelope.receiver,
                                ref: envelope.ref,
                                sender: envelope.sender,
                                timestamp: envelope.timestamp,
                                receiver_public_key: envelope.reciever_public_key,
                                sender_public_key: envelope.sender_public_key

                            }

                            return message
                        },
                        catch(error) {
                            return new UnknownError(error)
                        },
                    })
                })
            )


        return task


    }


    async cleanInbox(other_user: string) {
        await storage.remove({
            key: `headers:${delegateManager.owner}:${other_user}`
        })

        await storage.remove({
            key: `delegates:${delegateManager.owner}:${other_user}`
        })

        this.activeInbox = null

    }

}

const inboxes = new Inboxes()

export default inboxes