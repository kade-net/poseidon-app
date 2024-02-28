import '../../global'
import 'react-native-get-random-values'
import axios from "axios";
import { z } from "zod";
import delegateManager from "../../lib/delegate-manager";
import { KADE_ACCOUNT_ADDRESS, APP_SUPPORT_API, aptos } from "..";
import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";
import { TPROFILE, profileSchema } from "../../schema";

class AccountContract {

    async updateProfile(profile: TPROFILE) {
        if (!delegateManager.signer) {
            throw new Error("No account found")
        }

        const parsed = profileSchema.safeParse(profile)
        if (!parsed.success) {
            throw new Error("Invalid profile")
        }

        const data = parsed.data

        const response = await axios.post<{ raw_txn: Array<number>, signature: Array<number> }>(`${APP_SUPPORT_API}/contract/account/update-profile`, {
            ...data,
            delegate_address: delegateManager.account?.address()?.toString()
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

}

export default new AccountContract()