import { View, Text, YStack, XStack } from 'tamagui'
import React from 'react'
import { Inbox } from '@tamagui/lucide-icons'
import BaseButton from '../buttons/base-button'

interface Props {
    emptyText?: string
    onRefetch?: () => void
    loading?: boolean
}

const Empty = (props: Props & Parameters<typeof YStack>[0]) => {
    const { emptyText, onRefetch, loading, ...rest } = props
    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            justifyContent='center'
            rowGap={5}
            {...rest}
        >
            <XStack columnGap={10} alignItems='center' justifyContent='center' >
                <Inbox />
                <Text >
                    {emptyText ? emptyText : 'No data found'}
                </Text>
            </XStack>
            {onRefetch && <BaseButton
                loading={loading}
                w="100%"
                onPress={onRefetch}
            >
                <Text>
                    Refresh
                </Text>
            </BaseButton>}

        </YStack>
    )
}

export default Empty