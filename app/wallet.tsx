import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { XStack, YStack } from 'tamagui'
import BaseButton from '../components/ui/buttons/base-button'
import PayUser from '../screens/pay'

const Wallet = () => {
    const params = useGlobalSearchParams<{
        address: string
        currency: string
        amount: string
        action: 'pay' | 'tip'
    }>()
    let AMOUNT = params.amount ? parseFloat(params.amount) : 0
    AMOUNT = AMOUNT ? Number.isNaN(AMOUNT) ? 0 : AMOUNT : 0
    const router = useRouter()

    return (
        <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} pt={40} >
            <XStack
                w="100%"
                px={20}
            >
                <BaseButton onPress={router.back} type='text' rounded='full' >
                    Close
                </BaseButton>
            </XStack>
            <YStack flex={1} w="100%" h="100%" >
                <PayUser
                    receiver={params.address}
                    amount={AMOUNT}
                    currency={params.currency as 'APT' | 'GUI'}
                    action={params.action}
                />
            </YStack>
        </YStack>
    )
}

export default Wallet