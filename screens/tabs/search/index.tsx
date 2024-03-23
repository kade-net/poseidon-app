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
import { SlideTab } from '../../../components/ui/tabs'

const Search = () => {
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })
    const insets = useSafeAreaInsets()

    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('People')
    const handleActiveTab = (tab: string) => {
        setSearch('')
        setActiveTab(tab)
    }

    return (
        <View pt={insets.top} pb={insets.bottom + 60} flex={1} backgroundColor={"$background"}>
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
                        value={search}
                    />
                </View>
            </View>
            <SlideTab.Root
                onActiveTab={handleActiveTab}
            >
                <SlideTab.Section label='People'>
                    {activeTab == 'People' && <PeopleSearch
                            search={search ?? ''}
                    />}
                </SlideTab.Section> 
                <SlideTab.Section label='Communities'>
                    {activeTab == 'Communities' && <CommunitiesSearch
                        search={search ?? ''}
                    />}
                </SlideTab.Section>
            </SlideTab.Root>
        </View>
    )
}

export default Search