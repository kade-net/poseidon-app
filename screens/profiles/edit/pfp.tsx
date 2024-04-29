import { TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import client from '../../../data/apollo'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Controller, useForm } from 'react-hook-form'
import { TPROFILE, profileSchema } from '../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { values } from 'lodash'
import account from '../../../contract/modules/account'
import { Avatar, Button, Spinner, TextArea, XStack, YStack, View, Text } from 'tamagui'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../../lib/upload-manager'
import { Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Utils } from '../../../utils'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'
import BaseButton from '../../../components/ui/buttons/base-button'

const Pfp = () => {
    const [saving, setSaving] = React.useState(false)
    const [uploading, setUploading] = useState(false)
    const profile = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })

    const router = useRouter()

    const form = useForm<TPROFILE>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: profile?.data?.account?.profile?.bio ?? undefined,
            display_name: profile?.data?.account?.profile?.display_name ?? undefined,
            pfp: profile?.data?.account?.profile?.pfp ?? ''
        }
    })

    const handleSubmit = async (values: TPROFILE) => {
        Haptics.selectionAsync()
        setSaving(true)

        try {
            await account.updateProfile(values)
            router.back()
        }
        catch (e) {
            console.log(`Something went wrong: ${e}`)
        }
        finally {
            setSaving(false)
        }
    }

    const addImage = async () => {
        Haptics.selectionAsync()
        setUploading(true)
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (result.canceled) {
            setUploading(false)
            return
        }

        const image = result.assets.at(0)

        if (image) {
            try {
                const upload = await uploadManager.uploadFile(image.uri, {
                    type: image.type,
                    name: image.fileName ?? "community-image",
                    size: image.fileSize
                })

                form.setValue('pfp', upload)

            }
            catch (e) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Unable to upload image. Please try again.'

                })
                console.log("Something went wrong::", e)
            }
            finally {
                setUploading(false)
            }
        }
    }


    return (
        <YStack flex={1} w="100%" h="100%" px={Utils.dynamicWidth(5)} justifyContent='space-between' backgroundColor={"$background"}>
            <YStack flex={1} w="100%" alignItems='center' rowGap={20} >

                <Controller
                    control={form.control}
                    name="pfp"
                    render={({ field: { value } }) => {
                        return (
                            <View py={30} alignItems='center' justifyContent='center' w="100%" >

                                {!value && <TouchableOpacity onPress={addImage}
                                    style={{
                                        padding: 50,
                                        borderWidth: 1,
                                        borderColor: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 100,
                                        position: "relative",
                                        overflow: 'hidden'
                                    }} >
                                    {!uploading && <Plus
                                        color="white"
                                    />}
                                    {
                                        uploading && <Spinner />
                                    }
                                </TouchableOpacity>}
                                <XStack alignItems='flex-end' >
                                    {value && <TouchableOpacity onPress={addImage} >
                                        <Avatar
                                            size={"$10"}
                                            circular
                                        >
                                            <Avatar.Image source={{ uri: value }} />
                                            <Avatar.Fallback
                                                bg="lightgray"

                                            />
                                        </Avatar>
                                    </TouchableOpacity>}
                                    <TouchableOpacity onPress={addImage} >
                                        <XStack borderRadius={20} padding={2} borderWidth={1} borderColor={'$borderColor'}  >
                                            <Plus size='$1' color={'$borderColor'} />
                                        </XStack>
                                    </TouchableOpacity>

                                </XStack>


                            </View>
                        )
                    }}
                />
                {
                    uploading && <XStack columnGap={10} >
                        <Spinner />
                        <Text>Uploading...</Text>
                    </XStack>
                }
            </YStack>
            <BaseButton
                loading={saving}
                onPress={form.handleSubmit(handleSubmit)}
                disabled={saving || uploading}
            >
                <Text>
                    Save Changes
                </Text>
            </BaseButton>
        </YStack>
    )
}

export default Pfp