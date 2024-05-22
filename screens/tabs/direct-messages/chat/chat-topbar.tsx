import { View, Text, XStack, H4, Avatar, YStack } from 'tamagui'
import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../../utils/queries'
import { TouchableOpacity } from 'react-native'
import { ArrowLeft, Settings } from '@tamagui/lucide-icons'
import { Utils } from '../../../../utils'

interface Props {
    navigation: NavigationProp<any>
}

const ChatTopBar = (props: Props) => {
    const { navigation } = props
    const params = useLocalSearchParams()
    const inbox_name = params.inbox_name as string
    const other_user = params.other_user as string

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: other_user
        }
    })

    return (
        <XStack w="100%" backgroundColor={'$background'} py={10} alignItems='center' justifyContent='space-between' borderBottomWidth={1} borderBottomColor={'$borderColor'} px={20} >
            <TouchableOpacity
                onPress={navigation.goBack}
            >
                <XStack alignItems='center' columnGap={20} >
                    <ArrowLeft />
                    <XStack columnGap={10} >
                        <Avatar circular size="$3" >
                            <Avatar.Image src={
                                // profileQuery?.data?.account?.profile?.pfp ?? Utils.diceImage(other_user ?? '1')
                                Utils.parseAvatarImage(other_user ?? '1', profileQuery?.data?.account?.profile?.pfp)
                            } />
                            <Avatar.Fallback
                                backgroundColor={'$pink10'}
                            />
                        </Avatar>
                        <YStack>
                            <Text>
                                {profileQuery?.data?.account?.profile?.display_name ?? ''}
                            </Text>
                            <Text color={'$sideText'} >
                                {profileQuery?.data?.account?.username?.username ?? ''}
                            </Text>
                        </YStack>
                    </XStack>
                </XStack>
            </TouchableOpacity>

            {/* <Settings /> */}
        </XStack>
    )
}

export default ChatTopBar