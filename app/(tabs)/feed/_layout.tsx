import { Text, View } from 'tamagui'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

const _layout = () => {
    return (
        <SafeAreaView style={{
            width: "100%",
            height: "100%",
        }} edges={Platform.select({
            ios: [
                'top',
                'right',
                'left'
            ],
            android: undefined
        })} >

            <Stack
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="home" />
                <Stack.Screen name="following" />
            </Stack>
        </SafeAreaView>
    )
}

export default _layout
