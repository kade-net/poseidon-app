import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const _layout = () => {
    return (
        <SafeAreaView
            style={{
                width: '100%',
                height: '100%',
                flex: 1
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