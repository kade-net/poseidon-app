import { View, Text, YStack, Avatar, Input, TextArea, Spinner, Button, XStack, ScrollView, useTheme } from 'tamagui'
import React, { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Plus } from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../../../lib/upload-manager'
import { COMMUNITY, communitySchema } from '../../../../schema'
import { values } from 'lodash'
import community from '../../../../contract/modules/community'
import { useRouter } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const CreateCommunity = () => {
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const form = useForm<COMMUNITY>({
        resolver: zodResolver(communitySchema)
    })

    const tamaguiTheme = useTheme()

    const addProfileImage = async () => {
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

                form.setValue('image', upload)

            }
            catch (e) {
                console.log("Something went wrong::", e)
            }
            finally {
                setUploading(false)
            }
        }
        setUploading(false)
    }


    const handleSubmit = async (values: COMMUNITY) => {
        setLoading(true)
        try {
            await community.createCommunity(values)
            form.reset()
            router.push('/(tabs)/communities/')
        }
        catch (e) {
            console.log("Error creating community::", e)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <View w="100%" height={"100%"}  alignItems='center' justifyContent='space-between' p={20} backgroundColor={"$background"} >
            <YStack w="100%" rowGap={20} alignItems='center'>
                <YStack w="100%" rowGap={20} alignItems='center' px={20} >
                    <Controller
                        control={form.control}
                        name="image"
                        render={({ field: { value } }) => {
                            return (
                                <View py={2} alignItems='center' justifyContent='center' w="100%" >

                                    {!value && <TouchableOpacity onPress={addProfileImage}
                                        style={{
                                            padding: 50,
                                            borderWidth: 1,
                                            borderColor: tamaguiTheme.text.val,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 100,
                                            position: "relative",
                                            overflow: 'hidden'
                                        }} >
                                        {!uploading && <Plus
                                            color="$text"
                                        />}
                                        {
                                            uploading && <Spinner />
                                        }
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
                    {uploading && <XStack columnGap={20} >
                        <Spinner />
                        <Text>
                            Uploading...
                        </Text>
                    </XStack>}
                </YStack>

                <View w="100%" rowGap={10} >
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field: { onChange, value }, fieldState }) => {
                            return (
                                <YStack w="100%" >
                                    <Input
                                        backgroundColor={"$colorTransparent"}
                                        placeholder='What do you want to call your community?'
                                        value={value}
                                        onChangeText={onChange}
                                        autoCapitalize='none'
                                    />
                                    {
                                        fieldState.invalid &&
                                        <Text
                                            color={"$red10"}
                                            fontSize={"$xs"}
                                        >
                                            Please Enter a valid community name all lowercase, no space or special character.
                                        </Text>
                                    }
                                </YStack>
                            )
                        }}
                    />
                    <Controller
                        control={form.control}
                        name="description"
                        render={({ field: { onChange, value }, fieldState }) => {
                            return (
                                <YStack>
                                    <TextArea
                                        backgroundColor={"$colorTransparent"}
                                        placeholder='Why should people join your community?'
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {
                                        fieldState.invalid &&
                                        <Text
                                            color={"$red10"}
                                            fontSize={"$xs"}
                                        >
                                            Enter a description for your community.
                                        </Text>
                                    }
                                </YStack>
                            )
                        }}
                    />
                </View>
            </YStack>
            <Button backgroundColor={"$button"} color={"$buttonText"} fontSize={"$sm"} onPress={form.handleSubmit(handleSubmit)} w="100%" >
                {
                    loading ? <View flexDirection='row' rowGap={5} >
                        <Text fontSize={"$sm"}>
                            Creating..
                        </Text>
                        <Spinner />
                    </View> : "Create"
                }
            </Button>
        </View>
    )
}

export default CreateCommunity