import React from 'react'
import { Account } from '../../../../__generated__/graphql'
import { Avatar, XStack, YStack, Text, Button } from 'tamagui'
import { GET_MEMBERSHIP } from '../../../../utils/queries'
import { useQuery } from '@apollo/client'
import delegateManager from '../../../../lib/delegate-manager'
import communityModule from '../../../../contract/modules/community'
interface Props {
    data: Partial<Account>
    community: string
}

const MemberProfile = (props: Props) => {
    const { data, community } = props
    const membership = useQuery(GET_MEMBERSHIP, {
        variables: {
            communityName: community,
            userAddress: data?.address!//We can safely assume
        }
    })

    const handleToggle = async () => {
        try {
            if (membership?.data?.membership?.type == 1) { // host is 1
                await communityModule.removeHost({
                    community_name: community,
                    member_address: data?.address!,
                    member_username: data?.username?.username! //We can safely assume
                })
            } else {
                await communityModule.addHost({
                    community_name: community,
                    member_address: data?.address!,
                    member_username: data?.username?.username! //We can safely assume
                })
            }
        }
        catch (e) {
            console.log("Error: ", e)
        }
    }

    return (
        <XStack w="100%" px={5} py={20} columnGap={10} >
            <Avatar circular >
                <Avatar.Image source={{ uri: data?.profile?.pfp ?? "" }} />
                <Avatar.Fallback bg="$blue1" />
            </Avatar>
            <YStack>
                <Text>{data?.profile?.display_name}</Text>
                <Text fontSize={10} color='lightgray' > @{data.username?.username}</Text>
            </YStack>
            <XStack flex={1} ></XStack>
            {
                delegateManager.owner === data?.address ? <Text>
                    You
                </Text> :
                    <XStack>
                        {
                            membership?.data?.membership?.type == 1 ?
                                <Button onPress={handleToggle} size={'$2'} >
                                    Remove Host
                                </Button> :
                                <Button onPress={handleToggle} size={'$2'} >
                                    Make Host
                                </Button>
                        }
                    </XStack>
            }

        </XStack>
    )
}

export default MemberProfile