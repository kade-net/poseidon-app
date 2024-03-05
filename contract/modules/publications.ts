import { z } from "zod";
import { TPUBLICATION, publicationSchema } from "../../schema";
import axios from "axios";
import { APP_SUPPORT_API, KADE_ACCOUNT_ADDRESS, aptos } from "..";
import delegateManager from "../../lib/delegate-manager";
import { AccountAddress, AccountAuthenticator, Deserializer, Ed25519Signature, RawTransaction } from "@aptos-labs/ts-sdk";
import { isNumber, isString } from "lodash";
import { getAuthenticatorsAndRawTransaction } from "./helpers";
import uploadManager from "../../lib/upload-manager";


class PublicationsContract {

    async createPublication(publication: TPUBLICATION) {

        const account = delegateManager.account

        if (!account || !delegateManager.signer) {
            throw new Error("No account found")
        }

        const delegate_address = account.address().toString()

        const parsed = publicationSchema.safeParse(publication)

        if (!parsed.success) {
            throw new Error("Invalid publication")
        }

        const data = parsed.data

        const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/publications/create-publication`, {
            payload: data,
            delegate_address
        })

        const { raw_txn, signature } = response.data

        const txn_deserializer = new Deserializer(new Uint8Array(raw_txn))
        const signature_deserializer = new Deserializer(new Uint8Array(signature))

        const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
        const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

        const accountSignature = aptos.transaction.sign({
            signer: delegateManager.signer,
            transaction: {
                rawTransaction: raw_txn_deserialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            }
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: accountSignature,
            transaction: {
                rawTransaction: raw_txn_deserialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: signature_deserialized
        })

        return commited_txn

    }

    async removePublication(publication_id: number) {
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

        return commited_txn
    }

    async createComment(reference_kid: number, type: number, payload: TPUBLICATION) {
        if (!isNumber(reference_kid) || !isNumber(type)) {
            throw new Error("Invalid publication id or type")
        }

        const parsed = publicationSchema.safeParse(payload)

        if (!parsed.success) {
            throw new Error("Invalid publication")
        }

        const data = parsed.data

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-comment`, {
            reference_kid,
            type,
            content: data
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn

    }

    async removeComment(comment_id: number) {
        if (!isNumber(comment_id)) {
            throw new Error("Invalid comment id")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-comment`, {
            kid: comment_id
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn
    }

    async createRepost(reference_kid: number, type: number) {
        if (!isNumber(reference_kid) || !isNumber(type)) {
            throw new Error("Invalid publication id or type")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-repost`, {
            reference_kid,
            type
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn
    }

    async removeRepost(repost_id: number) {
        if (!isNumber(repost_id)) {
            throw new Error("Invalid repost id")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-repost`, {
            kid: repost_id
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn
    }

    async createQuote(reference_kid: number, payload: TPUBLICATION) {
        if (!isNumber(reference_kid)) {
            throw new Error("Invalid publication id")
        }

        const parsed = publicationSchema.safeParse(payload)

        if (!parsed.success) {
            throw new Error("Invalid publication")
        }

        const data = parsed.data

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-quote`, {
            reference_kid,
            payload: data
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn
    }


    async removeQuote(quote_id: number) {
        if (!isNumber(quote_id)) {
            throw new Error("Invalid quote id")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/remove-quote`, {
            kid: quote_id
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn
    }


    async createReaction(reaction: number, reference_kid: number, type: number) {
        if (!isNumber(reaction) || !isNumber(reference_kid) || !isNumber(type)) {
            throw new Error("Invalid reaction, publication id or type")
        }

        const { fee_payer_signature, raw_txn_desirialized, sender_signature } = await getAuthenticatorsAndRawTransaction(`${APP_SUPPORT_API}/contract/publications/create-reaction`, {
            reaction,
            reference_kid,
            type
        })

        const commited_txn = await aptos.transaction.submit.simple({
            senderAuthenticator: sender_signature,
            transaction: {
                rawTransaction: raw_txn_desirialized,
                feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
            },
            feePayerAuthenticator: fee_payer_signature
        })

        return commited_txn
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

        return commited_txn
    }




}

export default new PublicationsContract()