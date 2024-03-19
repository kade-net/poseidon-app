import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { H5, H4, Separator, XStack, useTheme } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Utils } from '../../utils'

const _layout = () => {
    const tamaguiTheme = useTheme()
    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: tamaguiTheme.background.val
            }}
        >

            <Stack
            >

                <Stack.Screen
                    name="index"
                    options={{
                        header(props) {
                            return (
                                <TouchableOpacity onPress={handleBack} >
                                    <XStack w="100%" alignItems='center' py={Utils.dynamicHeight(2)} columnGap={20} px={Utils.dynamicWidth(3)} backgroundColor={"$background"}>
                                        <ArrowLeft />
                                        <H4 fontFamily={"$heading"} textTransform='none' >Settings</H4>
                                    </XStack>
                                    <Separator />
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
                <Stack.Screen
                    name="anchors"
                    options={{
                        header(props) {
                            return (
                                <TouchableOpacity onPress={handleBack} >
                                    <XStack w="100%" alignItems='center' p={20} columnGap={20} backgroundColor={"$background"}>
                                        <ArrowLeft />
                                        <H5 fontFamily={'$body'} textTransform='none'>Anchors</H5>
                                    </XStack>
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
                <Stack.Screen
                    name="codes"
                    options={{
                        header(props) {
                            return (
                                <TouchableOpacity onPress={handleBack} >
                                    <XStack w="100%" alignItems='center' p={20} columnGap={20} backgroundColor={"$background"}>
                                        <ArrowLeft />
                                        <H5 fontFamily={'$body'} textTransform='none' >Account Details</H5>
                                    </XStack>
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
                <Stack.Screen
                    name="notifications"
                    options={{
                        header(props) {
                            return (
                                <TouchableOpacity onPress={handleBack} >
                                    <XStack w="100%" alignItems='center' p={20} columnGap={20} >
                                        <ArrowLeft />
                                        <H5 fontFamily={'$body'} textTransform='none' >Notifications</H5>
                                    </XStack>
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
            </Stack>
        </SafeAreaView>
    )
}

export default _layout