import React, { useMemo } from 'react'
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
import ephemeralCache from '../../../../lib/local-store/ephemeral-cache'

interface Props {
    data: Partial<Inbox>
}

const ChatRequest = (props: Props) => {
    const [loading, setLoading] = React.useState(false)
    const { data } = props

    const doesCacheSayActive = useMemo(() => {
        if (data?.id) {
            const cached = ephemeralCache.get(data.id) as boolean
            return cached ?? false
        }
        return false
    }, [data.id])

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
        <XStack w="100%" alignItems='center' mb={5} flex={1} columnGap={10} pb={5} borderColor={"$sideText"} borderBottomWidth={0.5}>
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
            <YStack w="100%" h="100%"  borderBottomColor={'$sideText'} flex={1}  >
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
                    
                </XStack>
            </YStack>
            <YStack>
                {data?.initiator_address !== delegateManager.owner && <BaseButton loading={loading} onPress={handleApprove} size="$2" type="primary" >
                        <Text color={"white"}>
                            Approve
                        </Text>
                </BaseButton>}
            </YStack>
        </XStack>
    )
}

export default ChatRequest