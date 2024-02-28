import { View, Text, Avatar, Input, Separator, Tabs, SizableText, Heading } from 'tamagui'
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ProfileCard from '../../../components/ui/profile/profile-card'
import { profiles } from './data'
const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const Search = () => {
    const insets = useSafeAreaInsets()
    return (
        <View pt={insets.top} pb={insets.bottom} flex={1}  >
            <View
                flexDirection='row'
                alignItems='center'
                columnGap={20}
                px={20}
                pb={20}
            >
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
                <View
                    flex={1}
                >
                    <Input
                        placeholder='Search'
                    />
                </View>
            </View>
            <Tabs flexDirection='column' orientation='horizontal' defaultValue='people' flex={1} width="100%" height="100%" >
                <Tabs.List disablePassBorderRadius="bottom" w="100%" >
                    <Tabs.Tab flex={1} value='people' >
                        <SizableText size="$3" >
                            People
                        </SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab flex={1} value='communities' >
                        <SizableText size="$3" >
                            Communities
                        </SizableText>
                    </Tabs.Tab>
                </Tabs.List>
                <Separator w="100%" />
                <Tabs.Content value='people' >

                    <FlatList
                        data={profiles}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View>

                                    <ProfileCard
                                        {...item}
                                    />
                                    <Separator w="100%" />
                                </View>
                            )
                        }}
                    />
                </Tabs.Content>
                <Tabs.Content value='communities' >
                    <View flex={1} justifyContent='center' alignItems='center' >
                        <Heading size="$5" >
                            Still cooking!
                        </Heading>
                    </View>
                </Tabs.Content>
            </Tabs>
        </View>
    )
}

export default Search