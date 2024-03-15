import { View, Text, Button, Separator, ScrollView, TextArea, Spinner, Avatar, XStack, YStack } from 'tamagui'
import React, { memo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TPUBLICATION, publicationSchema } from '../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../../lib/upload-manager'
import publications from '../../../contract/modules/publications'
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { ImagePlus } from '@tamagui/lucide-icons'
import FeedImage from '../feed/image'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import ChooseCommunityBottomSheet from '../action-sheets/choose-community'
import { Community } from '../../../__generated__/graphql'

interface Props {
    onClose: () => void
    publicationType: 1 | 2 | 3 | 4
    parentPublicationRef?: string
    defaultCommunity?: Partial<Community>
}

const PublicationEditor = (props: Props) => {
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        },
        skip: !delegateManager.owner
    })
    const { onClose, publicationType, parentPublicationRef, defaultCommunity } = props

    const [images, setImages] = useState<Array<ImagePicker.ImagePickerAsset>>([])
    const [uploading, setUploading] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const form = useForm<TPUBLICATION>({
        resolver: zodResolver(publicationSchema),
        defaultValues: {
            community: defaultCommunity?.name,
        }
    })

    const handleChooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // TODO: Add support for videos
            allowsEditing: true,
            quality: 1
        })



        if (!result.canceled) {
            const chosen = result.assets ?? []
            setImages((prev) => {
                return [...prev, ...chosen]
            })
            const existingMedia = form.getValues('media') ?? []

            if (chosen.length > 0) {
                setUploading(true)
                try {
                    const assets = await Promise.all(chosen.map(async (asset) => {
                        const upload = await uploadManager.uploadFile(asset.uri, {
                            type: asset.type,
                            name: asset.fileName ?? "publication-image",
                            size: asset.fileSize ?? 0
                        })
                        return {
                            type: asset.type ?? 'image',
                            url: upload
                        }
                    }))



                    form.setValue('media',
                        [
                            ...existingMedia,
                            ...assets
                        ]
                    )

                }
                catch (e) {
                    // TODO: deal with upload error
                }
                finally {
                    setUploading(false)

                }
            }
        }
    }

    const handlePublish = async (values: TPUBLICATION) => {
        console.log("Values ::", values)
        if (publishing) {
            return
        }
        setPublishing(true)
        try {
            if (publicationType === 1) {
                await publications.createPublication(values)
                // TODO: success message
                setPublishing(false)
                onClose()
                return
            }
            if (parentPublicationRef) {
                await publications.createPublicationWithRef(values, publicationType, parentPublicationRef)
                setPublishing(false)
                onClose()
                // TODO: success toast
            }
        }
        catch (e) {
            console.log('Error publishing', e)
        }
        finally {
            setPublishing(false)
            onClose()
        }
    }
    return (
        <View flex={1} w="100%" h="100%" backgroundColor={"$background"}>
            <View
                flexDirection='row'
                alignItems='center'
                justifyContent='space-between'
                py={5}
                px={10}
            >
                <Button
                    onPress={onClose}
                    w={100} variant='outlined' color={"$text"}>
                    Cancel
                </Button>

                <Button disabled={uploading || publishing}  backgroundColor={(uploading || publishing) ? "$disabledButton" : "$button"} color={"$buttonText"} onPress={form.handleSubmit(handlePublish, console.log)} w={100} >
                    {
                        publishing ? <View flexDirection='row' rowGap={5} >
                            <Text>
                                in a bit..
                            </Text>
                            <Spinner />
                        </View> : (
                            publicationType === 1 ? "Post" :
                                publicationType === 2 ? "Quote" :
                                    publicationType === 3 ? "Reply" :
                                        "Post"
                        )
                    }
                </Button>
            </View>
            <Separator />
            <ScrollView flex={1} w="100%" rowGap={20} px={10} >
                <View rowGap={5} w="100%" h="100%" flexDirection='row' >
                    <View
                        pt={30}
                    >
                        <Avatar circular size={"$3"} >
                            <Avatar.Image
                                src={profileQuery.data?.account?.profile?.pfp as string ?? null}
                                accessibilityLabel="Profile Picture"
                            />
                            <Avatar.Fallback
                                backgroundColor="$pink10"
                            />
                        </Avatar>
                    </View>
                    <View flex={1} h="100%" >
                        <Controller
                            control={form.control}
                            name='content'
                            render={({ field }) => {
                                return (
                                    <TextArea
                                        backgroundColor={"$colorTransparent"}
                                        outlineWidth={0}
                                        borderWidth={0}
                                        placeholder='What is on your mind?'
                                        value={field.value}
                                        onChangeText={field.onChange}
                                    />
                                )

                            }}
                        />
                        <View w="100%" flexDirection='row' flexWrap='wrap' px={20} rowGap={5} columnGap={5} >
                            {
                                images.map((image, index) => {
                                    return (
                                        <View
                                            width={
                                                images.length > 1 ? (
                                                    "40%"
                                                ) : ("80%")
                                            }
                                            key={index}
                                        >
                                            <FeedImage
                                                image={image.uri}
                                                editable
                                                id={index}
                                                onRemove={(id) => {
                                                    console.log('removing', id, index)
                                                    setImages((prev) => {
                                                        return prev.filter((_, i) => i !== id)
                                                    })
                                                }}
                                            />

                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
            <KeyboardAvoidingView
                style={{
                    width: '100%',
                }}
            >

                <YStack>
                    <Separator />
                    <View
                        w="100%"
                        flexDirection='row'
                        justifyContent='space-between'
                        px={20}
                        py={20}
                        bg={'$background'}
                    >
                        <XStack columnGap={20} alignItems='center' >
                            {publicationType == 1 && <ChooseCommunityBottomSheet
                                defaultCommunity={defaultCommunity}
                                onCommunitySelect={(community) => {
                                    if (community.name) {
                                        if (community.name != "home") {
                                            form.setValue("community", community.name)
                                        } else {
                                            console.log("Setting up the community ::", community)
                                            form.setValue("community", undefined)
                                        }
                                    }
                                }}
                            />}
                            <TouchableOpacity
                                onPress={handleChooseImage}
                            >
                                <ImagePlus />
                            </TouchableOpacity>

                        </XStack>
                        {
                            uploading ? <Text>Uploading...</Text> : null
                        }
                    </View>
                </YStack>
            </KeyboardAvoidingView>
        </View>

    )
}

export default memo(PublicationEditor)