import { View, Text } from 'react-native'
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