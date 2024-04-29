import { View, Text, Avatar, Input, Separator, Tabs, SizableText, Heading, useTheme, YStack } from 'tamagui'
import React, { useCallback, useContext, useState } from 'react'
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
import { SceneProps } from '../../profiles/tabs/common'
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view'
import SearchTopBar from './top-bar'
import searchContext from './context'

const _Search = () => {
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })
    const theme = useTheme()


    const [currentTabIndex, setCurrentTabIndex] = useState(0)

    const handleCurrentTabIndexChange = (index: number) => {
        setCurrentTabIndex(index)
    }

    const [tabRoutes] = useState([
        {
            key: 'people',
            title: 'People'
        },
        {
            key: 'communities',
            title: 'Communities'
        }
    ])

    const renderScene = useCallback((props: SceneProps) => {
        const { route } = props

        switch (route.key) {
            case 'people':
                return <PeopleSearch />
            case 'communities':
                return <CommunitiesSearch />
            default:
                return <></>
        }
    }, [currentTabIndex])

    const renderTabBar = useCallback((props: SceneRendererProps & {
        navigationState: NavigationState<{
            key: string;
            title: string;
        }>;
    }) => {
        return <SearchTopBar
            currentIndex={currentTabIndex}
            routes={tabRoutes}
            {...props}
        />
    }, [])

    return (
        <YStack flex={1} w="100%" h="100%" backgroundColor={"$background"}>
            <TabView
                navigationState={{
                    index: currentTabIndex,
                    routes: tabRoutes
                }}
                style={
                    [
                        {
                            backgroundColor: theme.background.val,
                            flex: 1,
                            width: '100%',
                            height: '100%'
                        }
                    ]
                }
                sceneContainerStyle={{
                    width: '100%',
                    height: '100%',
                    flex: 1
                }}
                onIndexChange={handleCurrentTabIndexChange}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
            />
        </YStack>
    )
}

function Search() {
    const [search, setSearch] = useState('')
    return <searchContext.Provider
        value={{
            search,
            setSearch
        }}
    >
        <_Search />
    </searchContext.Provider>
}

export default Search