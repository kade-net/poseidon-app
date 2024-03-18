import { View, Text, YStack, XStack, H4, Separator } from 'tamagui'
import React from 'react'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { NavigationProp } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'

interface Props {
    title: string,
    navigation: NavigationProp<any>
}

const TopBarWithBack = (props: Props) => {
    const { title, navigation } = props
    return (
        <YStack w="100%" >
            <TouchableOpacity
                onPress={navigation.goBack}
            >
                <XStack w="100%" alignItems='center' p={20} columnGap={20} >
                    <ArrowLeft />
                    <H4 textTransform='none' >
                        {title}
                    </H4>
                </XStack>
            </TouchableOpacity>
            <Separator />
        </YStack>
    )
}

export default TopBarWithBack