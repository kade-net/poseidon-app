import { TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { XStack, View, Text, H4, YStack, Separator } from 'tamagui'
import { ArrowLeft, ChevronLeft } from '@tamagui/lucide-icons'

const _layout = () => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: '100%',
                height: '100%'
            }}
        >
            <Stack >
                <Stack.Screen
                    name="index"
                />
                <Stack.Screen
                    name="create"
                    options={{
                        header(props) {
                            return (
                                <YStack w="100%" >
                                    <TouchableOpacity onPress={props.navigation.goBack} style={{ width: '100%' }} >
                                        <XStack
                                            w="100%"
                                            columnGap={10}
                                            alignItems='center'
                                            py={5}
                                        >
                                            <ArrowLeft />
                                            <H4 textTransform='none' >
                                                Create Community
                                            </H4>
                                        </XStack>
                                    </TouchableOpacity>
                                </YStack>
                            )
                        }
                    }}
                />

            </Stack>
        </SafeAreaView>
    )
}

export default _layout