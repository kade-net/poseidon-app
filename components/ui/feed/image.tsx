import { View, Text, Image, Spinner } from 'tamagui'
import React, { memo, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { Cross, X } from '@tamagui/lucide-icons'
import { head, isUndefined } from 'lodash'
import { useQuery } from 'react-query'

interface FeedImageProps {
    editable?: boolean
    image: string
    onRemove?: (id: string | number) => void
    id?: string | number
}



const getSize = async (image: string) => {
    return new Promise<{ width: number, height: number }>((res, rej) => {
        Image.getSize(image, (width, height) => {
            res({ width, height })
        }, (error) => {
            rej(error)
        })
    })
}
const FeedImage = (props: FeedImageProps) => {
    const { image, editable = false, id, onRemove } = props
    const { data: aspectRatio, isLoading, error } = useQuery({
        queryKey: ['aspectRatio:feed', image],
        queryFn: async () => {

                const { width, height } = await getSize(image)
                console.log(width, height)
                return width / height

        },
        initialData: 16 / 9
    })

    if (isLoading) {
        return (
            <View
                position='relative'
                flex={1}
                aspectRatio={16 / 9}
                width={"100%"}
                height={"100%"}
                borderRadius={5}
                overflow='hidden'
            >
                <Spinner />
            </View>
        )
    }

    if (error) return null

    return (
        <View
            position='relative'
            flex={1}
            aspectRatio={aspectRatio}
            width={"100%"}
            height={"100%"}
            borderRadius={5}
            overflow='hidden'
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
                resizeMode='contain'
                source={{ uri: image }}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                aspectRatio={aspectRatio}
            />

        </View>
    )
}

export default memo(FeedImage)