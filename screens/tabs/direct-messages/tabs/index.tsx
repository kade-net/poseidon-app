import { View, Text, YStack, useTheme } from 'tamagui'
import React, { useCallback, useState } from 'react'
import { SceneProps } from '../../../profiles/tabs/common'
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view'
import DirectMessageTopBar from './top-bar'
import ActiveDMs from './active'
import PendingDMs from './pending'
import IncomingDMs from './incoming'

const DMTabs = () => {
  const theme = useTheme()
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabRoutes] = useState([
    {
      key: 'active',
      title: 'Active'
    },
    {
      key: 'incoming',
      title: 'Incoming Requests'
    },
    {
      key: 'pending',
      title: 'Pending Requests'
    }
  ])

  const handleCurrentTabIndexChange = (index: number) => {
    setCurrentTabIndex(index)
  }

  const renderScene = useCallback((props: SceneProps) => {
    const { route } = props

    switch (route.key) {
      case 'active': {
        return <ActiveDMs />
      };
      case 'incoming': {
        return <IncomingDMs />
      };
      case 'pending': {
        return <PendingDMs />
      };
      default: {
        return <></>
      }
    }
  }, [currentTabIndex])

  const renderTabBar = useCallback((props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string, title: string }>
  }) => {
    return <DirectMessageTopBar
      currentIndex={currentTabIndex}
      routes={tabRoutes}
      {...props}
    />
  }, [])

  return (
    <YStack w="100%" h="100%" flex={1} >
      <TabView
        navigationState={{
          index: currentTabIndex,
          routes: tabRoutes
        }}
        animationEnabled={false}
        style={{
          backgroundColor: theme.background.val,
          flex: 1,
          width: '100%',
          height: '100%'
        }}
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

export default DMTabs