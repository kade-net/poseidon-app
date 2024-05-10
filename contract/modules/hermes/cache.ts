import { add, isEmpty, isNull, remove } from "lodash";
import { hermesClient } from "../../../data/apollo";
import delegateManager from "../../../lib/delegate-manager";
import { getInboxes, getPhoneBook } from "../../../lib/hermes-client/queries";
import { GetInboxesQuery, Inbox, InboxType } from "../../../lib/hermes-client/__generated__/graphql";
import ephemeralCache from "../../../lib/local-store/ephemeral-cache";
import { queryClient } from "../../../data/query";
import { Effect, Either } from "effect";
import { UnknownError } from "../../../utils/errors";
import { MESSAGE } from "./utils";
import hermes from ".";


export async function enableDirectMessagingCacheUpdate() {
    // create a phonebook
    const phoneBookQuery = hermesClient.readQuery({
        query: getPhoneBook,
        variables: {
            address: delegateManager.owner!
        }
    })

    if (isNull(phoneBookQuery?.phoneBook)) {
        const timestamp = Date.now()
        hermesClient.writeQuery({
            query: getPhoneBook,
            variables: {
                address: delegateManager.owner!
            },
            data: {
                phoneBook: {
                    __typename: "PhoneBook",
                    address: delegateManager.owner!,
                    hid: timestamp.toString(),
                    public_key: delegateManager.account?.pubKey().toString() ?? '',
                    timestamp: timestamp,
                }
            }
        })
    }
}


export async function disableDirectMessagingCacheUpdate() {
    hermesClient.writeQuery({
        query: getPhoneBook,
        variables: {
            address: delegateManager.owner!
        },
        data: {
            phoneBook: null
        }
    })
}

interface acceptMessageRequestUpdateCacheArgs {
    address: string
}
export function acceptMessageRequestUpdateCache(args: acceptMessageRequestUpdateCacheArgs) {
    const { address } = args

    const incomingRequestsQuery = hermesClient.readQuery({
        query: getInboxes,
        variables: {
            address: delegateManager.owner!,
            active: false,
            type: InboxType.Received
        }
    })

    const updatedInbox = incomingRequestsQuery?.inboxes?.find((inbox) => inbox?.initiator_address == address)

    if (updatedInbox) {
        updatedInbox.active = true

        hermesClient.writeQuery({
            query: getInboxes,
            variables: {
                address: delegateManager.owner!,
                active: false,
                type: InboxType.Received
            },
            data: {
                ...incomingRequestsQuery,
                inboxes: (incomingRequestsQuery?.inboxes ?? [])?.filter((inbox) => inbox?.initiator_address == address)
            }
        })

        const activeInboxesQuery = hermesClient.readQuery({
            query: getInboxes,
            variables: {
                address: delegateManager.owner!,
                active: true
            }

        })

        if (updatedInbox?.id) {
            ephemeralCache.set(updatedInbox?.id, true)
        }

        hermesClient.writeQuery({
            query: getInboxes,
            variables: {
                address: delegateManager.owner!,
                active: true
            },
            data: {
                ...activeInboxesQuery,
                inboxes: [
                    ...(activeInboxesQuery?.inboxes ?? []),
                    {
                        ...updatedInbox,
                        active: true
                    }
                ]
            }
        })
    }
}


interface removeAcceptedMessageRequestUpdateCacheArgs {
    address: string
}

export function removeAcceptedMessageRequestUpdateCache(args: removeAcceptedMessageRequestUpdateCacheArgs) {
    const { address } = args

    const activeInboxesQuery = hermesClient.readQuery({
        query: getInboxes,
        variables: {
            address: delegateManager.owner!,
            active: true
        }
    })

    const updatedInbox = activeInboxesQuery?.inboxes?.find((inbox) => inbox?.initiator_address == address)

    if (updatedInbox) {
        updatedInbox.active = false

        hermesClient.writeQuery({
            query: getInboxes,
            variables: {
                address: delegateManager.owner!,
                active: true
            },
            data: {
                ...activeInboxesQuery,
                inboxes: (activeInboxesQuery?.inboxes ?? [])?.filter((inbox) => inbox?.initiator_address == address)
            }
        })

        const incomingRequestsQuery = hermesClient.readQuery({
            query: getInboxes,
            variables: {
                address: delegateManager.owner!,
                active: false,
                type: InboxType.Received
            }
        })

        if (updatedInbox) {
            ephemeralCache.set(updatedInbox?.id, false)
        }

        hermesClient.writeQuery({
            query: getInboxes,
            variables: {
                address: delegateManager.owner!,
                active: false,
                type: InboxType.Received
            },
            data: {
                ...incomingRequestsQuery,
                inboxes: [
                    ...(incomingRequestsQuery?.inboxes ?? []),
                    updatedInbox
                ]
            }
        })
    }
}


interface addConversationRequestToPendingArgs {
    address: string
}
export function addConversationRequestToPending(args: addConversationRequestToPendingArgs) {
    const timestamp = Date.now()
    const prevQuery = hermesClient.readQuery({
        query: getInboxes,
        variables: {
            address: delegateManager.owner!,
            active: false,
            type: InboxType.Sent
        }
    })

    const newObject: Inbox = {
        active: false,
        hid: timestamp.toString(),
        id: timestamp.toString(),
        initiator_address: delegateManager.owner!,
        owner_address: args.address,
        __typename: "Inbox",
        timestamp: timestamp,
    }

    hermesClient.writeQuery({
        query: getInboxes,
        variables: {
            address: delegateManager.owner!,
            active: false,
            type: InboxType.Sent
        },
        data: {
            ...prevQuery,
            inboxes: [
                ...(prevQuery?.inboxes ?? []),
                newObject
            ]
        }
    })
}


export async function removeConversationRequestFromPending(args: addConversationRequestToPendingArgs) {
    const prevQuery = hermesClient.readQuery({
        query: getInboxes,
        variables: {
            address: delegateManager.owner!,
            active: false,
            type: InboxType.Sent
        }
    })

    hermesClient.writeQuery({
        query: getInboxes,
        variables: {
            address: delegateManager.owner!,
            active: false,
            type: InboxType.Sent
        },
        data: {
            ...prevQuery,
            inboxes: (prevQuery?.inboxes ?? []).filter((inbox) => inbox?.owner_address == args.address)
        }
    })
}