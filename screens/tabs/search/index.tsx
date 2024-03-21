import { View, Text, Avatar, Input, Separator, Tabs, SizableText, Heading } from 'tamagui'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ProfileCard from '../../../components/ui/profile/profile-card'
import { profiles } from './data'
import PeopleSearch from './tabs/people'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { useQuery } from '@apollo/client'
import delegateManager from '../../../lib/delegate-manager'
import { Link } from 'expo-router'
import CommunitiesSearch from './tabs/communities'
import { Utils } from '../../../utils'


const Search = () => {
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })
    const insets = useSafeAreaInsets()

    const [search, setSearch] = useState('')
    return (
        <View pt={insets.top} pb={insets.bottom} flex={1} backgroundColor={"$background"}>
            <View
                flexDirection='row'
                alignItems='center'
                columnGap={20}
                px={Utils.dynamicWidth(5)}
                pb={20}
            >
                <Link asChild href={{
                    pathname: '/profiles/[address]/',
                    params: {
                        address: delegateManager.owner!
                    }
                }}>

                    <Avatar circular  >
                        <Avatar.Image
                            accessibilityLabel='Profile Picture'
                            src={profileQuery?.data?.account?.profile?.pfp ?? ""}
                            alt='Profile Picture'
                        />
                        <Avatar.Fallback
                            backgroundColor={'$pink10'}
                        />
                    </Avatar>
                </Link>

                <View
                    flex={1}
                >
                    <Input
                        fontWeight={"$2"}
                        backgroundColor={"$colorTransparent"}
                        onChangeText={setSearch}
                        placeholder='Search'
                    />
                </View>
            </View>
            <Tabs flexDirection='column' orientation='horizontal' defaultValue='people' flex={1} width="100%" height="100%" >
                <Tabs.List disablePassBorderRadius="bottom" w="100%" >
                    <Tabs.Tab tabIndex={"people"} flex={1} value='people' >
                        <Text fontWeight={"$5"} fontSize={"$md"}>
                            People
                        </Text>
                    </Tabs.Tab>
                    <Tabs.Tab tabIndex={"communities"} flex={1} value='communities' >
                        <Text fontWeight={"$5"} fontSize={"$md"}>
                            Communities
                        </Text>
                    </Tabs.Tab>
                </Tabs.List>
                <Separator w="100%" />
                <Tabs.Content tabIndex={"people"} value='people' py={5} >
                    <PeopleSearch
                        search={search ?? ''}
                    />

                </Tabs.Content>
                <Tabs.Content tabIndex={"communities"} value='communities' >
                    <CommunitiesSearch
                        search={search ?? ''}
                    />
                </Tabs.Content>
            </Tabs>
        </View>
    )
}

export default Search