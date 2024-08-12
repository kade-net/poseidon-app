import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack initialRouteName='[address]' screenOptions={{
            headerShown: false,
        }} >
            <Stack.Screen name="[address]" />
        </Stack>
    )
}

export default _layout