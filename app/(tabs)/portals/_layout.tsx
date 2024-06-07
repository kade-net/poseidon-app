import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
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
            }}
            edges={Platform.select({
                ios: ['top', 'left', 'right'],
                android: undefined
            })}
        >
            <Stack
                screenOptions={{
                    headerShown: false
                }}
            />
        </SafeAreaView>
    )
}

export default _layout