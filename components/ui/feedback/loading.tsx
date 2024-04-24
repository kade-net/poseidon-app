import { View, Text, YStack, Spinner } from 'tamagui'
import React from 'react'

type P = Parameters<typeof YStack>[0]

const Loading = (props: P) => {

    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            justifyContent='center'
            {...props}
        >
            <Spinner />
        </YStack>
    )
}

export default Loading