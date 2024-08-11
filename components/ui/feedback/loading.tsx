import { View, Text, YStack, Spinner } from 'tamagui'
import React from 'react'

type P = Parameters<typeof YStack>[0] & {
    loadingText?: string
}

const Loading = (props: P) => {
    const { loadingText, ...rest } = props
    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            justifyContent='center'
            {...rest}
        >
            <Spinner />
            {
                loadingText ? <Text>{loadingText}</Text> : null
            }
        </YStack>
    )
}

export default Loading