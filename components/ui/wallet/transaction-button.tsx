import React, { useMemo } from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { ArrowDown, ArrowUp, Dot, FileCode, Percent } from '@tamagui/lucide-icons'
import { CommonTransaction } from '../../../lib/wallets/wallet'
import delegateManager from '../../../lib/delegate-manager'
import { Utils } from '../../../utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Link } from 'expo-router'
dayjs.extend(relativeTime)


interface Props {
    transaction?: CommonTransaction | null
}

const TransactionButton = (props: Props) => {
    const IS_SELF_DELEGATE = delegateManager.owner! == delegateManager.account?.address().toString()
    const ADDRESS = IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!
    const { transaction = null } = props

    const data = useMemo(() => {
        const IS_SENDER = transaction?.sender === ADDRESS
        const IS_RECEIVER = transaction?.recipient === ADDRESS
        const APT_AMOUNT = (Number(transaction?.amount) ?? 0) / 10 ** 8
        const TYPE = transaction?.type ?? 'coinTransfer'
        return { IS_SENDER, IS_RECEIVER, APT_AMOUNT, TYPE }

    }, [, transaction?.txnVersion, transaction?.sender, transaction?.recipient, transaction?.amount, transaction?.timestamp, transaction?.type])

    const { IS_SENDER, IS_RECEIVER, APT_AMOUNT, TYPE } = data
    return (
        <Link
            asChild
            href={{
                pathname: '/settings/wallet/transactions/[transaction_version]/',
                params: {
                    transaction_version: transaction?.txnVersion!
                }
            }}
        >
            <XStack w="100%" alignItems='center' justifyContent='space-between' px={10} py={10} >
                <XStack columnGap={10} alignItems='center' >
                    {
                        IS_SENDER ?
                            TYPE == 'gasFee' ? <Percent /> : <ArrowUp /> : null
                    }
                    {
                        (IS_RECEIVER && TYPE !== 'script') ? <ArrowDown /> : null
                    }
                    {
                        TYPE == 'script' && <FileCode />
                    }
                    <YStack>
                        <Text fontSize={'$6'} fontWeight={'600'} >
                            {
                                TYPE == 'script' ? 'Script' :
                                    IS_RECEIVER ? 'Received' :
                                        IS_SENDER ?
                                            TYPE == 'gasFee' ? 'Gas Fee' : 'Sent' : 'Unknown'
                            }
                        </Text>
                        <XStack alignItems='center' >
                            <Text>
                                Confirmed
                            </Text>
                            <Dot />
                            <Text>
                                {
                                    dayjs(transaction?.timestamp).fromNow()
                                }
                            </Text>
                        </XStack>
                    </YStack>
                </XStack>
                <Text
                    fontWeight={'600'}
                    color={APT_AMOUNT > 0 ? 'green' : 'red'}
                >
                    {APT_AMOUNT > 0 ? '+' : ''}{APT_AMOUNT} APT
                </Text>
            </XStack>
        </Link>
    )
}

export default TransactionButton