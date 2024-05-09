import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { H4, XStack, useTheme } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBarWithBack from '../../components/ui/navigation/top-bar-with-back'

const _layout = () => {
    const tamaguiTheme = useTheme()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: tamaguiTheme.background.val
            }}
        >
            <Stack>
                <Stack.Screen options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Purchase Anchors'
                        />
                    },
                }} name="store" />
            </Stack>
        </SafeAreaView>
    )
}

export default _layout