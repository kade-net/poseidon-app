import { View } from 'react-native'
import React, { memo, useMemo } from 'react'
import { TPUBLICATION } from '../../../schema'
import {Text, XStack, YStack} from 'tamagui'
import { UseFormReturn } from 'react-hook-form'
import GenerateLayout from './generate-layout'
import ImageErrorBoundary from "./error-boundary";
import {Image} from "@tamagui/lucide-icons";

interface Props {
    data: TPUBLICATION['media']
    onRemove?: (id: string) => void
    layout?: 'horizontal' | 'single' | 'double' | 'triple' | 'quad'
}

function Empty() {
    return (
        <YStack flex={1} >
            <Image/>
            <Text textAlign={'center'} >
                Failed to render image
            </Text>
        </YStack>
    )
}

const MediaViewer = (props: Props) => {

    const { data, onRemove, layout } = props

    return (
        <YStack w="100%" flex={1} >
                <GenerateLayout
                    layout={layout}
                    data={data?.filter(a => a.type !== undefined)}
                    onRemove={onRemove}
                    editable={onRemove ? true : false}
                />
        </YStack>
    )
}

export default memo(MediaViewer)