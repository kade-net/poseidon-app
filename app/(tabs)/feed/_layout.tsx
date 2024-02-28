import { Text, View } from 'tamagui'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="home" />
            <Stack.Screen name="following" />
        </Stack>
    )
}

export default _layout
