import axios from "axios";
import { APP_SUPPORT_API, KADE_ACCOUNT_ADDRESS, USERNAMES_COLLECTION_ADDRESS, USERNAME_VIEW_FUNCTIONS, aptos } from "..";
import delegateManager from "../../lib/delegate-manager";
import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction } from "@aptos-labs/ts-sdk";


class UsernamesContract {

    constructor() { }

    async checkUsernameAvailability(username: string) {
        const resp = await aptos.view({
            payload: {
                function: USERNAME_VIEW_FUNCTIONS.is_username_claimed as any,
                functionArguments: [username]
            }
        })

        const data = resp as [boolean]
        const claimed = data[0]
        if (claimed) {
            return false
        }
        return true
    }

    async claimUsername(username: string) {

        if (!delegateManager.signer || !delegateManager.account) {
            throw new Error("No account found")
        }
        const response = await axios.post<{
            raw_txn: Array<number>,
            signature: Array<number>
        }>(`${APP_SUPPORT_API}/contract/username/claim-username`, {
            username,
            user_address: delegateManager.account?.address()?.toString()
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

    async getUsername() {
        const response = await axios.post('https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
            {
                query: `
                query getAccountOwnedTokensFromCollection($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
                    current_token_ownerships_v2(
                      where: $where_condition
                      offset: $offset
                      limit: $limit
                      order_by: $order_by
                    ) {
                      current_token_data {
                        token_name
                      }
                    }
                  }
                `,
                "variables": {
                    "where_condition": {
                        "owner_address": {
                            "_eq": delegateManager.account?.address()?.toString()
                        },
                        "current_token_data": {
                            "collection_id": {
                                "_eq": USERNAMES_COLLECTION_ADDRESS
                            }
                        },
                        "amount": {
                            "_gt": 0
                        }
                    }
                }
            }
        )

        const name = response.data.data.current_token_ownerships_v2?.at(0)?.current_token_data.token_name
        return name
    }

}

export default new UsernamesContract()