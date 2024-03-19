import { View, Text, Image } from 'tamagui'
import React, { memo, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { Cross, X } from '@tamagui/lucide-icons'
import { head, isUndefined } from 'lodash'

interface FeedImageProps {
    editable?: boolean
    image: string
    onRemove?: (id: string | number) => void
    id?: string | number
}



const FeedImage = (props: FeedImageProps) => {
    const { image, editable = false, id, onRemove } = props
    const [aspectRatio, setAspectRatio] = React.useState(16 / 9)

    const getSize = async () => {
        return new Promise<{ width: number, height: number }>((res, rej) => {
            Image.getSize(image, (width, height) => {
                res({ width, height })
            }, (error) => {
                rej(error)
            })
        })
    }

    useEffect(() => {
        if (image) {
            getSize().then((size) => {
                // console.log('size', size) 
                const aspectRatio = size.width / size.height
                setAspectRatio(aspectRatio)
            }).catch((error) => {
                // console.log('error', error)
            })
        }
    }, [image])
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