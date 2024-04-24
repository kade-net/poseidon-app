import React from 'react'
import { Button, Text, XStack, YStack } from 'tamagui'

interface ErrorProps {
    onRetry?: () => void
}

const Error = (props: ErrorProps) => {
    const { onRetry } = props
    return (
        <YStack w="100%" flex={1} h="100%" alignItems='center' justifyContent='center' >
            <YStack flex={1} w={'100%'} h={'100%'} alignItems='center' justifyContent='center' >

                <Text color={'$red10'} >
                    OOps! Something went wrong.
                </Text>
            </YStack>

            <XStack w="100%" >
                <Button
                    onPress={onRetry}
                >
                    Try again
                </Button>
            </XStack>
        </YStack>
    )
}

export default Error