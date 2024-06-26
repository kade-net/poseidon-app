import { View, Text } from 'react-native'
import React from 'react'
import { YStack } from 'tamagui'
import UnstyledButton from '../../components/ui/buttons/unstyled-button'
import { ChevronLeft } from '@tamagui/lucide-icons'
import BaseButton from '../../components/ui/buttons/base-button'

const PetraSignInScreen = () => {

    const handleConnect = () => {

    }

    return (
        <YStack flex={1} w="100%" height={'100%'} backgroundColor={'$background'} p={20} >
            <UnstyledButton icon={<ChevronLeft />} label={"Back"} />
            <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
                <BaseButton>
                    Connect
                </BaseButton>
            </YStack>
        </YStack>
    )
}

export default PetraSignInScreen