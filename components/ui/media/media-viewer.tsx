import { View, Text } from 'react-native'
import React, { memo, useMemo } from 'react'
import { TPUBLICATION } from '../../../schema'
import { XStack, YStack } from 'tamagui'
import { UseFormReturn } from 'react-hook-form'
import GenerateLayout from './generate-layout'

interface Props {
    data: TPUBLICATION['media']
    onRemove?: (id: string) => void
}



const MediaViewer = (props: Props) => {

    const { data, onRemove } = props

    return (
        <YStack w="100%" >
            <GenerateLayout
                data={data}
                onRemove={onRemove}
                editable={onRemove ? true : false}
            />
        </YStack>
    )
}

export default memo(MediaViewer)