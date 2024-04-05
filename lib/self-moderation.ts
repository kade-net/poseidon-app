import { isString } from "lodash"
import client from "../data/apollo"
import { GET_PUBLICATIONS } from "../utils/queries"
import storage from "./storage"
import posti from "./posti"
import delegateManager from "./delegate-manager"


class SelfModeration {

    mutedUsers: number[] = []

    hiddenPublications: Array<string> = []

    async muteUser(id: number, address: string) {

        storage.save({
            key: 'muted',
            id: id.toString(),
            data: {
                muted: true,
                userAddress: address,
                id: id,
                at: Date.now()
            }
        })

        this.mutedUsers.push(id)

        client.refetchQueries({
            include: [GET_PUBLICATIONS]
        })

        posti.capture('user-muted', {
            user: delegateManager.owner,
            mutedUser: address,
            mutedUserKid: id
        })
    }

    async unMuteUser(id: number) {
        storage.remove({
            key: 'muted',
            id: id.toString()
        })

        this.mutedUsers = this.mutedUsers.filter((muted) => muted !== id)
    }


    async loadMutedUsers() {
        try {
            const muted = await storage.getAllDataForKey('muted')
            this.mutedUsers = muted.map((muted) => muted.id)

        }
        catch (e) {
            this.mutedUsers = []
        }
    }


    async removeFromFeed(publication_ref: string) {
        if (!isString(publication_ref)) {
            throw new Error("Invalid publication id")
        }

        let ref = publication_ref?.includes("_") ? publication_ref.split("_")[1] : publication_ref

        // client.refetchQueries({
        //     include: [GET_PUBLICATIONS]
        // })

        posti.capture('remove-post-from-feed', {
            publication_ref
        })

        await storage.save({
            key: 'removedFromFeed',
            id: ref,
            data: {
                removed: true,
                publication_ref
            }
        })

        this.hiddenPublications.push(publication_ref)
    }

    async isRemovedFromFeed(publication_ref: string) {
        try {
            const ref = publication_ref?.includes("_") ? publication_ref.split("_")[1] : publication_ref
            const pub = await storage.load({
                key: 'removedFromFeed',
                id: ref
            })
            return pub.removed
        }
        catch (e) {
            return false
        }
    }

    async getRemovedFromFeed() {
        try {
            const pubs = await storage.getAllDataForKey<{ removed: boolean, }>('removedFromFeed')
            return pubs
        }
        catch (e) {
            return []
        }
    }

    async loadRemovedFromFeed() {
        try {
            const pubs = await storage.getAllDataForKey<{ removed: boolean, publication_ref: string }>('removedFromFeed')
            this.hiddenPublications = pubs.map((pub) => pub.publication_ref)
        }
        catch (e) {
            this.hiddenPublications = []
        }
    }
}

const selfModeration = new SelfModeration()

export default selfModeration