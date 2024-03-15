import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { H4, XStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const _layout = () => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%"
            }}
        >
            <Stack>
                <Stack.Screen options={{
                    header(props) {
                        return (
                            <TouchableOpacity onPress={props.navigation.goBack} >
                                <XStack w="100%" alignItems='center' px={20} columnGap={20} >
                                    <ArrowLeft />
                                    <H4 textTransform='none' >Anchors</H4>
                                </XStack>
                            </TouchableOpacity>
                        )
                    },
                }} name="store" />
            </Stack>
        </SafeAreaView>
    )
}

export default _layout