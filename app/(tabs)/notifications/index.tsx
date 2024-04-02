import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Notifications from '../../../screens/tabs/notifications'
import { Link, Stack } from 'expo-router'
import { Avatar, Separator, XStack, YStack } from 'tamagui'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Settings } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Utils } from '../../../utils'

const NotificationsScreen = () => {
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header(props) {
                        return (
                            <YStack backgroundColor={'$background'} w="100%" >
                                <XStack w="100%" px={20} pb={20} alignItems='center' justifyContent='space-between' >
                                    <Link
                                        href={{
                                            pathname: '/profiles/[address]/',
                                            params: {
                                                address: delegateManager.owner!
                                            }
                                        }}
                                        asChild
                                    >
                                        <TouchableOpacity>
                                            <Avatar circular size={"$4"} >
                                                <Avatar.Image src={profileQuery?.data?.account?.profile?.pfp ?? Utils.diceImage(profileQuery?.data?.account?.address ?? '1')} />
                                                <Avatar.Fallback bg="$pink10" />
                                            </Avatar>
                                        </TouchableOpacity>
                                    </Link>

                                    <Link
                                        href={{
                                            pathname: '/settings/notifications'
                                        }}
                                        asChild
                                    >
                                        <TouchableOpacity>
                                            <Settings />
                                        </TouchableOpacity>
                                    </Link>
                                </XStack>
                                <Separator />
                            </YStack>
                        )
                    }
                }}
            />
            <Notifications />
        </>
    )
}

export default NotificationsScreen