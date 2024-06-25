import { View, Text, Spinner, YStack, XStack } from 'tamagui'
import React, { memo, useEffect, useState } from 'react'
import { Dimensions, Image, TouchableOpacity } from 'react-native'
import { Cross, ImageDown, X } from '@tamagui/lucide-icons'
import { head, isUndefined } from 'lodash'
import { useQuery } from 'react-query'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import useDisclosure from '../../hooks/useDisclosure'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'
import uploadManager from '../../../lib/upload-manager'

interface FeedImageProps {
    editable?: boolean
    image: string
    onRemove?: (id: string | number) => void
    id?: string | number
}

const DEVICE_HEIGHT = Dimensions.get('screen').height
const DEVICE_WIDTH = Dimensions.get('screen').width - 40
const IMAGE_HEIGHT_THRESHOLD = DEVICE_HEIGHT * 0.5


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
    const { onOpen, onToggle, isOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const insets = useSafeAreaInsets()
    const { data: aspectRatio, isLoading, error } = useQuery({
        queryKey: ['aspectRatio:feed', image],
        queryFn: async () => {

            const { width, height } = await getSize(image)
            const aspect_ratio = width / height

            const DISPLAY_HEIGHT = DEVICE_WIDTH / aspect_ratio

            return {
                aspect_ratio,
                width,
                height,
                is_large: DISPLAY_HEIGHT > IMAGE_HEIGHT_THRESHOLD
            }

        },
    })


    const handleDownloadImage = async () => {
        Haptics.selectionAsync()
        setLoading(true)
        try {
            await uploadManager.downloadFile(image)
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to download image',
            })
        }
        finally {
            setLoading(false)
        }
    }

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

    if (!aspectRatio) return null

    return (
        <View
            position='relative'
            flex={1}
            aspectRatio={aspectRatio?.is_large ? undefined : aspectRatio?.aspect_ratio}
            width={"100%"}
            height={aspectRatio?.is_large ? IMAGE_HEIGHT_THRESHOLD : "100%"}
            borderRadius={5}
            overflow='hidden'
            borderWidth={editable ? 1 : undefined}
            borderColor={editable ? '$borderColor' : undefined}
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
            <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => {
                console.log("Open")
                onOpen()
            }} >
                <Image
                    resizeMode={
                        aspectRatio?.is_large ? 'cover' : 'contain'
                    }
                    source={{ uri: image }}
                    style={{
                        width: '100%',
                        height: '100%',
                        aspectRatio: aspectRatio?.is_large ? undefined : aspectRatio?.aspect_ratio
                    }}
                />

            </TouchableOpacity>

            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                level={10}
            >

                <YStack pt={insets.top} pb={insets.bottom} flex={1} w="100%" h="100%" >
                    <XStack
                        w="100%"
                        px={20}
                        justifyContent='space-between'
                    >
                        <TouchableOpacity onPress={onClose}>
                            <X />
                        </TouchableOpacity>
                        {
                            loading ? <Spinner /> :
                                <TouchableOpacity onPress={handleDownloadImage} >
                                    <ImageDown />
                                </TouchableOpacity>
                        }
                    </XStack>
                    <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
                        <Image
                            resizeMode='contain'
                            source={{ uri: image }}
                            style={{
                                width: '100%',
                                height: '100%',
                                // aspectRatio: aspectRatio
                            }}
                            // aspectRatio={aspectRatio}
                        />
                    </YStack>

                </YStack>
            </BaseContentSheet>

        </View>
    )
}

export default memo(FeedImage)