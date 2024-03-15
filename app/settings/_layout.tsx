import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { H4, Separator, XStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const _layout = () => {
    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%"
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
                                    <XStack w="100%" alignItems='center' px={20} columnGap={20} >
                                        <ArrowLeft />
                                        <H4 textTransform='none' >Settings</H4>
                                    </XStack>
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
                                    <XStack w="100%" alignItems='center' px={20} columnGap={20} >
                                        <ArrowLeft />
                                        <H4 textTransform='none' >Anchors</H4>
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