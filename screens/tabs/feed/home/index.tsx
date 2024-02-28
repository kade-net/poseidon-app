import { View, Text, Avatar, Heading, ButtonIcon, useTheme } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Settings } from '@tamagui/lucide-icons'
import { FlatList, TouchableOpacity } from 'react-native'
import { feed } from './data'
import BaseContentContainer from '../../../../components/ui/feed/base-content-container'
const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const Home = () => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()
    return (
        <View flex={1} pt={insets.top} pb={insets.bottom} >
            <View flexDirection='row' pb={10} alignItems='center' justifyContent='space-between' px={20} borderBottomWidth={1} borderBottomColor={'$gray1'} >
                <TouchableOpacity>
                    <Avatar circular  >
                        <Avatar.Image
                            accessibilityLabel='Profile Picture'
                            src={IMAGE}
                        />
                        <Avatar.Fallback
                            backgroundColor={'$pink10'}
                        />
                    </Avatar>
                </TouchableOpacity>
                <Heading size="$6" >
                    Home
                </Heading>
                <TouchableOpacity>
                    <Settings />
                </TouchableOpacity>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={feed}
                CellRendererComponent={({ children }) => {
                    return (
                        <View borderBottomWidth={1} borderBottomColor={'$gray1'} >
                            {children}
                        </View>
                    )
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <BaseContentContainer
                            data={item}
                        />
                    )
                }}
            />

        </View>
    )
}

export default Home