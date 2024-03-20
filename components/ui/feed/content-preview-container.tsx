import React, { memo } from 'react'
import { Maybe, Publication } from '../../../__generated__/graphql'
import { YStack, View, Text, XStack, Avatar } from 'tamagui'
import { Dot } from '@tamagui/lucide-icons'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import FeedImage from './image'
import { trim } from 'lodash'
import { Link } from 'expo-router'
dayjs.extend(relativeTime)

interface Props {
    data: Maybe<Publication>
}
const ContentPreviewContainer = (props: Props) => {
    return (
        <Link
            asChild
            href={{
                pathname: '/(tabs)/feed/[post-id]',
                params: {
                    "post-id": props.data?.publication_ref!
                }
            }}
        >
            <YStack p={5} borderRadius={5} borderWidth={1} rowGap={5} borderColor={"gray"} >
                <XStack w="100%" alignItems='center' columnGap={5} >
                    <Avatar circular size={"$1"} >
                        <Avatar.Image src={props.data?.creator?.profile?.pfp as string ?? null} />
                        <Avatar.Fallback backgroundColor={"$pink10"} ></Avatar.Fallback>
                    </Avatar>
                    <XStack flex={1} flexWrap='wrap' columnGap={5} >
                        <Text fontWeight={"bold"} >
                            {props?.data?.creator?.profile?.display_name}
                        </Text>
                        <Text color={"gray"} >
                            @{props?.data?.creator?.username?.username}
                        </Text>
                        <Dot />
                        <Text color={"gray"} >
                            {dayjs(props?.data?.timestamp).fromNow()}
                        </Text>
                    </XStack>
                </XStack>
                <Text w="100%" >
                    {
                        props?.data?.content?.content
                    }
                </Text>
                <View flexDirection="row" flexWrap="wrap" w="100%" columnGap={10} rowGap={10} >
                    {
                        props?.data?.content?.media?.filter((media: Entities.Media) => media?.type?.includes("image"))?.map((media: Entities.Media) => {
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
        </Link>
    )
}

export default memo(ContentPreviewContainer)