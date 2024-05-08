import { View, Text, YStack, XStack, Separator, H4, Button, Spinner } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Anchor, ArrowRight, Bell, ChevronRight, KeySquare, Wallet } from '@tamagui/lucide-icons'
import { Link, useNavigation, useRouter } from 'expo-router'
import account from '../../contract/modules/account'
import delegateManager from '../../lib/delegate-manager'
import localStore from '../../lib/local-store'
import { Utils } from '../../utils'
import notifications from '../../lib/notifications'
import * as Haptics from 'expo-haptics'
import * as Updates from 'expo-updates'
import posti from '../../lib/posti'
import Toast from 'react-native-toast-message'

const Settings = () => {
    const [updatesReady, setUpdatesReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const router = useRouter()
    const navigation = useNavigation()
    const handleLogout = async () => {
        Haptics.selectionAsync()
        setLoggingOut(true)
        try { 
            await account.nuke()//💥
            await delegateManager.nuke() //💥
            await localStore.nuke() //💥
            await notifications.nukeNotifications() //💥

            navigation.reset({
                index: 0,
                // @ts-expect-error - TS doesn't know about the `routes` property
                routes: [{ name: 'onboard', path: '/' }]
            })
        }
        catch (e) {
            console.log("Error logging out", e)
        }
        finally {
            setLoggingOut(false)
        }
    }

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const update = await Updates.checkForUpdateAsync();

    //             if (update.isAvailable) {
    //                 setUpdatesReady(true)
    //             } else {
    //                 setUpdatesReady(false)
    //             }
    //         }
    //         catch (e) {
    //             posti.capture('error fetching update', {
    //                 error: e ?? 'Unable to trigger update fetch',
    //             })
    //         }
    //     })();
    // }, [])


    // const fetchUpdatate = async () => {
    //     Haptics.selectionAsync()
    //     setLoading(true)
    //     try {
    //         const update = await Updates.checkForUpdateAsync();

    //         if (update.isAvailable) {
    //             await Updates.fetchUpdateAsync();
    //             await Updates.reloadAsync();
    //         }
    //     }
    //     catch (e) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Error fetching update',
    //             text2: 'Unable to trigger update fetch',
    //         })
    //         posti.capture('error fetching update', {
    //             error: e ?? 'Unable to trigger update fetch',
    //         })
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // }

    return (
        <YStack
            w="100%"
            h="100%"
            py={Utils.dynamicWidth(5)}
            backgroundColor={"$background"}
        >
            <YStack w="100%" flex={1} >
                <Link
                    href="/settings/anchors"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <Anchor />
                                <H4 textTransform='none' >
                                    Anchors
                                </H4>
                            </XStack>
                            <ChevronRight />
                        </XStack>
                        <Separator />
                    </YStack>
                </Link>
                <Link
                    href="/settings/codes"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <KeySquare />
                                <H4 textTransform='none' >
                                    Recovery Phrase
                                </H4>
                            </XStack>
                            <ChevronRight />
                        </XStack>
                        <Separator />
                    </YStack>
                </Link>
                <Link
                    href="/settings/notifications"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <Bell />
                                <H4 textTransform='none' >
                                    Notifications
                                </H4>
                            </XStack>
                            <ChevronRight />
                        </XStack>
                        <Separator />
                    </YStack>
                </Link>
                <Link
                    href="/settings/connect"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <Bell />
                                <H4 textTransform='none' >
                                    Connect
                                </H4>
                            </XStack>
                            <ChevronRight />
                        </XStack>
                        <Separator />
                    </YStack>
                </Link>
                <Link
                    href="/settings/wallet/"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <Wallet />
                                <H4 textTransform='none' >
                                    Wallet
                                </H4>
                            </XStack>
                            <ChevronRight />
                        </XStack>
                        <Separator />
                    </YStack>
                </Link>
            </YStack>
            <XStack w="100%" alignItems='center' justifyContent='center' >
                <Text>
                    Version 0.0.21
                </Text>
            </XStack>
            <XStack alignItems='center' justifyContent='center' p={20} >
                <Button onPress={handleLogout} w="100%" backgroundColor={'$button'} color={'$buttonText'} fontSize={"$md"} >
                    {
                        loggingOut ? <XStack columnGap={10} >
                            <Spinner />
                            <Text>
                                Logging out
                            </Text>
                        </XStack> : "Log out"
                    }
                </Button>
            </XStack>
        </YStack>
    )
}

export default Settings