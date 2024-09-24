import { Image } from 'react-native'
import React, { useEffect } from 'react'
import { Spinner, Text, XStack, YStack } from 'tamagui'

const InitializationScreen = () => {

    return (
        <YStack w='100%' h='100%' alignItems='center' justifyContent='center' backgroundColor={'$background'} >

            <YStack rowGap={20} >
                <Image
                    source={require('../../assets/brand/logo.png')}
                    style={{
                        width: 80,
                        height: 80,
                    }}
                />
                <YStack columnGap={20} >
                    <Spinner />
                </YStack>
            </YStack>
        </YStack>
    )
}

export default InitializationScreen