import { View, Text, YStack, XStack } from 'tamagui'
import React from 'react'
import { SceneProps } from '../../../../profiles/tabs/common'
import { currencies, Currency } from '../../../../../lib/currencies'
import { useQuery } from 'react-query'
import { Skeleton } from 'moti/skeleton'
import { MotiView } from 'moti'

interface AssetsTabProps extends SceneProps { }

function CurrencyLine(props: { currency: Currency }) {
    const { currency } = props
    const balanceQuery = useQuery({
        queryKey: ['balances', currency.name],
        queryFn: async () => {
            const balance = await currency?.getCurrentBalance?.() ?? 0
            const usdBalance = await currency?.getUSDBalance?.(balance) ?? 0
            return {
                usdValue: usdBalance,
                balance
            }
        }
    })

    if (balanceQuery.isLoading) {
        return (
            <XStack w="100%" >
                <MotiView
                    transition={{
                        type: 'timing'
                    }}
                    // animate={{
                    //     backgroundColor: '#ffffff'
                    // }}
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1
                    }}
                >
                    {/* <Skeleton
                        colorMode='dark'
                        height={40}
                        width={40}
                        radius={'round'}
                    /> */}
                    <Skeleton
                        colorMode='dark'
                        height={40}
                        width={'100%'}
                    />
                    {/* <Skeleton
                        colorMode='dark'
                        height={40}
                        width={40}
                    /> */}
                </MotiView>
            </XStack>
        )
    }

    return (
        <XStack w="100%" alignItems='center' justifyContent='space-between' >
            <XStack columnGap={20} alignItems='flex-end' >
                <currency.icon size={40} />
                <Text fontSize={20} fontWeight={'600'} >
                    {currency.name}
                </Text>
            </XStack>
            <YStack>
                <Text fontWeight={'600'} fontSize={18} >
                    {
                        Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'usd',
                        }).format(balanceQuery?.data?.usdValue ?? 0)
                    }
                </Text>
                <Text color={'$sideText'} >
                    {balanceQuery.data?.balance} {currency.name}
                </Text>
            </YStack>
        </XStack>
    )
}

const AssetsTab = (props: AssetsTabProps) => {
    return (
        <YStack w="100%" flex={1} h="100%" rowGap={30} pt={20} >
            {
                currencies?.map((currency) => {
                    return (
                        <CurrencyLine currency={currency} key={currency.name} />
                    )
                })
            }
        </YStack>
    )
}

export default AssetsTab