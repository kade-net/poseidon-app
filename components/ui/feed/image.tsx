import { View, Text, Image } from 'tamagui'
import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Cross, X } from '@tamagui/lucide-icons'
import { isUndefined } from 'lodash'

interface FeedImageProps {
    editable?: boolean
    image: string
    onRemove?: (id: string | number) => void
    id?: string | number
}

const FeedImage = (props: FeedImageProps) => {
    const { image, editable = false, id, onRemove } = props
    return (
        <View
            position='relative'
            flex={1}
            aspectRatio={1}
            width={"100%"}
            borderRadius={20}
            overflow='hidden'
            backgroundColor={'$gray1'}
        >
            {editable && <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 2
                }}
                onPress={() => {
                    if (Number.isInteger(id) && !isUndefined(id)) {
                        onRemove && onRemove(id)
                    }
                }}
            >
                <X />
            </TouchableOpacity>}

            <Image
                source={{ uri: image }}
                style={{
                    width: '100%',
                    height: '100%'
                }}
            />

        </View>
    )
}

export default memo(FeedImage)