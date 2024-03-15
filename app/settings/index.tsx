import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import delegateManager from '../../lib/delegate-manager'
import { Button, H4, XStack, YStack } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'
import Settings from '../../screens/settings'
import { Stack, useRouter } from 'expo-router'
import { ArrowLeft } from '@tamagui/lucide-icons'

const SettingsScreen = () => {

    return (
        <YStack>

            <Settings />
        </YStack>
    )
}

export default SettingsScreen