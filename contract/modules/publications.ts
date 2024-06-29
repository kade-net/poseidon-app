import { z } from "zod";
import { TPUBLICATION, publicationSchema } from "../../schema";
import axios from "axios";
import { APP_SUPPORT_API, KADE_ACCOUNT_ADDRESS, aptos } from "..";
import delegateManager from "../../lib/delegate-manager";
import { AccountAddress, AccountAuthenticator, Deserializer, Ed25519Signature, RawTransaction } from "@aptos-labs/ts-sdk";
import { isNumber, isString } from "lodash";
import { getAuthenticatorsAndRawTransaction } from "./helpers";
import uploadManager from "../../lib/upload-manager";
import localStore from "../../lib/local-store";
import storage from "../../lib/storage";
import client from "../../data/apollo";
import { GET_PUBLICATIONS } from "../../utils/queries";
import { Utils } from "../../utils";
import { constructConvergenceTransaction, settleConvergenceTransaction } from "../../utils/transactions";
import { CreatePublicationInput, CreatePublicationWithRefInput, CreateReactionInput, CreateReactionWithRefInput, RegisterRequestInboxInputArgs, RemovePublicationInput, RemovePublicationWithRefInput, RemoveReactionInput, RemoveReactionWithRefInput } from "../../lib/convergence-client/__generated__/graphql";
import ephemeralCache from "../../lib/local-store/ephemeral-cache";


interface KeyValuePair {
    key: string;
    value: string;
}

class PublicationsContract {

    hiddenPublications: Array<string> = []

    locked = false

    unlock() {
        this.locked = false
    }

    lock() {
        this.locked = true
    }

    waitForUnlock(): Promise<boolean> {
        return new Promise<boolean>(async (res, rej) => {
            if (this.locked) {
                console.log("Waiting for unlock")
                await Utils.sleep(1000)
                return res(this.waitForUnlock())
            } else {
                console.log("Resolved unlock")
                res(true)
            }
        })
    }

    convertMentions(mentions: Record<string, string>): KeyValuePair[] {
        let keyvaluepair: KeyValuePair[] = [];
    
        let entries = Object.entries(mentions);
        for (const e of entries) {
            keyvaluepair.push({key: e[0], value: e[1]})
        }
    
        return keyvaluepair
    }

    

    async createPublication(publication: TPUBLICATION | null, publication_type: 1 | 2 | 3 | 4 = 1, reference_kid?: number, parent_ref?: string, count?: number) {

        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }


        const parsed = publication ? publicationSchema.safeParse(publication) : null

        if (parsed && !parsed.success) {
            throw new Error("Invalid publication")
        }

        const data = parsed ? parsed.data : null

        

        const task = constructConvergenceTransaction({
            fee_payer_address: KADE_ACCOUNT_ADDRESS,
            name: 'createPublication',
            variables: {
                type:publication_type,
                delegate_address: account.address().hex(),
                reference_kid: reference_kid,
                payload: {
                    content: data?.content,
                    tags: data?.tags,
                    mentions: data?.mentions? this.convertMentions(data?.mentions) : [],
                    media: data?.media,
                    community: data?.community
                }

            } as CreatePublicationInput
        })

        let client_ref:string;

        await settleConvergenceTransaction({
            task,
            onSettled: async () => {
                const cached = ephemeralCache.get('client_ref_cache')
                
                if (typeof cached === 'string') {
                    client_ref = cached
                    await localStore.addPublication(
                        data,
                        publication_type,
                        client_ref,
                        cached!,
                        count
                    )
                }

            },
            onError(error) {
                throw new Error("Transaction failed")
            },
        })


