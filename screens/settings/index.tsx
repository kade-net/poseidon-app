import { View, Text, YStack, XStack, Separator, H4, Button, Spinner } from 'tamagui'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Anchor, ArrowRight, Bell, ChevronRight, KeySquare } from '@tamagui/lucide-icons'
import { Link, useRouter } from 'expo-router'
import account from '../../contract/modules/account'
import delegateManager from '../../lib/delegate-manager'
import localStore from '../../lib/local-store'

const Settings = () => {
    const [loggingOut, setLoggingOut] = useState(false)
    const router = useRouter()
    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await account.nuke()//💥
            await delegateManager.nuke() //💥
            await localStore.nuke() //💥
            router.push('/')
        }
        catch (e) {
            console.log("Error logging out", e)
        }
        finally {
            setLoggingOut(false)
        }
    }

    return (
        <YStack
            w="100%"
            h="100%"
            py={20}
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
            </YStack>
            <XStack alignItems='center' justifyContent='center' p={20} >
                <Button onPress={handleLogout} w="100%" backgroundColor={'$button'} color={'$buttonText'} >
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