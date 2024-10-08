import { View, Text, XStack, YStack, Avatar } from 'tamagui'
import React from 'react'
import { Notification } from '../../../__generated__/graphql'
import { Heart, MessageSquare, Quote, Repeat, UserPlus } from '@tamagui/lucide-icons'
import { trim, truncate } from 'lodash'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import notifications from "../../../lib/notifications";
import {useQuery} from "react-query";
import {Utils} from "../../../utils";

dayjs.extend(relativeTime)


interface Props {
    data: Notification
}


const LikeNotificationContent = (props: Props) => {
    return (
        <YStack w="100%" rowGap={5} >

            <Avatar circular size={"$3"} >
                <Avatar.Image src={Utils.parseAvatarImage('1', props.data?.reaction?.creator?.profile?.pfp)} />
                <Avatar.Fallback bg="$pink10" />
            </Avatar>
            <Text >
                {props.data?.reaction?.creator?.profile?.display_name} liked your post
            </Text>
            <Text color="gray" >
                {truncate(props?.data?.reaction?.publication?.content?.content, {
                    length: 50,
                    omission: '...'
                })}
            </Text>
        </YStack>
    )
}


const FollowNotificationContent = (props: Props) => {
    return (
        <YStack w="100%" rowGap={5} >
            <Avatar circular size={"$3"} >
                <Avatar.Image src={Utils.parseAvatarImage('1', props.data?.follow?.follower?.profile?.pfp)} />
                <Avatar.Fallback bg="$pink10" />
            </Avatar>
            <Text >
                {props.data?.follow?.follower?.profile?.display_name} followed you
            </Text>
        </YStack>
    )
}

const CommentNotificationContent = (props: Props) => {
    return (
        <YStack w="100%" rowGap={5} >
            <Avatar circular size={"$3"} >
                <Avatar.Image src={Utils.parseAvatarImage('1',props.data?.publication?.creator?.profile?.pfp)} />
                <Avatar.Fallback bg="$pink10" />
            </Avatar>
            <Text >
                {props.data?.publication?.creator?.profile?.display_name} commented on your post
            </Text>
            <Text color="gray" >
                {truncate(props?.data?.publication?.content?.content, {
                    length: 50,
                    omission: '...'
                })}
            </Text>
        </YStack>
    )

}

const RepostNotificationContent = (props: Props) => {
    return (
        <YStack w="100%" rowGap={5} >
            <Avatar circular size={"$3"} >
                <Avatar.Image src={Utils.parseAvatarImage('1', props.data?.publication?.creator?.profile?.pfp)} />
                <Avatar.Fallback bg="$pink10" />
            </Avatar>
            <Text >
                {props.data?.publication?.creator?.profile?.display_name} reposted your post
            </Text>
            <Text color="gray" >
                {truncate(props?.data?.publication?.parent?.content?.content, {
                    length: 50,
                    omission: '...'
                })}
            </Text>
        </YStack>
    )

}

const QuoteNotificationContent = (props: Props) => {
    return (
        <YStack w="100%" rowGap={5} >
            <Avatar circular size={"$3"} >
                <Avatar.Image src={Utils.parseAvatarImage('1',props.data?.publication?.creator?.profile?.pfp)} />
                <Avatar.Fallback bg="$pink10" />
            </Avatar>
            <Text >
                {props.data?.publication?.creator?.profile?.display_name} quoted your post
            </Text>
            <Text color="gray" >
                {truncate(props?.data?.publication?.content?.content, {
                    length: 50,
                    omission: '...'
                })}
            </Text>
        </YStack>
    )

}


const BaseNotificationContent = (props: Props) => {

    const notificationCounter = useQuery({
        queryKey: ['new-notification-counter'],
        queryFn: async ()=> {
            try {
                const counter = await notifications.getNotificationCounter("posts")
                return counter
            }
            catch (error) {
                return null
            }
        }
    })

    const { data } = props
    const type = data?.type ?? 1

    const router = useRouter()

    const handleSelect = () => {
        if (type == 1) {
            router.push({
                pathname: '/profiles/[address]/',
                params: {
                    address: data?.follow?.follower?.address!
                }
            })
        }

        if (type == 2) {
            const publication_type = data?.publication?.type

            if (publication_type == 4) return null

            router.push({
                pathname: '/(tabs)/feed/[post-id]/',
                params: {
                    'post-id':
                        publication_type == 2 ? data?.publication?.publication_ref! :
                            data?.publication?.parent?.publication_ref!
                }

            })
        }

        if (type == 3) {

            console.log("Ref::", data)
            router.push({
                pathname: '/(tabs)/feed/[post-id]/',
                params: {
                    'post-id': data?.reaction?.publication?.publication_ref!
                }
            })
        }
    }

    const isNew = notificationCounter.data ? notificationCounter.data?.lastRead < data.timestamp : false

    return (
        <TouchableOpacity
            onPress={handleSelect}
            disabled={type == 2 && data?.publication?.type == 4}
        >
            <XStack
                backgroundColor={isNew ? '$lightButton'  : undefined}
                w="100%" columnGap={10} py={20} px={10}  >
                <YStack h="100%" >
                    {
                        type == 1 ?
                            <XStack borderRadius={40} p={5} alignItems='center' justifyContent='center' backgroundColor={'$yellow5'} >
                                <UserPlus size={16} />
                            </XStack>
                            :
                            type == 2 ?
                                <XStack borderRadius={40} p={5} backgroundColor={
                                    data?.publication?.type == 2 ? '$orange10' :
                                        data?.publication?.type == 3 ? '$blue10' :
                                            data?.publication?.type == 4 ? '$green10' : undefined
                                } >
                                    {
                                        data?.publication?.type == 2 ? <Quote size={16} /> :
                                            data?.publication?.type == 3 ? <MessageSquare size={16} /> :
                                                data?.publication?.type == 4 ? <Repeat size={16} /> :
                                                    null
                                    }
                                </XStack>
                                :
                                type == 3 ?
                                    <XStack borderRadius={40} p={5} alignItems='center' justifyContent='center' backgroundColor={'$red10'} >
                                        <Heart size={16} />
                                    </XStack> :
                                    null
                    }
                </YStack>
                <YStack flex={1} w="100%" rowGap={5} >
                    {
                        type == 1 ? <FollowNotificationContent data={data} /> :
                            type == 2 ? (
                                data?.publication?.type == 2 ? <QuoteNotificationContent data={data} /> :
                                    data?.publication?.type == 3 ? <CommentNotificationContent data={data} /> :
                                        data?.publication?.type == 4 ? <RepostNotificationContent data={data} /> :
                                            null
                            ) :
                                type == 3 ? <LikeNotificationContent data={data} /> : null
                    }
                    <Text
                        color={'$sideText'}
                    >
                        {
                            dayjs(data?.timestamp).fromNow()
                        }
                    </Text>
                </YStack>
            </XStack>
        </TouchableOpacity>
    )
}

export default BaseNotificationContent