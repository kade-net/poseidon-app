import { View, Text, XStack, Avatar, YStack } from 'tamagui'
import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../../utils/queries'
import { Utils } from '../../../../utils'
import { Inbox } from '../../../../lib/hermes-client/__generated__/graphql'
import delegateManager from '../../../../lib/delegate-manager'
import { TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

interface Props {
    data: Partial<Inbox>
}
const ChatPreview = (props: Props) => {
    const { data } = props
    const address = (data?.owner_address == delegateManager.owner ? data?.initiator_address : data?.owner_address)!
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: address
        }
    })

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
        >
            <TouchableOpacity style={{
                width: "100%"
            }} >
                <XStack w="100%" alignItems='center' columnGap={10} >
                    <Avatar circular size="$4" >
                        <Avatar.Image
                            src={profileQuery?.data?.account?.profile?.pfp ?? Utils.diceImage(address ?? '')}
                        />
                        <Avatar.Fallback
                            bg="$pink10"
                        />
                    </Avatar>
                    <YStack w="100%" h="100%" borderBottomWidth={1} borderBottomColor={'$sideText'} flex={1} >
                        <XStack w="100%" alignItems='center' justifyContent='space-between' >
                            <Text
                                fontWeight={'$5'} fontSize={'$sm'}
                            >
                                {profileQuery?.data?.account?.profile?.display_name ?? profileQuery?.data?.account?.username?.username}
                            </Text>
                        </XStack>
                        {/* // TODO: add month and last item in conversation */}
                    </YStack>
                </XStack>
            </TouchableOpacity>
        </Link>
    )
}

export default ChatPreview