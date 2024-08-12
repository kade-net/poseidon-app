import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SceneRendererProps } from 'react-native-tab-view'
import { useProfileForm } from './contex'
import { H4, XStack, YStack } from 'tamagui'
import { ArrowLeft, CircleUserRound } from '@tamagui/lucide-icons'
import BaseButton from '../../../components/ui/buttons/base-button'
import * as ImagePicker from 'expo-image-picker'
import * as Burnt from 'burnt'
import posti from '../../../lib/posti'
import uploadManager from '../../../lib/upload-manager'

interface Props {
    scene: SceneRendererProps
}

const ProfileImage = (props: Props) => {
    const { scene } = props
    const { form } = useProfileForm()
    const [imageUploading, setImageUploading] = useState(false)
    const [localImage, setLocalImage] = useState<string | null>(null)

    const handleImageSelect = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!granted) {
            Burnt.toast({
                title: 'Permission required',
                message: 'Please allow access to your photos',
                preset: 'error'
            })
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        })

        if (result.canceled) {
            return
        }

        const image = result.assets.at(0)

        if (image) {
            // make sure is below 7mb
            if (image.fileSize && image.fileSize > 7 * 1024 * 1024) {
                Burnt.toast({
                    title: 'Image too large',
                    message: 'Please select a smaller image',
                    preset: 'error'
                })
                return
            }

            setLocalImage(image.uri)

            setImageUploading(true)

            try {
                const url = await uploadManager.uploadFile(image.uri, {
                    name: image?.fileName ?? 'profile-image',
                    type: image?.type ?? 'image/jpeg',
                    size: image?.fileSize ?? 0
                })

                form.setValue('pfp', url)

            } catch (error) {
                posti.capture('ERROR UPLOADING IMAGE', {
                    error,
                    image
                })

                Burnt.toast({
                    title: 'Error uploading image',
                    message: 'Please try again',
                    preset: 'error'
                })
                console.log('ERROR UPLOADING IMAGE::', error)
            }
            finally {
                setImageUploading(false)
            }
        }
    }

    const DISPLAY_NAME = form.watch('display_name')
    const PFP = form.watch('pfp')

    return (
        <YStack flex={1} width={"100%"} height={'100%'} p={20} >
            <TouchableOpacity onPress={() => scene.jumpTo('displayname')} style={{ width: '100%' }} >
                <ArrowLeft />
            </TouchableOpacity>
            <YStack flex={1} width={"100%"} height={'100%'} alignItems='center' justifyContent='center' >
                <YStack alignItems='center' >
                    {DISPLAY_NAME && <H4>
                        Hey {DISPLAY_NAME} 👋
                    </H4>}
                    <H4>
                        let's add an avatar!
                    </H4>
                </YStack>
                <YStack alignItems='center' rowGap={20} >
                    {
                        localImage ?
                            <XStack w="100%" pt={10} >
                                <Image
                                    source={{ uri: localImage }}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: 100
                                    }}
                                />
                            </XStack>
                            : (
                                <CircleUserRound size={'$15'} strokeWidth={0.2} color={'$lightButton'} />
                            )
                    }
                    <XStack>
                        <BaseButton loading={imageUploading} onPress={handleImageSelect} type='text' borderRadius={100} >
                            Upload
                        </BaseButton>
                    </XStack>
                </YStack>
            </YStack>
            <XStack w="100%" alignItems='center' >
                <BaseButton
                    disabled={imageUploading || !PFP}
                    type={
                        imageUploading || !PFP ? 'outlined' : 'primary'
                    }
                    borderRadius={100} w="100%"
                    onPress={() => scene.jumpTo('bio')}
                >
                    Continue
                </BaseButton>
            </XStack>
        </YStack>
    )
}

export default ProfileImage