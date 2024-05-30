import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack, useTheme } from 'tamagui'

const _layout = () => {
    const theme = useTheme()
    return (
        <YStack flex={1} w="100%" h="100%" bg="$background" >
            <Stack />
        </YStack>
    )
}

export default _layout