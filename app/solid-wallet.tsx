import { View, Text, YStack, useTheme } from 'tamagui'
import React from 'react'
import SolidWallet from '../screens/tabs/feed/solid-wallet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

const Wallet = () => {
    const theme = useTheme()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: theme.background.val
            }}
            edges={Platform.select({
                ios: ['top', 'right', 'left'],
                android: undefined
            })}
        >
            <SolidWallet />
        </SafeAreaView>
    )
}

export default Wallet