        return client_ref!
    }

    async removePublication(publication_id: number, ref?: string, publication_type?: 1 | 2 | 3 | 4) {
        const account = delegateManager.account
        
        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!isNumber(publication_id)) {
            throw new Error("Invalid publication id")
        }

        const task = constructConvergenceTransaction({
            fee_payer_address: KADE_ACCOUNT_ADDRESS,
            name: 'removePublication',
            variables: {
                kid: publication_id,
                delegate_address:account.address().hex(),

            } as RemovePublicationInput
        })


        await settleConvergenceTransaction({
            task,
            onSettled: async () => {
                const cached = ephemeralCache.get('client_ref_cache')
                
                if (typeof cached === 'string') {
                    const client_ref = cached
                    
                    if (ref) {
                        await localStore.removePublication(client_ref, publication_type ?? 1)
                    }
                }

            },
            onError(error) {
                throw new Error("Transaction failed")
            },
        })

    }


    async createPublicationWithRef(publication: TPUBLICATION | null, publication_type: 1 | 2 | 3 | 4 = 1, ref: string, count?: number) {

        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        const parsed = publication ? publicationSchema.safeParse(publication) : null

        if (parsed && !parsed.success) {
            throw new Error("Invalid publication")
        }

        const data = parsed ? parsed.data : null


        try {

            const task = constructConvergenceTransaction({
                fee_payer_address: KADE_ACCOUNT_ADDRESS,
                name: 'createPublicationWithRef',
                variables: {
                    type:publication_type,
                    parent_ref:ref,
                    delegate_address: account.address().hex(),
                    payload: {
                        content: data?.content ? data?.content : '',
                        tags: data?.tags,
                        mentions: data?.mentions? this.convertMentions(data?.mentions) : [],
                        media: data?.media,
                        community: data?.community
                    }
    
                } as CreatePublicationWithRefInput
            })

            let client_ref:string;

            await settleConvergenceTransaction({
                task,
                onSettled: async () => {
                    const cached = ephemeralCache.get('client_ref_cache')

                    
                    if (typeof cached === 'string') {
                        client_ref = cached

                        await localStore.addPublication(
                            data,
                            publication_type,
                            ref,
                            client_ref,
                            count
                        )
                    }
    
                },
                onError(error) {
                    console.log('error is',error)
                    throw new Error("Transaction failed")
                },
            })

            return client_ref!

        }
        catch (e) {
            await localStore.removePublication(ref, publication_type)
            throw e
        }

    }


    async removePublicationWithRef(publication_ref: string, publication_type?: 1 | 2 | 3 | 4, parent_ref?: string) {

        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!isString(publication_ref)) {
            throw new Error("Invalid publication ref")
        }
        

        await localStore.removePublication(publication_ref, publication_type ?? 1, parent_ref)
        

        try {
            const task = constructConvergenceTransaction({
                fee_payer_address: KADE_ACCOUNT_ADDRESS,
                name: 'removePublicationWithRef',
                variables: {
                    ref:publication_ref,
                    delegate_address: account.address().hex(),
    
                } as RemovePublicationWithRefInput
            })

            await settleConvergenceTransaction({
                task,
                onSettled: async () => {
                },
                onError(error) {
                    throw new Error("Transaction failed")
                },
            })
        }
        catch (e) {
            await localStore.addPublication(null, publication_type ?? 1, parent_ref ?? "", publication_ref)
            throw e
        }

    }


    async createReaction(reaction: number, reference_kid: number) {
        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!isNumber(reaction) || !isNumber(reference_kid)) {
            throw new Error("Invalid reaction")
        }

        const task = constructConvergenceTransaction({
            fee_payer_address: KADE_ACCOUNT_ADDRESS,
            name: 'createReaction',
            variables: {
                reaction: reaction,
                reference_kid: reference_kid,
                delegate_address: account.address().hex(),

            } as CreateReactionInput
        })

        await settleConvergenceTransaction({
            task,
            onSettled: async () => {
            },
            onError(error) {
                throw new Error("Transaction failed")
            },
        })

    }


    createReactionWithRef = async (reaction: number, ref: string) => {

        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!isNumber(reaction) || !isString(ref)) {
            throw new Error("Invalid reaction")
        }

        await localStore.addReactedToPublication(ref, reaction)

        if (this.locked) {
            await this.waitForUnlock()
            await this.createReactionWithRef(reaction, ref)
            return
        } else {
            this.lock()
        }

        try {

            const task = constructConvergenceTransaction({
                fee_payer_address: KADE_ACCOUNT_ADDRESS,
                name: 'createReactionWithRef',
                variables: {
                    reaction: reaction,
                    ref: ref,
                    delegate_address: account.address().hex(),
    
                } as CreateReactionWithRefInput
            })
    
            await settleConvergenceTransaction({
                task,
                onSettled: async () => {
                    this.unlock()
                },
                onError(error) {
                    throw new Error("Transaction failed",error)
                },
            })
        }
        catch (e) {
            this.unlock()
            await localStore.removeReactedToPublication(ref)
            throw e
        }
    }


    async removeReaction(reaction_id: number) {
        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }


        if (!isNumber(reaction_id)) {
            throw new Error("Invalid reaction id")
        }

        const task = constructConvergenceTransaction({
            fee_payer_address: KADE_ACCOUNT_ADDRESS,
            name: 'removeReaction',
            variables: {
                kid: reaction_id,
                delegate_address: account.address().hex(),

            } as RemoveReactionInput
        })

        await settleConvergenceTransaction({
            task,
            onSettled: async () => {
            },
            onError(error) {
                throw new Error("Transaction failed",error)
            },
        })
    }

    async removeReactionWithRef(publication_ref: string) {

        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        if (!isString(publication_ref)) {
            throw new Error("Invalid publication ref")
        }
        await localStore.removeReactedToPublication(publication_ref)

        if (this.locked) {
            await this.waitForUnlock()
            await this.removeReactionWithRef(publication_ref)
            return
        }
        else {
            this.lock()
        }

        try {
            const task = constructConvergenceTransaction({
                fee_payer_address: KADE_ACCOUNT_ADDRESS,
                name: 'removeReactionWithRef',
                variables: {
                    ref: publication_ref,
                    delegate_address: account.address().hex(),
    
                } as RemoveReactionWithRefInput
            })
    
            await settleConvergenceTransaction({
                task,
                onSettled: async () => {
                    this.unlock()
                },
                onError(error) {
                    throw new Error("Transaction failed")
                },
            })
            

        }
        catch (e) {
            this.unlock()
            await localStore.addReactedToPublication(publication_ref, 1)
            throw e
        }
    }


    async removeFromFeed(publication_ref: string) {
        if (!isString(publication_ref)) {
            throw new Error("Invalid publication id")
        }

        let ref = publication_ref?.includes("_") ? publication_ref.split("_")[1] : publication_ref

       

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

export default new PublicationsContract()