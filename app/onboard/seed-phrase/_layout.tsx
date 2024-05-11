import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const _layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        />
    )
}

export default _layout