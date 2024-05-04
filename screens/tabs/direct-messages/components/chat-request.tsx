import React from 'react'
import { Inbox } from '../../../../lib/hermes-client/__generated__/graphql'
import delegateManager from '../../../../lib/delegate-manager'
import { GET_MY_PROFILE } from '../../../../utils/queries'
import { useQuery } from '@apollo/client'
import { Avatar, Text, XStack, YStack } from 'tamagui'
import { Utils } from '../../../../utils'
import BaseButton from '../../../../components/ui/buttons/base-button'
import { Check, X } from '@tamagui/lucide-icons'
import hermes from '../../../../contract/modules/hermes'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'

interface Props {
    data: Partial<Inbox>
}

const ChatRequest = (props: Props) => {
    const [loading, setLoading] = React.useState(false)
    const { data } = props
    const address = (data?.owner_address == delegateManager.owner ? data?.initiator_address : data?.owner_address)!
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: address
        }
    })

    const handleApprove = async () => {
        setLoading(true)
        Haptics.selectionAsync()
        const response = await hermes.acceptRequest(address)
        if (response.error) {
            console.log("Something went wrong::", response.error)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please try again later'
            })
            return
        }

        if (response.success) {
            console.log("Hash::", response.data)


        }
        setLoading(false)
    }

    return (
        <XStack w="100%" alignItems='center' flex={1} columnGap={10} >
            <Avatar circular size="$4" >
                <Avatar.Image
                    src={profileQuery?.data?.account?.profile?.pfp ?? Utils.diceImage(address ?? '')}
                />
                <Avatar.Fallback
                    bg="$pink10"
                />
            </Avatar>
            <YStack w="100%" h="100%" borderBottomWidth={1} borderBottomColor={'$sideText'} flex={1} pb={5} >
                <XStack w="100%" alignItems='center' justifyContent='space-between' >
                    <Text
                        fontWeight={'$5'} fontSize={'$sm'}
                    >
                        {profileQuery?.data?.account?.profile?.display_name ?? profileQuery?.data?.account?.username?.username}
                    </Text>
                </XStack>
                <XStack w="100%" alignItems='center' justifyContent='space-between' pr={10} flex={1} >
                    <Text>
                        {
                            data?.initiator_address == delegateManager.owner ? 'You sent a request' : 'You received a request'
                        }
                    </Text>
                    {data?.initiator_address !== delegateManager.owner && <BaseButton loading={loading} onPress={handleApprove} size="$2" type="primary" >
                        <Text>
                            Approve
                        </Text>
                    </BaseButton>}
                </XStack>
            </YStack>
        </XStack>
    )
}

export default ChatRequest