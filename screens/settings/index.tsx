import { View, Text, YStack, XStack, Separator, H4, Button, Spinner } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { Anchor, ArrowRight, Bell, ChevronRight, KeySquare, Layout, LayoutGrid, Settings2, Trash, Wallet } from '@tamagui/lucide-icons'
import { Link, useFocusEffect, useNavigation, useRouter } from 'expo-router'
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

    useFocusEffect(() => {
        (async () => {
            try {
                const update = await Updates.checkForUpdateAsync();

                if (update.isAvailable) {
                    setUpdatesReady(true)
                } else {
                    setUpdatesReady(false)
                }
            }
            catch (e) {
                posti.capture('error fetching update', {
                    error: e ?? 'Unable to trigger update fetch',
                })
            }
        })();
    })


    const fetchUpdatate = async () => {
        Haptics.selectionAsync()
        setLoading(true)
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error fetching update',
                text2: 'Unable to trigger update fetch',
            })
            posti.capture('error fetching update', {
                error: e ?? 'Unable to trigger update fetch',
            })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <YStack
            w="100%"
            h="100%"
            backgroundColor={"$background"}
        >
            {
                updatesReady ?
                    <TouchableOpacity disabled={loading} onPress={fetchUpdatate}  >
                        <YStack w="100%" >
                            <XStack
                                w="100%"
                                alignItems='center'
                                justifyContent='center'
                                p={5}
                                columnGap={20}
                            >
                                {loading ? <Spinner /> : <>
                                    <LayoutGrid size={'$1'} color={'$primary'} />
                                    <Text
                                        color={'$primary'}
                                    >
                                        New update available, press to update
                                    </Text>
                                </>}
                            </XStack>
                            <Separator />
                        </YStack>
                    </TouchableOpacity>
                    : null
            }
            <YStack w="100%" flex={1} >
                <Link
                    href="/settings/preferences"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <Settings2 />
                                <H4 textTransform='none' >
                                    Preferences
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
                {Platform.OS == 'android' && <Link
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
                </Link>}


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
                                    Delegate Wallet
                                </H4>
                            </XStack>
                            <ChevronRight />
                        </XStack>
                        <Separator />
                    </YStack>
                </Link>
                <Link
                    href="/settings/delete/"
                    asChild
                >
                    <YStack style={{
                        width: "100%",
                    }} >
                        <XStack w="100%" p={20} justifyContent='space-between' >
                            <XStack columnGap={20} >
                                <Trash color={'$red10'} />
                                <H4 textTransform='none' color={'$red10'} >
                                    Delete Account
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
                    Version 0.0.31
                </Text>
            </XStack>
            <XStack w="100%" alignItems='center' justifyContent='center' >
                <Text>
                    Built with ❤️ by Kade.
                </Text>
            </XStack>
            <XStack alignItems='center' justifyContent='center' p={20} >
                <Button onPress={handleLogout} w="100%" backgroundColor={'$button'} color={'$buttonText'} fontSize={"$md"} >
                    {
                        loggingOut ? <XStack columnGap={10} >
                            <Spinner />
                            <Text color={"$buttonText"}>
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