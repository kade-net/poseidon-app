import { View, Text, YStack, XStack, H4, Separator } from 'tamagui'
import React from 'react'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { NavigationProp } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import { Utils } from '../../../utils'

interface Props {
    title: string,
    navigation: NavigationProp<any>
}

const TopBarWithBack = (props: Props) => {
    const { title, navigation } = props
    return (
        <YStack w="100%" pt={Utils.dynamicHeight(2)} columnGap={20} backgroundColor={"$background"}>
            <TouchableOpacity
                onPress={navigation.goBack}
            >
                <XStack w="100%" alignItems='center' columnGap={20} px={Utils.dynamicWidth(3)} >
                    <ArrowLeft />
                    <H4 textTransform='none' >
                        {title}
                    </H4>
                </XStack>
            </TouchableOpacity>
            <Separator  pt={Utils.dynamicHeight(2)} />
        </YStack>
    )
}

export default TopBarWithBack