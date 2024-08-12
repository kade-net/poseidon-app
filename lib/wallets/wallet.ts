import { Types } from "aptos";
import { aptos } from "../../contract";
import delegateManager from "../delegate-manager";
import { CoinActivityFieldsFragment, poseidonIndexerClient } from "../indexer-client";
import { isEmpty } from "lodash";
import posti from "../posti";

const IS_SELF_DELEGATE = delegateManager.owner! == delegateManager.account?.address().toString()
const ADDRESS = IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!

export function normalizeTimestamp(timestamp: string) {
    return timestamp[-1] !== 'Z' ? `${timestamp}Z` : timestamp;
}

export type SdkTransaction =
    | Types.Transaction_UserTransaction
    | Types.Transaction_PendingTransaction;

export const makeCoinInfoStructTag = (coinType: string) =>
    `0x1::coin::CoinInfo<${coinType}>` as const
    ;

export type CoinInfo = {
    decimals: number;
    name: string;
    supply: {
        vec: Array<{
            aggregator: {
                vec: Array<{
                    handle: string;
                    key: string;
                    limit: string;  // Assuming limit is a string to accommodate large integers
                }>
            },
            integer: {
                vec: any[];  // Assuming no specific type for integers here
            }
        }>
    };
    symbol: string;
}

export type CommonTransaction = {
    amount: bigint;
    coinInfo: CoinInfo;
    creationNum: any;
    sequenceNum: any;
    status: string;
    timestamp: number;
    txnVersion: any;
    recipient?: string;
    sender?: string;
    isFaucet?: boolean;
    originalTxn?: SdkTransaction | null
    type: 'coinTransfer' | 'coinEvent' | 'gasFee' | 'script'
}


interface TransactionParticipant {
    address: string,
    kade_account_owner_address: string,
    is_user: boolean
}

interface PoseidonSimpleTransaction {
    sender: TransactionParticipant,
    receiver: TransactionParticipant,
    function_name: string,
    gas_fees: number,
    amount: number,
    version_number: string
    success: boolean
}

interface SEND_ARGS {
    recipient: string,
    amount: number
    type?: string
    decimals?: number
}


class PoseidonWallet {

    constructor() { }

    getCoinInfo = async (coinType: string) => {
        const coinAddress = coinType.split('::')[0];
        const coinInfoResourceType = makeCoinInfoStructTag(coinType) as any;
        const accountResources = await aptos.getAccountResources({
            accountAddress: coinAddress
        })
        const coinData = accountResources?.find((res) => res.type === coinInfoResourceType)

        return coinData
    }

    parseTransaction = async (activity: CoinActivityFieldsFragment) => {
        try {
            const isCoinTransferTxn =
                activity.entry_function_id_str === '0x1::coin::transfer' ||
                activity.entry_function_id_str === '0x1::aptos_account::transfer' ||
                activity.entry_function_id_str === '0x1::aptos_account::transfer_coins';
            const isDeposit = activity.activity_type === '0x1::coin::DepositEvent';
            const isGasFee = activity.is_gas_fee;
            const isFaucet = activity.entry_function_id_str === null


            const info: CoinInfo | null = await this.getCoinInfo(activity.coin_type) as unknown as CoinInfo ?? null

            const normalizedTimestamp = normalizeTimestamp(
                activity.transaction_timestamp,
            );
            const datetime = new Date(normalizedTimestamp);

            // @ts-expect-error - type gets added later
            const common: CommonTransaction = {
                amount: BigInt(isDeposit ? activity.amount : -activity.amount),
                coinInfo: info,
                creationNum: activity.event_creation_number,
                sequenceNum: activity.event_sequence_number,
                status: activity.is_transaction_success ? 'success' : 'failed',
                timestamp: datetime.getTime(),
                txnVersion: activity.transaction_version
            };

            const txn: SdkTransaction | null = activity.transaction_version ? await aptos.getTransactionByVersion({
                ledgerVersion: activity.transaction_version
            }) as any : null

            const payload = txn?.payload as Types.EntryFunctionPayload | Types.ScriptPayload

            const isScript = txn?.payload?.type === 'script_payload'

            if (isScript) {
                const recipient = ADDRESS
                const sender = txn?.sender

                return {
                    ...common,
                    recipient,
                    sender,
                    type: 'script',
                    originalTxn: txn,
                }
            }

            // @ts-expect-error - type mismatch
            const smart_contract_address = payload?.function?.split('::')[0]

            if (isCoinTransferTxn && !isGasFee) {

                const recipient = (txn?.payload as Types.EntryFunctionPayload)
                    .arguments[0];

                return {
                    ...common,
                    recipient,
                    sender: txn?.sender,
                    type: 'coinTransfer',
                    originalTxn: txn,
                }
            }

            return {
                ...common,
                type: isGasFee ? 'gasFee' : 'coinEvent',
                recipient: smart_contract_address,
                sender: txn?.sender && txn?.sender == ADDRESS ? ADDRESS : txn?.sender,
                originalTxn: txn,
            } as CommonTransaction
        }
        catch (e) {
            // console.log(`Error parsing transaction ::`, e)
            return null
        }
    }

    getTransactions = async (props?: {
        address: string,
        offset: number,
        limit: number
    }) => {

        const activities = await poseidonIndexerClient.getAccountCoinActivity({
            address: delegateManager.owner!,
            ...props
        })

        const parsedTransactions = await Promise.all(activities?.coin_activities?.map(async (activity) => {

            const parsedInfo = await this.parseTransaction(activity)

            return parsedInfo
        }))

        return parsedTransactions
    }

    handleTransactionsPaginate = async (props: { pageParam?: number | undefined }) => {
        const { pageParam = 0 } = props
        const offset = pageParam 

        const IS_SELF_DELEGATE = delegateManager.owner! == delegateManager.account?.address().toString()

        const activities = await this.getTransactions({
            address: IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!,
            limit: 20,
            offset
        })

        return activities?.filter((activity) => activity !== null)
    }


    sendApt = async (args: SEND_ARGS) => {
        const { recipient, amount, type, decimals } = args
        if (isEmpty(recipient) || amount <= 0) throw new Error("Invalid recipient or amount")

        const transaction = await aptos.coin.transferCoinTransaction({
            amount: BigInt(amount * 10 ** (decimals ?? 8)),
            recipient,
            sender: delegateManager.account?.address().toString()!,
            options: {
                maxGasAmount: 1000,
            },
            coinType: type as any ?? undefined
        })



        const committedTxn = await aptos.transaction.signAndSubmitTransaction({
            signer: delegateManager.signer!,
            transaction
        })



        const status = await aptos.transaction.waitForTransaction({
            transactionHash: committedTxn.hash
        })


        if (!status.success) {
            posti.capture("Transaction failed", {
                hash: committedTxn.hash,
                committedTxn,
                status
            })
            throw new Error("Transaction failed")
        }
        else {
            return status
        }
    }

}

export default new PoseidonWallet() as PoseidonWallet