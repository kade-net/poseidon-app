import { View, TouchableOpacity, Touchable, KeyboardAvoidingView, Platform, TextInput as RNTextInput, Keyboard } from 'react-native'
import React, { useRef } from 'react'
import { H3, H5, ScrollView, Separator, Spinner, TextArea, XStack, YStack } from 'tamagui'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, GET_PUBLICATION } from '../../utils/queries'
import delegateManager from '../../lib/delegate-manager'
import { Avatar } from 'tamagui'
import BaseAvatar from '../../components/ui/avatar'
import { Text } from 'tamagui'
import BaseButton from '../../components/ui/buttons/base-button'
import { useRouter } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { publicationSchema, TPUBLICATION } from '../../schema'
import HighlightMentions from '../../components/ui/editor/highlight-mentions'
import Highlight from './highlight'
import UserNameSearch from './user-name-search'
import CommunitySearch from './community-search'
import BaseContentSheet from '../../components/ui/action-sheets/base-content-sheet'
import { Image } from '@tamagui/lucide-icons'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../lib/upload-manager'
import FeedImage from '../../components/ui/feed/image'
import publications from '../../contract/modules/publications'
import Toast from 'react-native-toast-message'
import { Utils } from '../../utils'
import ContentPreviewContainer from '../../components/ui/feed/content-preview-container'

interface Props {
    publicationType: number
    parentPublicationRef?: string
    publicationId?: number
    content?: string,
    community?: string
}

