import { View, Text, Heading, Avatar, Separator } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { ArrowLeft, Dot, MoreHorizontal } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import { GET_POST } from '../../../../utils/queries'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostDetailStats from './post-detail-stats'
import FeedImage from '../../../../components/ui/feed/image'
dayjs.extend(relativeTime)

interface Props {
    id: string
}

const PostDetail = (props: Props) => {
    const { id } = props
    const postQuery = useQuery(GET_POST, {
        variables: {
            postId: parseInt(id)
        }
    })
    const router = useRouter()

    const goBack = () => {
        router.back()
    }

    return (
        <View flex={1} w="100%" height={"100%"} px={10} justifyContent='flex-start' >
            <View w="100%" flexDirection='row' alignItems='center' columnGap={50} mb={20} >
                <TouchableOpacity onPress={goBack} >
                    <ArrowLeft />
                </TouchableOpacity>
                <Heading
                    size={"$6"}
                >
                    Post
                </Heading>
            </View>
            <View w="100%">

                <View w="100%" flexDirection='row' justifyContent='space-between' >
                    <View
                        flexDirection='row'
                        columnGap={10}
                    >
                        <Avatar circular  >
                            <Avatar.Image
                                accessibilityLabel='Profile Picture'
                                src={postQuery?.data?.publication?.creator?.profile?.pfp as string}
                            />
                            <Avatar.Fallback
                                backgroundColor={'$pink10'}
                            />
                        </Avatar>
                        <View>
                            <Text fontWeight={"900"} >
                                {postQuery?.data?.publication?.creator?.profile?.display_name}
                            </Text>
                            <View flexDirection='row' alignItems='center' columnGap={1} >

                                <Text fontSize={"$3"} color={"$gray11"} >
                                    @{postQuery?.data?.publication?.creator?.username?.username}
                                </Text>
                                <Dot
                                    color={'$gray11'}
                                />
                                <Text fontSize={"$3"} color={"$gray11"} >
                                    {
                                        dayjs(postQuery?.data?.publication?.timestamp).fromNow()
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <MoreHorizontal />
                    </TouchableOpacity>
                </View>
                <View w="100%" py={10} >
                    <Text
                        mb={
                            ((postQuery?.data?.publication?.content?.media?.length ?? 0) > 0) ? 20 : 0
                        }
                    >
                        {postQuery?.data?.publication?.content?.content}
                    </Text>
                    <View flexDirection="row" flexWrap="wrap" w="100%" columnGap={10} rowGap={10} >
                        {
                            postQuery?.data?.publication?.content?.media?.filter((media: Entities.Media) => media?.type?.includes("image"))?.map((media: Entities.Media) => {
                                return (
                                    <FeedImage
                                        image={media?.url}
                                        key={media?.url}
                                    />
                                )
                            })
                        }
                    </View>
                </View>

                <Separator />
                <PostDetailStats
                    stats={postQuery?.data?.publication?.stats ?? null}
                    publication_id={postQuery?.data?.publication?.id ?? 0}
                />
                <Separator />

            </View>
        </View>
    )
}

export default PostDetail