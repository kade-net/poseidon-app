import { View, Text, YStack, XStack, Avatar, Separator, TextArea, Spinner } from 'tamagui'
import React, { memo, useMemo } from 'react'
import { Publication } from '../../../__generated__/graphql'
import { Utils } from '../../../utils'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Dot } from '@tamagui/lucide-icons'
import ContentHighlightMentions from '../feed/highlight-mentions'
import LinkResolver from '../feed/link-resolver'
import FeedImage from '../feed/image'
import { Controller, UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import HighlightMentions from './highlight-mentions'
import { KeyboardAvoidingView, Platform } from 'react-native'
import UserMentionsSearch from './user-mentions-search'
dayjs.extend(relativeTime)

interface PostReplyTextEditorProps {
    publication: Partial<Publication> | null
    form: UseFormReturn<TPUBLICATION, any, TPUBLICATION>
    userMentionsOpen: boolean
    currentMention: string
    onSelect: (username: string, address: string) => void
    uploading?: boolean
    onImageRemove: (id: number | string) => void
}

const PostReplyTextEditor = (props: PostReplyTextEditorProps) => {
    const { publication, form, userMentionsOpen, currentMention, onSelect, onImageRemove, uploading } = props
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })

    const contentLinks = useMemo(() => {
        return Utils.extractLinks(publication?.content?.content ?? "") ?? []

    }, [, publication?.content?.content])

    const HAS_LONG_DISPLAY_NAME = (publication?.creator?.profile?.display_name?.length ?? 0) > 10
    const HAS_LONG_USERNAME = (publication?.creator?.username?.username?.length ?? 0) > 10


    return (
        <YStack
            py={20}
            flex={1}
            width={'100%'}
        >
            <XStack flex={1} columnGap={5} width={"100%"}>
                <YStack
                    alignItems='center'
                    justifyContent='flex-start'
                >
                    {/* Avatar */}
                    <Avatar circular size={'$3'} >
                        <Avatar.Image
                            src={publication?.creator?.profile?.pfp ?? Utils.diceImage(publication?.creator?.address! ?? '1')}
                            accessibilityLabel='Profile Picture'
                        />
                        <Avatar.Fallback
                            backgroundColor="$pink10"
                        />
                    </Avatar>

                    <YStack width={1} height={'100%'} bg='$borderColor' ></YStack>
                </YStack>
                <YStack rowGap={5} pr={20} width={'100%'} >
                    <View w="100%" flex={1}
                        flexDirection={
                            HAS_LONG_DISPLAY_NAME || HAS_LONG_USERNAME ? 'column' : 'row'
                        }
                        alignItems={
                            HAS_LONG_DISPLAY_NAME || HAS_LONG_USERNAME ? 'flex-start' : 'center'
                        }
                        columnGap={2}
                    >
                        <XStack alignItems="center" columnGap={2} >
                            <Text fontSize={"$sm"} fontWeight={"$5"}>
                                {
                                    HAS_LONG_DISPLAY_NAME ?
                                        `${publication?.creator?.profile?.display_name?.slice(0, 10)}...` :
                                        publication?.creator?.profile?.display_name
                                }
                            </Text>
                            <Text color={'$sideText'} fontSize={"$sm"}>
                                @{
                                    HAS_LONG_USERNAME ?
                                        `${publication?.creator?.username?.username.slice(0, 10)}...` :
                                        publication?.creator?.username?.username
                                }
                            </Text>
                        </XStack>
                        {(!HAS_LONG_DISPLAY_NAME && !HAS_LONG_USERNAME) && <Dot color={'$sideText'} />}
                        <Text fontSize={'$sm'} color={'$sideText'} >
                            {dayjs(publication?.timestamp).fromNow()}
                        </Text>
                    </View>
                    <YStack w="100%" >

                        <Text color={"$text"}>
                            <ContentHighlightMentions
                                content={publication?.content?.content ?? ''}
                                tags={publication?.content?.tags}
                                mentions={publication?.content?.mentions}
                            />
                        </Text>
                        {/* {
                            contentLinks?.map((link, i) => {
                                return (
                                    <LinkResolver
                                        link={link}
                                        key={i}
                                    />
                                )
                            })
                        } */}
                        <View flexDirection="row" flexWrap="wrap" w="100%" columnGap={10} rowGap={10} >
                            {
                                publication?.content?.media?.filter((media: Entities.Media) => media?.type?.includes("image"))?.map((media: Entities.Media) => {
                                    return (
                                        <FeedImage
                                            image={media?.url}
                                            key={media?.url}
                                        />
                                    )
                                })
                            }
                        </View>
                    </YStack>
                </YStack>
            </XStack>
            <XStack columnGap={5} pt={20} >
                <YStack position='relative'
                    pt={Platform.select({
                        ios: 0,
                        android: 30
                    })}
                >
                    {/* <YStack
                        pos={'absolute'}
                        backgroundColor={'$borderColor'}
                        width={1}
                        height={40}
                        top={-40}
                        left={'50%'}
                        transform={[
                            { translateX: -2 }
                        ]}
                    /> */}
                    <Avatar

                        circular size={'$3'} >
                        <Avatar.Image
                            src={profileQuery.data?.account?.profile?.pfp ?? Utils.diceImage(profileQuery.data?.account?.address! ?? '1')}
                            accessibilityLabel='Profile Picture'

                        />
                        <Avatar.Fallback
                            backgroundColor="$pink10"
                        />
                    </Avatar>
                </YStack>
                <YStack flex={1} width={'100%'} >
                    <TextArea
                        backgroundColor={"$colorTransparent"}
                        outlineWidth={0}
                        borderWidth={0}
                        placeholder={`What's on your mind?`}
                        onChangeText={(text) => form.setValue('content', text)}
                        autoFocus
                        maxLength={320}
                    >
                        <HighlightMentions form={form} />
                    </TextArea>
                    {
                        userMentionsOpen &&
                        <UserMentionsSearch
                            search={currentMention}
                            onSelect={onSelect}
                        />
                    }
                    <View w="100%" height={'100%'} flexDirection='row' flexWrap='wrap' px={20} rowGap={5} columnGap={5} >
                        <Controller
                            control={form.control}
                            name='media'
                            render={({ field }) => {
                                if (uploading) return (
                                    <XStack w="100%" h="100%" borderWidth={1} borderColor={'$borderColor'} borderRadius={'$5'} aspectRatio={16 / 9} bg="$background" alignItems='center' justifyContent='center' >
                                        <Spinner />
                                    </XStack>
                                )
                                return <>
                                    {
                                        field.value?.map((media, index) => {
                                            return (
                                                <FeedImage
                                                    key={index}
                                                    image={media.url}
                                                    editable={!uploading}
                                                    id={index}
                                                    onRemove={onImageRemove}
                                                />
                                            )
                                        })
                                    }
                                </>
                            }}
                        />
                    </View>
                </YStack>
            </XStack>
        </YStack>
    )
}

export default memo(PostReplyTextEditor)