import { View, Text, YStack, XStack, H3, H4, Separator } from 'tamagui'
import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { NavigationProp } from '@react-navigation/native'


interface Props {
    prevScreen?: string,
    navigation: NavigationProp<any>
}

const CommunitiesEditTopBar = (props: Props) => {

    return (
        <YStack w="100%" alignItems='center' justifyContent='space-between' backgroundColor={'$background'} >
            <XStack w="100%" alignItems='center' columnGap={20} px={20} py={20} >
                <TouchableOpacity onPress={props?.navigation?.goBack} >
                    <ArrowLeft />
                </TouchableOpacity>
                <H4 textTransform='none' >
                    {
                        props.prevScreen ?? 'Edit Community'
                    }
                </H4>
            </XStack>
            <Separator w="100%" />
        </YStack>
    )
}

export default memo(CommunitiesEditTopBar)