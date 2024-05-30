import { View, Text, YStack, Button } from 'tamagui'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import petra from '../../lib/wallets/petra'

const Connect = () => {
    const params = useLocalSearchParams()
    console.log("Params::", params)

    const handleConnect = () => {
        petra.connect()
    }
    return (
        <YStack py={40} px={20} >
            <Button onPress={handleConnect} >
                Connect Wallet
            </Button>
        </YStack>
    )
}

export default Connect