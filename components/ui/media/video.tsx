import React, {useRef, useState} from 'react'
import {Spinner, XStack, YStack} from 'tamagui'
import {Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av'
import BaseButton from '../buttons/base-button'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import {Play, PlayCircle} from '@tamagui/lucide-icons'
import {  } from '@tamagui/lucide-icons'

interface P {
    data: { url: string, type: string }
    span?: 1 | 2
}

const VideoViewer = (props: P) => {
    const [status, setStatus] = useState<'playing' | 'loading' | 'idle' | 'pending' | 'paused'>('pending')
    const [loading, setLoading] = useState(false)
    const { data, span = 2 } = props
    const ref = useRef<Video>(null)

    const togglePlay = async () => {
        if (ref.current) {

            return ref.current.playAsync()
        }
    }



    return (
        <YStack flex={1} w="100%" aspectRatio={1} borderRadius={10} overflow='hidden' position='relative' >
            {(
                    status === 'loading' ||
                    status == 'paused' ||
                    status == 'pending'
            ) &&<YStack zIndex={10} flex={1} w={"100%"} h={"100%"} alignItems={'center'} justifyContent={'center'}
                     pos={'absolute'} top={0} left={0}>
                {
                    (status === 'pending' || status == 'paused') ?
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                borderRadius: 100,
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}
                            onPress={togglePlay}
                        >
                            <PlayCircle/>
                        </TouchableOpacity> :
                        status === 'loading' ?
                            <Spinner/> :
                            null

                }
            </YStack>}
            <YStack flex={1} w="100%" h="100%" >
                <TouchableWithoutFeedback  >

                    <Video
                        onPlaybackStatusUpdate={(status)=>{
                            const success = status as AVPlaybackStatusSuccess

                            if((success).didJustFinish){

                                ref.current?.setStatusAsync({positionMillis: 0})
                                return
                            }

                            if(success.isBuffering){
                                setStatus('loading')
                                return
                            }

                            if(success.isPlaying){
                                setStatus('playing')
                                return
                            }

                            if(!success.isPlaying){
                                setStatus('paused')
                                return
                            }


                        }}
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