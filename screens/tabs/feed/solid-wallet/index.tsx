import { TouchableOpacity } from 'react-native'
import React from 'react'
import { H1, Separator, Text, XStack, YStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { ArrowLeft, ArrowUp, Copy } from '@tamagui/lucide-icons'
import AptosIcon from '../../../../assets/svgs/aptos-icon'
import WalletTabs from './tabs'
import BaseButton from '../../../../components/ui/buttons/base-button'
import SearchAndSend from './search-and-send'
import {Utils} from "../../../../utils";
import delegateManager from "../../../../lib/delegate-manager";
import {useQuery} from "react-query";
import {currencies} from "../../../../lib/currencies";
import {MotiView} from "moti";
import {Skeleton} from "moti/skeleton";
import * as clipboard from 'expo-clipboard'

const SolidWallet = () => {
    const balanceQuery = useQuery({
        queryKey: ['solid-wallet-balance'],
        queryFn: async () => {
            const total = (await Promise.all(
                currencies.map(async (currency)=>{
                    const currentBalance = await currency?.getCurrentBalance?.() ?? 0
                    const USD_BALANCE = await currency?.getUSDBalance?.(currentBalance)
                    return USD_BALANCE
                })
            ))?.reduce((acc, curr)=>{
                if(curr){
                    return (acc ?? 0) + curr
                }
                return acc ?? 0
            }, 0) ?? 0

            return total ?? 0
        },
        refetchInterval: 60_000
    })
    const router = useRouter()


    const goBack = () => {
        router.back()
    }

    return (
        <YStack flex={1} backgroundColor={"$background"} p={20} >
            <TouchableOpacity onPress={goBack} style={{ width: '100%' }}>
                <XStack w="100%" alignItems='center' >
                    <ArrowLeft />
                </XStack>
            </TouchableOpacity>
            <YStack w="100%" rowGap={20} >
                <XStack w="100%" rowGap={10} pt={20} alignItems='center' justifyContent='space-between' >
                    <XStack alignItems='center' columnGap={10} >
                        <XStack alignItems='center' columnGap={10} bg="$portalBackground" px={10} py={5} borderRadius={20} >
                            <AptosIcon size={16} color='white' />
                            <Text fontSize={20} color={'$sideText'} >
                                {
                                    Utils.formatAddress(delegateManager.account?.address().toString() ?? '')
                                }
                            </Text>
                        </XStack>
                        <TouchableOpacity
                            onPress={async ()=>{
                               await clipboard.setStringAsync(delegateManager.account?.address().toString() ?? '')
                            }}
                        >
                            <Copy size={20} />
                        </TouchableOpacity>

                    </XStack>
                    <SearchAndSend />
                </XStack>
                <XStack>
                    <XStack columnGap={10} alignItems={'center'} width={'100%'} >
                        {
                            balanceQuery?.isLoading ? <MotiView
                                  transition={{
                                      type: 'timing'
                                  }}
                                  style={{
                                      flex: 1,
                                  }}
                                >
                                <Skeleton
                                    colorMode={'dark'}
                                    width={'100%'}

                                    height={30}
                                />
                            </MotiView> :
                        <Text fontSize={32} >
                            {Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'usd'
                            }).format(balanceQuery?.data ?? 0)}
                        </Text>
                        }
                    </XStack>

                </XStack>
                <Separator borderColor={'$border'} />
            </YStack>
            <WalletTabs />
        </YStack>
    )
}

export default SolidWallet