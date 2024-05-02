import { TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { XStack, YStack, Text, Separator } from 'tamagui'
import { useQueryClient } from 'react-query'
import { CommonTransaction } from '../../../lib/wallets/wallet'
import { CheckCheck, CheckCircle, ExternalLink, XCircle } from '@tamagui/lucide-icons'
import dayjs from 'dayjs'
import { flatten, uniqBy } from 'lodash'
import { Types } from 'aptos'
import delegateManager from '../../../lib/delegate-manager'
import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import config from '../../../config'

const NETWORK = config.APTOS_NETWORK
const EXPLORER = `https://explorer.aptoslabs.com/txn/TXN_VERSION?network=${NETWORK}`


interface TransactionProps {
    transaction_version: string
}

const Transaction = (props: TransactionProps) => {
    const IS_SELF_DELEGATE = delegateManager.owner! == delegateManager.account?.address().toString()
    const ADDRESS = IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!
    const { transaction_version } = props
    const client = useQueryClient()

    const transaction = useMemo(() => {
        if (transaction_version) {
            const query = client.getQueryData('wallet-transactions') as { pages: Array<Array<CommonTransaction>> } ?? { pages: [] }
            const transactions = uniqBy(flatten(query?.pages), (item) => item.txnVersion)
            const transaction = transactions?.find((transaction) => transaction?.txnVersion == transaction_version)
            if (transaction) {
                return transaction
            }
            return null
        }
        return null
    }, [transaction_version])

    const IS_SPONSORED = transaction?.originalTxn?.signature?.fee_payer_address ? transaction?.originalTxn?.signature?.fee_payer_address !== ADDRESS : false


    const handleOpenExplorer = () => {
        Linking.openURL(EXPLORER.replace('TXN_VERSION', transaction_version))
    }

    return (
        <YStack
            flex={1}
            width={'100%'}
            height={'100%'}
            backgroundColor={'$background'}
            rowGap={20}
            p={20}
        >
            <TouchableOpacity onPress={handleOpenExplorer} >
                <XStack w="100%" alignItems='flex-end' >
                    <Text color='$blue10' >
                        View on Explorer
                    </Text>
                    <ExternalLink size={'$1'} color={'$blue10'} />
                </XStack>
            </TouchableOpacity>

            <YStack w="100%" rowGap={10} >
                <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text fontSize={'$6'} fontWeight={'600'} >
                        Version
                    </Text>
                    <Text>
                        {transaction?.txnVersion}
                    </Text>
                </XStack>
                <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text fontSize={'$6'} fontWeight={'600'} >
                        Timestamp
                    </Text>
                    <Text>
                        {dayjs(transaction?.timestamp).format('MMMM D, YYYY h:mm A')}
                    </Text>
                </XStack>
                <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text fontSize={'$6'} fontWeight={'600'} >
                        Status
                    </Text>
                    {
                        transaction?.status == 'success' ? <CheckCircle size={'$1'} color={'$green10'} /> : <XCircle
                            color={'$red10'}
                        />
                    }
                </XStack>
                <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text fontSize={'$6'} fontWeight={'600'} >
                        Gas Used
                    </Text>
                    <Text>
                        {
                            ((transaction?.originalTxn?.gas_used ?? 0) / 10 ** 8).toFixed(8)
                        }
                    </Text>
                </XStack>
                <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text fontSize={'$6'} fontWeight={'600'} >
                        Gas Unit Price
                    </Text>
                    <Text>
                        {
                            (Number(transaction?.originalTxn?.gas_unit_price ?? 0))
                        }
                    </Text>
                </XStack>
            </YStack>
            <Separator />
            <YStack w="100%" rowGap={10} >
                {(transaction?.type == 'coinTransfer') && <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text fontSize={'$6'} fontWeight={'600'} >
                        Type
                    </Text>
                    <Text>
                        Coin Transfer
                    </Text>
                </XStack>}
                {
                    transaction?.type == 'gasFee' && <XStack
                        w="100%"
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Text
                            fontSize={'$6'}
                            fontWeight={'600'}
                        >
                            Function
                        </Text>
                        <Text>
                            {
                                (transaction?.originalTxn?.payload as Types.EntryFunctionPayload)?.function?.split('::')?.[2]
                            }
                        </Text>
                    </XStack>
                }
                {(['script', 'coinTransfer', 'gasFee', 'coinEvent']?.includes(transaction?.type ?? '')) && <XStack
                    w="100%"
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Text
                        fontSize={'$6'}
                        fontWeight={'600'}
                    >
                        Balance Changes
                    </Text>
                    <Text
                        color={
                            !IS_SPONSORED ?
                                (transaction?.amount ?? 0) > 0 ? 'green' : 'red' :
                                '$blue10'
                        }
                    >
                        {
                            !IS_SPONSORED ? (
                                <>
                                    {
                                        (transaction?.amount ?? 0) > 0 ? '+' : ''
                                    }
                                    {Number(transaction?.amount ?? 0) / 10 ** 8} APT
                                </>

                            ) : 'sponsored'
                        }
                    </Text>
                </XStack>}
            </YStack>


        </YStack>
    )
}

export default Transaction