import { View, Text, YStack, H3, Button, Separator } from 'tamagui'
import React from 'react'
import { Anchor } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Anchors from '../../screens/settings/anchors'

const AnchorsScreen = () => {
    return (
        <Anchors />
    )
}

export default AnchorsScreen