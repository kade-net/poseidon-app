import { View, Text, Button, Separator, ScrollView, TextArea, Spinner, Avatar, XStack, YStack } from 'tamagui'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import { TPUBLICATION, publicationSchema } from '../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../../lib/upload-manager'
import publications from '../../../contract/modules/publications'
import { BackHandler, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native'
import { ImagePlus } from '@tamagui/lucide-icons'
import FeedImage from '../feed/image'
import { useQuery } from '@apollo/client'
import { ACCOUNTS_SEARCH_QUERY, GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import ChooseCommunityBottomSheet from '../action-sheets/choose-community'
import { Community } from '../../../__generated__/graphql'
import UnstyledButton from '../buttons/unstyled-button'
import { Utils } from '../../../utils'
import useDisclosure from '../../hooks/useDisclosure'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import UserMentionsSearch from './user-mentions-search'
import HighlightMentions from './highlight-mentions'
import { uniq } from 'lodash'
import { useFocusEffect } from 'expo-router'

interface Props {
    onClose: () => void
    publicationType: 1 | 2 | 3 | 4
    parentPublicationRef?: string
    defaultCommunity?: Partial<Community>
}



const PublicationEditor = (props: Props) => {
    const [currentMention, setCurrentMention] = useState('')
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        },
        skip: !delegateManager.owner
    })

    const { onClose, publicationType, parentPublicationRef, defaultCommunity } = props
    const { isOpen: userMentionsOpen, onClose: closeUserMentions, onOpen: openUserMentions, onToggle: toggleUserMentions } = useDisclosure()

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
            quality: 1,
            allowsEditing: true
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

    const handleAddMention = (username: string, address: string) => {
        const prevTags = form.getValues('tags') ?? []
        const prevContent = form.getValues('content') ?? ""
        const newTags = uniq([...prevTags, username])
        const lastMention = prevTags?.at(-1)
        const newContent = lastMention ? prevContent.split(`@${lastMention}`)?.at(1) ?? "" : prevContent
        const mention = newContent.match(Utils.mentionRegex)?.at(0)

        if (mention) {
            form.setValue('content', prevContent.replace(mention, `@${username} `))
            form.setValue('tags', newTags)
            const prevMentions = form.getValues('mentions') ?? {}
            form.setValue('mentions', {
                ...prevMentions,
                [username]: address
            })
        }
        closeUserMentions()
    }


    useEffect(() => {
        const subscription = form.watch((watched) => {
            const content = watched.content ?? ""
            const prevTags = watched.tags ?? []
            const lastMention = prevTags?.at(-1)


            const newContent = lastMention ? content.split(`@${lastMention}`)?.at(1) ?? "" : content
            let mention;
            if (newContent.length > 0) {

                mention = newContent.match(Utils.mentionRegex)?.at(0)

                if (mention) {
                    const anythingAfterMention = newContent.split(mention)?.at(1)
                    if (anythingAfterMention && anythingAfterMention?.length > 0) {
                        if (userMentionsOpen) {
                            closeUserMentions()
                        }
                    } else {
                        setCurrentMention(mention)

                        if (!userMentionsOpen) {
                            openUserMentions()
                        }
                    }
                } else {
                    if (userMentionsOpen) {
                        closeUserMentions()
                    }
                }
            } else {
                if (lastMention && !content.includes(`@${lastMention}`)) {
                    const newTags = (prevTags.filter((tag) => tag !== lastMention && tag !== undefined) ?? [])
                    form.setValue('tags', newTags as any)
                    const prevMentions = form.getValues('mentions') ?? {}
                    delete prevMentions[lastMention]
                    form.setValue('mentions', prevMentions)
                }
            }

        })

        return () => {
            subscription.unsubscribe()
        }
    }, [form.watch, userMentionsOpen])

    // back handler
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                onClose()
                return true
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => {
                subscription.remove()
            }
        }, [])
    )

    return (
        <View flex={1} w="100%" h="100%" backgroundColor={"$background"}>
            <View
                flexDirection='row'
                alignItems='center'
                justifyContent='space-between'
                py={5}
                px={10}
            >
                <UnstyledButton callback={onClose} label={'Cancel'}/> 

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
                        pt={Platform.select({
                            ios: 10,
                            android: 30
                        })}
                    >
                        <Avatar circular size={"$3"} >
                            <Avatar.Image
                                src={profileQuery.data?.account?.profile?.pfp as string ?? Utils.diceImage(delegateManager.owner ?? '1')}
                                accessibilityLabel="Profile Picture"
                            />
                            <Avatar.Fallback
                                backgroundColor="$pink10"
                            />
                        </Avatar>
                    </View>
                    <View flex={1} h="100%" >
                        <TextArea
                            backgroundColor={"$colorTransparent"}
                            outlineWidth={0}
                            borderWidth={0}
                            placeholder={`What's on your mind?`}
                            onChangeText={(text) => form.setValue('content', text)}
                        >
                            <HighlightMentions form={form} />
                        </TextArea>
                        {
                            userMentionsOpen &&
                            <KeyboardAvoidingView

                            >
                                <UserMentionsSearch
                                    search={currentMention}
                                    onSelect={handleAddMention}
                                />
                            </KeyboardAvoidingView>
                        }
                        <View w="100%" height={'100%'} flexDirection='row' flexWrap='wrap' px={20} rowGap={5} columnGap={5} >
                            <Controller
                                control={form.control}
                                name='media'
                                render={({ field }) => {
                                    return <>
                                        {
                                            field.value?.map((media, index) => {
                                                return (
                                                    <FeedImage
                                                        key={index}
                                                        image={media.url}
                                                        editable={!uploading}
                                                        id={index}
                                                        onRemove={(id) => {
                                                            form.setValue('media', field.value?.filter((_, i) => i !== id))
                                                        }}
                                                    />
                                                )
                                            })
                                        }
                                    </>
                                }}
                            />
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
                                disabled={uploading || images.length > 0}
                            >
                                <ImagePlus
                                    color={
                                        (uploading || images.length > 0) ? "$disabledButton" : "$blue10"
                                    }
                                />
                            </TouchableOpacity>

                        </XStack>
                        {
                            uploading ? <XStack columnGap={10} >
                                <Spinner />
                                <Text>Uploading...</Text>
                            </XStack> : null
                        }
                    </View>
                </YStack>
            </KeyboardAvoidingView>


        </View>

    )
}

export default memo(PublicationEditor)