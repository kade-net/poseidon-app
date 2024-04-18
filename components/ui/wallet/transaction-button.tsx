import React from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { ArrowDown } from '@tamagui/lucide-icons'

interface Props {

}

const TransactionButton = () => {
    return (
        <XStack w="100%" alignItems='center' justifyContent='space-between' >
            <XStack columnGap={10} alignItems='center' >
                <ArrowDown />
                <YStack>
                    <Text>
                        Received
                    </Text>
                    <Text>
                        From 0x1234...5678
                    </Text>
                </YStack>
            </XStack>
            <Text>
                + 0.1 APT
            </Text>
        </XStack>
    )
}

export default TransactionButton