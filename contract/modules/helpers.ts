import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction } from "@aptos-labs/ts-sdk";
import delegateManager from "../../lib/delegate-manager";
import axios from "axios";
import { KADE_ACCOUNT_ADDRESS, aptos } from "..";


export async function getAuthenticatorsAndRawTransaction(
    sponsor_endpoint: string,
    payload: any,
): Promise<{
    raw_txn_desirialized: RawTransaction,
    fee_payer_signature: AccountAuthenticator
    sender_signature: AccountAuthenticator
}> {

    const account = delegateManager.account
    const signer = delegateManager.signer

    if (!account || !signer) {
        throw new Error("No account found")
    }

    const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${sponsor_endpoint}`, {
        ...payload,
        delegate_address: account.address().toString()
    })

    const { raw_txn, signature } = response.data

    const txn_deserializer = new Deserializer(new Uint8Array(raw_txn))
    const signature_deserializer = new Deserializer(new Uint8Array(signature))

    const raw_txn_deserialized = RawTransaction.deserialize(txn_deserializer)
    const signature_deserialized = AccountAuthenticator.deserialize(signature_deserializer)

    const accountSignature = aptos.transaction.sign({
        signer: signer,
        transaction: {
            rawTransaction: raw_txn_deserialized,
            feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
        }
    })

    return {
        raw_txn_desirialized: raw_txn_deserialized,
        fee_payer_signature: signature_deserialized,
        sender_signature: accountSignature
    }
}