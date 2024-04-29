import { View, Text, Heading, Input, TextArea, Button, Image, Avatar, Spinner } from 'tamagui'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronRight, Plus } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TPROFILE, profileSchema } from '../../../schema'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../../lib/upload-manager'
import account from '../../../contract/modules/account'
import { aptos } from '../../../contract'
import * as SecureStorage from 'expo-secure-store'
import client from '../../../data/apollo'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { Utils } from '../../../utils'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import Toast from 'react-native-toast-message'
import * as Haptics from 'expo-haptics'
import BaseFormInput from '../../../components/ui/input/base-form-input'
import BaseFormTextArea from '../../../components/ui/input/base-form-textarea'

const Profile = () => {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const insets = useSafeAreaInsets()

    const router = useRouter()

    const goToNext = () => {
        router.replace('/onboard/interests/users/')
    }

    const form = useForm<TPROFILE>({
        resolver: zodResolver(profileSchema)
    })

    const addProfileImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (result.canceled) {
            return
        }

        const image = result.assets.at(0)

        if (image) {
            setImage(image)
            form.setValue('pfp', image.uri)
        }

    }

    const handleSubmit = async (values: TPROFILE) => {
        Haptics.selectionAsync()
        setSubmitting(true)
        let new_file_url = ''
        try {
            const upload_url = await uploadManager.uploadFile(values?.pfp!, {
                name: image?.fileName ?? 'profile-image',
                size: image?.fileSize ?? 0,
                type: image?.type ?? 'image/png',
            })
            new_file_url = upload_url

            console.log("Upload URL:: ", upload_url)
        }
        catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            console.log(`SOMETHING WENT WRONG:: ${e}`)
            setSubmitting(false)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to upload image, please try again.'
            })
            return
        }

        try {
            await account.updateProfile({
                display_name: values.display_name,
                bio: values.bio,
                pfp: new_file_url
            })

            goToNext()
        }
        catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update profile, please try again.'
            })
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleError = async () => {
        Toast.show({
            text1: 'Please fill out all fields',
            text2: 'All fields are required',
            type: 'error',
        })
    }

    const handleProfileSkip = async () => {
        SecureStorage.setItem('profile', 'skipped')
        goToNext()
    }

    return (
        <View
            pt={insets.top}
            pb={insets.bottom}
            flex={1}
            justifyContent='space-between'
            px={Utils.dynamicWidth(5)}
            backgroundColor={"$background"}
        >
            <View>
                <View flexDirection='row' w="100%" justifyContent='space-between' alignItems='center'>
                    <Heading size={"$md"} color={"$text"} >
                        Create Profile
                    </Heading>
                    {/* <UnstyledButton label='Skip' icon={<ChevronRight/>} after={true} callback={handleProfileSkip}/> */}
                </View>
                <Controller
                    control={form.control}
                    name="pfp"
                    render={({ field: { value } }) => {
                        return (
                            <View py={30} alignItems='center' justifyContent='center' w="100%" >
                                {!value && <TouchableOpacity onPress={addProfileImage}
                                    style={{
                                        padding: 50,
                                        borderWidth: 1,
                                        borderColor: 'rgb(151,151,156)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 100,
                                        position: "relative",
                                        overflow: 'hidden'
                                    }} >
                                    <Plus
                                        color="rgb(151,151,156)"
                                    />
                                </TouchableOpacity>}
                                {value && <TouchableOpacity onPress={addProfileImage} >
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
                </View>
                        )
                    }}
                />

                <View w="100%" rowGap={10} >
                    <Controller
                        control={form.control}
                        name="display_name"
                        render={({ field: { onChange, value }, fieldState }) => {
                            return (
                                <BaseFormInput
                                    backgroundColor={"$colorTransparent"}
                                    placeholder='Display Name'
                                    value={value}
                                    onChangeText={onChange}
                                    maxLength={20}
                                    invalid={fieldState?.invalid}
                                    error={fieldState?.error?.message}
                                />
                            )
                        }}
                    />
                    <Controller
                        control={form.control}
                        name="bio"
                        render={({ field: { onChange, value }, fieldState }) => {
                            return (
                                <BaseFormTextArea
                                    backgroundColor={"$colorTransparent"}
                                    placeholder='Tell us about yourself'
                                    value={value}
                                    onChangeText={onChange}
                                    maxLength={50}
                                    invalid={fieldState?.invalid}
                                    error={fieldState?.error?.message}
                                />

                            )
                        }}
                    />
                </View>
            </View>

            <Button disabled={submitting} onPress={form.handleSubmit(handleSubmit, handleError)} backgroundColor={"$button"} color={"$buttonText"} marginBottom={Utils.dynamicHeight(5)} fontSize={"$sm"}>
                {
                    submitting ? <View flexDirection='row' columnGap={10} >
                        <Spinner />
                        <Text fontSize={"$sm"} >
                            Creating...
                        </Text>
                    </View> : "Create Profile"
                }
            </Button>

        </View>
    )
}

export default Profile