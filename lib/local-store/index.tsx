import '../../global'
import { Publication } from "../../__generated__/graphql";
import storage from "../storage";



class LocalStore {

    async getPublications() {
        const stored = await storage.getAllDataForKey("publications")
        if (stored) {
            return stored
        } else {
            return []
        }
    }

    async addPublication(publication: Publication) {
        const publications = await this.getPublications()
        await storage.save({
            key: "publications",
            id: publications.length.toString(),
            data: publication
        })
    }

    async addLikedPublications(publication_id: number, reaction_count: number) {
        await storage.save({
            key: 'likedPublications',
            id: publication_id.toString(),
            data: {
                publication_id,
                reaction_count
            }
        })
    }

    async removeLikedPublications(publication_id: number) {
        await storage.remove({
            key: 'likedPublications',
            id: publication_id.toString()
        })

    }

    async isPublicationLiked(publication_id: number) {
        try {
            const publication = await storage.load({
                key: 'likedPublications',
                id: publication_id.toString()
            })

            return publication as {
                publication_id: number,
                reaction_count: number
            }

        }
        catch (e) {
            return null
        }

    }

    async addRepostedPublications(publication_id: number, repost_count: number) {
        await storage.save({
            key: "repostedPublications",
            id: publication_id.toString(),
            data: {
                publication_id,
                repost_count
            }
        })
    }

    async removeRepostedPublications(publication_id: number) {
        await storage.remove({
            key: "repostedPublications",
            id: publication_id.toString()
        })
    }

    async isPublicationReposted(publication_id: number) {
        try {
            const publication = await storage.load({
                key: "repostedPublications",
                id: publication_id.toString()
            })

            return publication as {
                publication_id: number,
                repost_count: number
            }

        }
        catch (e) {
            return null
        }

    }

    async addQuotedPublications(publication_id: number) {
        await storage.save({
            key: "quotedPublications",
            id: publication_id.toString(),
            data: {
                publication_id
            }
        })
    }

    async removeQuotedPublications(publication_id: number) {
        await storage.remove({
            key: "quotedPublications",
            id: publication_id.toString()
        })
    }

    async isPublicationQuoted(publication_id: number) {
        try {
            const publication = await storage.load({
                key: "quotedPublications",
                id: publication_id.toString()
            })

            if (publication) {
                return true
            }

            return false

        }
        catch (e) {
            return false
        }
    }

    async addCommentedPublications(publication_id: number) {
        await storage.save({
            key: "commentedPublications",
            id: publication_id.toString(),
            data: {
                publication_id
            }
        })
    }

    async removeCommentedPublications(publication_id: number) {
        await storage.remove({
            key: "commentedPublications",
            id: publication_id.toString()
        })
    }

    async isPublicationCommented(publication_id: number) {
        try {
            const publication = await storage.load({
                key: "commentedPublications",
                id: publication_id.toString()
            })

            if (publication) {
                return true
            }

            return false

        }
        catch (e) {
            return false
        }

    }


    constructor() {


    }



    // !!! IMPORTANT !!! - this is for dev purpouses only and should never be used in production
    async nuke() {

    }
}

export default new LocalStore()