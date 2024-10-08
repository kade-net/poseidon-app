import { View, Text, XStack, Avatar, YStack, SizableText } from 'tamagui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../../utils/queries'
import { Utils } from '../../../../utils'
import { Inbox } from '../../../../lib/hermes-client/__generated__/graphql'
import delegateManager from '../../../../lib/delegate-manager'
import { TouchableOpacity } from 'react-native'
import { Link, useFocusEffect } from 'expo-router'
import hermes from '../../../../contract/modules/hermes'
import { MESSAGE } from '../../../../contract/modules/hermes/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { queryClient } from '../../../../data/query'
import { isArray } from 'lodash'
import { useQuery as uzQuery } from 'react-query'
dayjs.extend(relativeTime)

interface Props {
    data: Partial<Inbox>
}
const ChatPreview = (props: Props) => {
    const { data } = props
    const address = (data?.owner_address == delegateManager.owner ? data?.initiator_address : data?.owner_address)!
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: address
        },
        fetchPolicy: 'cache-and-network'
    })

    const { data: lastMessage, refetch: refetchLastMessage, isFetching, isLoading } = uzQuery({
        queryKey: ['chatLastMessage', data.id],
        queryFn: () => hermes.getLastMessage(data.id!, address),
        enabled: !!data.id,
        refetchOnMount: true,
    })

    useFocusEffect(useCallback(() => {
        if (data.id) {
            refetchLastMessage()
        }
    }, []))


    return (
        <Link
            asChild
            // @ts-ignore
            href={{
                pathname: `/(tabs)/direct-messages/[inbox_name]/chat?other_user=${address}`,
                params: {
                    'inbox_name': data?.id!,
                }
            }}
            style={{ 
                marginBottom:10
             }}
        >
            <TouchableOpacity style={{
                width: "100%"
            }} >
                <XStack w="100%" alignItems='center' columnGap={10} >
                    <Avatar circular size="$4" >
                        <Avatar.Image
                            src={
                                // profileQuery?.data?.account?.profile?.pfp ?? Utils.diceImage(address ?? '')
                                Utils.parseAvatarImage(address ?? '', profileQuery?.data?.account?.profile?.pfp ?? null)
                            }
                        />
                        <Avatar.Fallback
                            bg="$pink10"
                        />
                    </Avatar>
                    <YStack w="100%" h="100%"  flex={1} rowGap={5} >
                        <XStack w="100%" alignItems='center' justifyContent='space-between' >
                            <Text
                                fontWeight={'$5'} fontSize={'$sm'}
                            >
                                {profileQuery?.data?.account?.profile?.display_name ?? profileQuery?.data?.account?.username?.username}
                            </Text>
                            {lastMessage && <Text fontSize={'$xs'} color={'$sideText'} >
                                {dayjs(lastMessage?.timestamp).fromNow()}
                            </Text>}
                        </XStack>
                        <SizableText width={"100%"}  color={"$sideText"} fontSize={"$xs"} ellipse={true} >
                            {lastMessage?.isMine ? 'you:' : ""}{"  "}{lastMessage?.content}
                        </SizableText>
                        {/* <Text w="100%" fontSize={'$xxs'} color={'$sideText'} >
                        </Text> */}
                    </YStack>
                </XStack>
            </TouchableOpacity>
        </Link>
    )
}

export default ChatPreview