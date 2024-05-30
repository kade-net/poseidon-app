import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useFocusEffect } from 'expo-router'
import { BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'tamagui'

const _layout = () => {
    const theme = useTheme()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: theme.background.val
            }}
        >
            <Stack screenOptions={{
                headerShown: false
            }} />
        </SafeAreaView>
    )
}

export default _layout