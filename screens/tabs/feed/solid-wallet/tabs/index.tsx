import { TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Separator, Text, XStack, YStack } from 'tamagui'
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view'
import { SceneProps } from '../../../../profiles/tabs/common'
import AssetsTab from './assets'
import RevenueTab from './revenue'
import TransactionsTab from './transactions'

const WalletTabs = () => {
    const [routes] = useState([
        {
            key: 'assets',
            title: 'Assets'
        },
        {
            key: 'revenue',
            title: 'Revenue'
        },
        // {
        //     key: 'transactions',
        //     title: 'Transactions'
        // }
    ])
    const [currentTabIndex, setCurrentTabIndex] = useState(0)

    const renderTabBar = useCallback((props: SceneRendererProps & {
        navigationState: NavigationState<{ key: string, title: string }>
    }) => {
        const { navigationState: { routes, index }, jumpTo } = props
        return (
            <XStack w="100%" alignItems='center' py={10} >
                {
                    routes.map((route, idx) => {
                        return (
                            <TouchableOpacity key={route.key} onPress={() => {
                                jumpTo(route.key)
                            }} >
                                <YStack px={10} py={5} alignItems='center'  >
                                    <Text
                                        color={idx === index ? '$primary' : '$sideText'}
                                    >{route.title}</Text>
                                </YStack>
                                <Separator
                                    w="100%"
                                    borderColor={idx === index ? '$primary' : '$border'}
                                />
                            </TouchableOpacity>
                        )
                    })
                }
            </XStack>
        )

    }, [])

    const renderScene = useCallback((props: SceneProps) => {
        const { route } = props

        switch (route.key) {
            case 'assets': {
                return <AssetsTab {...props} />
            };
            case 'revenue': {
                return <RevenueTab {...props} />
            };
            // case 'transactions': {
            //     return <TransactionsTab {...props} />
            // };
            default: {
                return null
            }
        }
    }, [currentTabIndex])



    return (
        <YStack flex={1} w="100%" >
            <TabView
                swipeEnabled={false}
                navigationState={{
                    index: currentTabIndex,
                    routes
                }}
                animationEnabled={false}
                onIndexChange={setCurrentTabIndex}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
            />
        </YStack>
    )
}

export default WalletTabs