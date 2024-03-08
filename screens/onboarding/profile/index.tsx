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

const Profile = () => {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const insets = useSafeAreaInsets()

    const router = useRouter()

    const goToNext = () => {
        router.push('/(tabs)/feed/home')
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
        setSubmitting(true)
        let new_file_url = ''
        try {
            const upload_url = await uploadManager.uploadFile(values.pfp, {
                name: image?.fileName ?? 'profile-image',
                size: image?.fileSize ?? 0,
                type: image?.type ?? 'image/png',
            })
            new_file_url = upload_url

            console.log("Upload URL:: ", upload_url)
        }
        catch (e) {
            console.log(`SOMETHING WENT WRONG:: ${e}`)
            setSubmitting(false)
            // TODO: toast error
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
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
        finally {
            setSubmitting(false)
        }
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
            px={20}
        >
            <View>
                <View flexDirection='row' w="100%" justifyContent='space-between' >
                    <Heading size="$8" >
                        Create Profile
                    </Heading>
                    <Button iconAfter={<ChevronRight />} onPress={handleProfileSkip} >
                        Skip
                    </Button>
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
                                        borderColor: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 100,
                                        position: "relative",
                                        overflow: 'hidden'
                                    }} >
                                    <Plus
                                        color="white"
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
                        render={({ field: { onChange, value } }) => {
                            return (
                                <Input
                                    placeholder='Display Name'
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )
                        }}
                    />
                    <Controller
                        control={form.control}
                        name="bio"
                        render={({ field: { onChange, value } }) => {
                            return (
                                <TextArea
                                    placeholder='Tell us about yourself'
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )
                        }}
                    />
                </View>
            </View>

            <Button onPress={form.handleSubmit(handleSubmit)} >
                {
                    submitting ? <View flexDirection='row' columnGap={10} >
                        <Text >
                            Creating...
                        </Text>
                        <Spinner />
                    </View> : "Create Profile"
                }
            </Button>

        </View>
    )
}

export default Profile