import { TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { XStack, View, Text, H4, YStack, Separator, useTheme } from 'tamagui'
import { ArrowLeft, ChevronLeft } from '@tamagui/lucide-icons'
import TopBarWithBack from '../../components/ui/navigation/top-bar-with-back'

const _layout = () => {
    const tamaguiTheme = useTheme()
    return (
        <SafeAreaView
            style={{
                width: '100%',
                height: '100%',
                flex: 1,
                backgroundColor: tamaguiTheme.background.val
            }}
        >
            <Stack >
                <Stack.Screen
                    name="index"
                />
                <Stack.Screen
                    name="create"
                    options={{
                        headerStyle: {
                            backgroundColor: tamaguiTheme.background.val
                        },
                        header(props) {
                            return <TopBarWithBack
                                navigation={props.navigation}
                                title="Create Community"
                            />
                        }
                    }}
                />

            </Stack>
        </SafeAreaView>
    )
}

export default _layout