import { TouchableOpacity } from 'react-native'
import React, { FunctionComponent, ReactNode, forwardRef } from 'react'
import { Button, H5, XStack, YStack, View, Text } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'

interface Props {
    icon: ReactNode
    title: string
    description: string
    onPress: () => void

}



const SectionButton = forwardRef((props: Props, ref) => {
    const { icon, title, description, onPress } = props
    return (
        <TouchableOpacity style={{
            width: '100%',
        }} onPress={onPress} >
            <XStack w="100%" alignItems='center' justifyContent='space-between' pr={20} >
                <XStack alignItems='center' p={20} pr={0} columnGap={20} >
                    <View  >
                        {icon}
                    </View>
                    <YStack>
                        <H5>
                            {title}
                        </H5>
                        <Text>
                            {description}
                        </Text>
                    </YStack>
                </XStack>
                {/* <View> */}
                <ChevronRight color={'white'} />
                {/* </View> */}
            </XStack>
        </TouchableOpacity>
    )
})

export default SectionButton