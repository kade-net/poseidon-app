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

        const txn_details = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-publication`, {
            type: publication_type,
            reference_kid,
            ...(data ? { payload: data } : null)
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: txn_details.sender_signature,
            transaction: {
                rawTransaction: txn_details.raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: txn_details.fee_payer_signature
        })

        const status = await aptos.waitForTransaction({
            transactionHash: commited_txn.hash
        })

        if (status.success) {
            await localStore.addPublication(
                data,
                publication_type,
                parent_ref ?? "",
                txn_details.client_ref!,
                count
            )
        }
        else {
            throw new Error("Transaction failed")
        }


        return txn_details.client_ref!
    }

    async removePublication(publication_id: number, ref?: string, publication_type?: 1 | 2 | 3 | 4) {
        if (!isNumber(publication_id)) {
            throw new Error("Invalid publication id")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-publication`, {
            kid: publication_id
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        const status = await aptos.waitForTransaction({
            transactionHash: commited_txn.hash
        })

        if (!status.success) {
            throw new Error("Transaction failed")
        } else {
            if (ref) {
                await localStore.removePublication(ref, publication_type ?? 1)
            }
        }
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
            const txn_details = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-publication-with-ref`, {
                type: publication_type,
                parent_ref: ref,
                ...(data ? { payload: data } : null)
            })

            await localStore.addPublication(
                data,
                publication_type,
                ref,
                txn_details.client_ref!,
                count
            )

            const commited_txn = await aptos.transaction.submit.simple({
                senderAuthenticator: txn_details.sender_signature,
                transaction: {
                    rawTransaction: txn_details.raw_txn_desirialized,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: txn_details.fee_payer_signature
            })

            const status = await aptos.waitForTransaction({
                transactionHash: commited_txn.hash
            })

            if (status.success) {

            } else {
                throw new Error("Transaction failed")
            }

            return txn_details.client_ref!

        }
        catch (e) {
            await localStore.removePublication(ref, publication_type)
            throw e
        }

    }


    async removePublicationWithRef(publication_ref: string, publication_type?: 1 | 2 | 3 | 4, parent_ref?: string) {
        if (!isString(publication_ref)) {
            throw new Error("Invalid publication ref")
        }

        await localStore.removePublication(publication_ref, publication_type ?? 1, parent_ref)

        try {
            const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-publication-with-ref`, {
                ref: publication_ref
            })
            const commited_txn = await aptos.transaction.submit.simple({
                senderAuthenticator: sender_signature,
                transaction: {
                    rawTransaction: raw_txn_desirialized,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: fee_payer_signature
            })

            const status = await aptos.waitForTransaction({
                transactionHash: commited_txn.hash
            })

            if (status.success) {
            }
            else {
                throw new Error("Transaction failed")
            }

        }
        catch (e) {
            await localStore.addPublication(null, publication_type ?? 1, parent_ref ?? "", publication_ref)
            throw e
        }

    }


    async createReaction(reaction: number, reference_kid: number) {
        if (!isNumber(reaction) || !isNumber(reference_kid)) {
            throw new Error("Invalid reaction")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-reaction`, {
            reaction,
            reference_kid
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        const status = await aptos.waitForTransaction({
            transactionHash: commited_txn.hash
        })

        if (!status.success) {
            throw new Error("Transaction failed")
        }

    }


    createReactionWithRef = async (reaction: number, ref: string) => {
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
            const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-reaction-with-ref`, {
                reaction,
                ref
            })

            const commited_txn = await aptos.transaction.submit.simple({
                senderAuthenticator: sender_signature,
                transaction: {
                    rawTransaction: raw_txn_desirialized,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: fee_payer_signature
            })

            const status = await aptos.waitForTransaction({
                transactionHash: commited_txn.hash
            })

            if (!status.success) {
                throw new Error("Transaction failed")
            } else {
                this.unlock()
            }

        }
        catch (e) {
            this.unlock()
            await localStore.removeReactedToPublication(ref)
            throw e
        }
    }


    async removeReaction(reaction_id: number) {
        if (!isNumber(reaction_id)) {
            throw new Error("Invalid reaction id")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-reaction`, {
            kid: reaction_id
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        const status = await aptos.waitForTransaction({
            transactionHash: commited_txn.hash
        })

        if (!status.success) {
            throw new Error("Transaction failed")
        }
    }

    async removeReactionWithRef(publication_ref: string) {
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
            const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-reaction-with-ref`, {
                ref: publication_ref
            })

            const commited_txn = await aptos.transaction.submit.simple({
                senderAuthenticator: sender_signature,
                transaction: {
                    rawTransaction: raw_txn_desirialized,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: fee_payer_signature
            })

            const status = await aptos.waitForTransaction({
                transactionHash: commited_txn.hash
            })

            if (!status.success) {
                throw new Error("Transaction failed")
            }
            else {
                this.unlock()
            }

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

        // client.refetchQueries({
        //     include: [GET_PUBLICATIONS]
        // })

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