const Editor = (props: Props) => {
    const { publicationType, parentPublicationRef, publicationId, community, content } = props

    const textAreaRef = useRef<RNTextInput>(null)
    const [cursorSelection, setCursorSelection] = React.useState({ start: 0, end: 0 })
    const [uploading, setUploading] = React.useState(false)
    const [publishing, setPublishing] = React.useState(false)
    const router = useRouter()
    const profile = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner
        }
    })

    const parentPublication = useQuery(GET_PUBLICATION, {
        variables: {
            id: publicationId
        },
        skip: publicationId === undefined || publicationId === null || publicationId === 0 || Number.isNaN(publicationId)
    })

    const form = useForm<TPUBLICATION>({
        resolver: zodResolver(publicationSchema),
        defaultValues: {
            content: content,
            community: (community?.length ?? 0) > 0 ? community : undefined
        }
    })

    const CONTENT = form.watch('content') || ''
    const CONTENT_LENGTH = CONTENT.length
    const MENTIONS = form.watch('mentions') || {} // TODO: clean up unused mentions before submission

    const CURRENT_MEDIA = form.watch('media') ?? []

    const handleBlur = () => {
        textAreaRef?.current?.blur()
        Keyboard.dismiss()
    }

    const handleSelectImage = async () => {
        Haptics.selectionAsync()
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            selectionLimit: 1,
        })

        if (!result.canceled) {
            const chosen = result.assets ?? []

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

                }
                finally {
                    setUploading(false)
                }
            }
        }
    }

    const handlePublish = async (values: TPUBLICATION) => {
        console.log('Publishing', values, publishing, publicationType)
        Haptics.selectionAsync()
        if (publishing) {
            return
        }
        setPublishing(true)
        try {
            if (publicationType === 1) {
                await publications.createPublication(values)
                // TODO: success message
                setPublishing(false)
                router.back()
                return
            }
            if (parentPublicationRef) {
                await publications.createPublicationWithRef(values, publicationType as any, parentPublicationRef)
                setPublishing(false)
                router.back()
            }
        }
        catch (e) {
            console.log('Error publishing', e)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'There was an error publishing your post'
            })
        }
        finally {
            setPublishing(false)
            // onClose()
        }
    }

    const handleError = (error: any) => {
        console.error('Error publishing', error)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'There was an error publishing your post'
        })
    }

    if (profile.loading) {
        // TODO: custom load components
        return null
    }

    return (
        <YStack flex={1} w="100%" backgroundColor={'$background'} pt={Platform.select({
            ios: 0,
            android: 20
        })} pb={Platform.select({
            ios: 20,
            android: 0
        })} >

            <XStack w="100%" justifyContent='space-between' alignItems='center' p={20} pb={10} >
                <TouchableOpacity onPress={() => {
                    router.back()
                }}>
                    <Text color={'$primary'} fontSize={'$sm'} >Cancel</Text>
                </TouchableOpacity>
                <Text color={'white'} >
                    {
                        publicationType === 1 ? 'New Post' :
                            publicationType === 2 ? 'New Quote' :
                                publicationType === 3 ? 'New Reply' : 'New Post'
                    }
                </Text>
                <BaseButton
                    onPress={form.handleSubmit(handlePublish, handleError)}
                    disabled={CONTENT_LENGTH < 1 || publishing || uploading}
                    rounded='large' size={'$2'} px={20}
                    backgroundColor={
                        (CONTENT_LENGTH < 1 || publishing || uploading) ? '$disabledButton' : '$primary'
                    }
                    alignItems='center'
                    justifyContent='center'
                >
                    {publishing ? <Spinner /> : <Text color={'white'} fontSize={'$3'}  >
                        {
                            publishing ? (
                                'publishing...'
                            ) : (
                                publicationType === 1 ? 'Post' :
                                    publicationType === 2 ? 'Quote' :
                                        publicationType === 3 ? 'Reply' : 'Post'
                            )
                        }
                    </Text>}
                </BaseButton>
            </XStack>
            <Separator borderColor={'$border'} />
            <XStack w="100%" alignItems='center' justifyContent='space-between' p={10} px={20} >
                <XStack alignItems='center' columnGap={10} >
                    <BaseAvatar
                        src={Utils.parseAvatarImage(
                            profile.data?.account?.address ?? '1',
                            profile.data?.account?.profile?.pfp
                        )}
                        size='$md'
                    />
                    {publicationType == 1 && <CommunitySearch handleBlur={handleBlur} form={form} />}
                </XStack>
                <Text color={
                    CONTENT_LENGTH > 280 ? '$red10' : '$sideText'
                } >
                    {CONTENT_LENGTH}/320
                </Text>
            </XStack>

            <KeyboardAvoidingView
                behavior={Platform.select({
                    ios: 'padding',
                    android: undefined
                })}
                style={{ flex: 1, height: '100%' }}
                keyboardVerticalOffset={70}

            >
                <YStack w="100%" p={20} pb={0} pt={5} flex={1} >
                    <XStack w="100%" columnGap={10} >

                        <ScrollView contentContainerStyle={{
                            paddingBottom: 20
                        }} keyboardShouldPersistTaps='handled' flex={1} showsVerticalScrollIndicator  >
                            {
                                parentPublication?.data?.publication &&
                                <XStack w="100%" pb={10} >
                                    <ContentPreviewContainer
                                        flex={1}
                                        // @ts-ignore
                                        data={parentPublication.data.publication}
                                    />
                                </XStack>
                            }
                            <Controller
                                control={form.control}
                                name="content"
                                render={({ field }) => {
                                    return (
                                        <TextArea
                                            ref={textAreaRef}
                                            // flex={1}
                                            onChangeText={v => form.setValue('content', v)}
                                            // onBlur={field.onBlur}
                                            onSelectionChange={(p) => {
                                                setCursorSelection(p.nativeEvent.selection)
                                            }}
                                            maxLength={320}
                                            backgroundColor={'$colorTransparent'}
                                            outlineWidth={0}
                                            borderWidth={0}
                                            placeholder={`What's happening?`}
                                            autoFocus
                                            width={'100%'}
                                            margin={0}
                                            padding={0}
                                            fontSize={20}
                                            fontWeight={'400'}
                                            verticalAlign={Platform.select({
                                                ios: undefined,
                                                android: 'top'
                                            })}
                                        >
                                            <Highlight
                                                content={field.value}
                                                mentions={MENTIONS}
                                            />
                                        </TextArea>

                                    )
                                }}
                            />
                            <UserNameSearch form={form} selection={cursorSelection} />
                            <YStack flex={1} >
                                {
                                    uploading && <XStack w="100%" h="100%" borderWidth={1} borderColor={'$borderColor'} borderRadius={'$5'} aspectRatio={16 / 9} bg="$background" alignItems='center' justifyContent='center' >
                                        <Spinner />
                                    </XStack>
                                }

                                {
                                    CURRENT_MEDIA?.map((media, index) => {
                                        return (
                                            <FeedImage
                                                key={index}
                                                image={media.url}
                                                editable={!uploading}
                                                id={index}
                                                onRemove={(id) => {
                                                    form.setValue('media', CURRENT_MEDIA?.filter((_, i) => i !== id))
                                                }}
                                            />
                                        )
                                    })
                                }
                            </YStack>
                        </ScrollView>
                    </XStack>
                </YStack>
                <XStack px={20} py={5} w="100%" ></XStack>
                <Separator borderColor={'$border'} />
                <XStack w="100%" p={20} alignItems='center' columnGap={10} >
                    <TouchableOpacity disabled={uploading || CURRENT_MEDIA?.length > 0} onPress={handleSelectImage} >
                        <Image color={
                            (uploading || CURRENT_MEDIA?.length > 0) ? '$border' : '$button'
                        } />
                    </TouchableOpacity>
                </XStack>
            </KeyboardAvoidingView>
        </YStack>
    )
}

export default Editor