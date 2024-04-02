import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useFocusEffect } from 'expo-router'
import { BackHandler } from 'react-native'

const _layout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }} >
            <Stack.Screen name="index" />
        </Stack>
    )
}

export default _layout