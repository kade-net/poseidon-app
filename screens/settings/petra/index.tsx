import { View, Text, YStack, Button, H3, H2, XStack, Separator, H4 } from 'tamagui'
import React, { useEffect } from 'react'
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router'
import petra from '../../../lib/wallets/petra'
import TransactionButton from '../../../components/ui/wallet/transaction-button'
import { History } from '@tamagui/lucide-icons'
import { aptos } from '../../../contract'
import { UserTransactionResponse } from '@aptos-labs/ts-sdk'
import delegateManager from '../../../lib/delegate-manager'
import { poseidonIndexerClient } from '../../../lib/indexer-client'

const Petra = () => {

    useEffect(() => {
        (async () => {
            try {
                const data = await poseidonIndexerClient.getAccountCoinActivity({
                    address: delegateManager.owner!,

                })

                const activity = data.coin_activities?.at(0)

                console.log("Activity::", activity)
            }
            catch (e) {
                console.log(`Something went wrong ::`, e)
            }
        })()
    }, [])
    return (
        <YStack backgroundColor={'$background'} flex={1} w='100%' h='100%' >

            <YStack w="100%" alignItems='center' justifyContent='flex-end' rowGap={10} pt={40} pb={20}   >
                <YStack alignItems='center' rowGap={5} px={20} >
                    <H2
                        fontWeight={'900'}
                    >
                        7.9 APT
                    </H2>
                    <Text>
                        9.2 USD
                    </Text>
                </YStack>
                <XStack w="100%" alignItems='center' justifyContent='center' columnGap={50} >
                    <Button variant='outlined' w={100} >
                        Send
                    </Button>
                    <Button variant='outlined' w={100} >
                        Receive
                    </Button>
                </XStack>
                <Separator w="100%" />
            </YStack>

            <YStack w="100%" flex={1} alignItems='center' rowGap={20}  >
                <XStack alignItems='center' justifyContent='center' columnGap={5} >
                    <History />
                    <H4>
                        History
                    </H4>
                </XStack>
                <TransactionButton />
            </YStack>

        </YStack>
    )
}

export default Petra