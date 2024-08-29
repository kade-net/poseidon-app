import React, { useRef } from 'react'
import { XStack, YStack } from 'tamagui'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import BaseButton from '../buttons/base-button'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Play } from '@tamagui/lucide-icons'

interface P {
    data: { url: string, type: string }
    span?: 1 | 2
}

const VideoViewer = (props: P) => {
    const [avPlayBackStatus, setAvPlayBackS] = React.useState<AVPlaybackStatus | null>(null)
    const { data, span = 2 } = props
    const ref = useRef<Video>(null)

    const togglePlay = () => {
        if (ref.current) {
            ref.current.playAsync()
        }
    }



    return (
        <YStack flex={1} w="100%" aspectRatio={1} borderRadius={10} overflow='hidden' position='relative' >
            <YStack flex={1} w="100%" h="100%" >
                <TouchableWithoutFeedback  >

                    <Video
                        ref={ref}
                        source={{
                            uri: data.url
                        }}
                        style={{
                            flex: 1
                        }}
                        resizeMode={ResizeMode.COVER}
                        useNativeControls
                    />
                </TouchableWithoutFeedback>
            </YStack>
        </YStack>
    )
}

export default VideoViewer