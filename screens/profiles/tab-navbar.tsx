import { Animated, Platform, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { ScrollManager } from './tabs/common';
import { XStack, Text, useTheme, ScrollView } from 'tamagui';
import { clone } from 'lodash';
import BaseButton from '../../components/ui/buttons/base-button';

interface Props extends SceneRendererProps {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>
  topSectionHeight: number
  scrollManager: ScrollManager
  currentTabIndex: number
  tabRoutes: {
    key: string;
    title: string;
  }[]
}

const TabNavbar = (props: Props) => {
  const { topSectionHeight, scrollManager, currentTabIndex, tabRoutes, ...rest } = props
  const [tabLayoutDetails, setTabLayoutDetails] = useState({} as { [key: string]: { width: number, x: number } })

  const TAB_SLIDER_X = useRef(new Animated.Value(0)).current

  const tamaguiTheme = useTheme()


  const TabOffset = useMemo(() => {
    return Platform.OS === 'ios' ? topSectionHeight : 0
  }, [topSectionHeight])
  const translateTabBar = scrollManager.scrollY.interpolate({
    inputRange: [TabOffset, TabOffset + topSectionHeight],
    outputRange: [topSectionHeight, 0],
    extrapolate: 'clamp'
  })
  return (
    <Animated.View
      style={{
        width: '100%',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 4,
        elevation: 4,
        transform: [
          {
            translateY: translateTabBar
          }
        ]
      }}
    >
      <ScrollView
        w="100%"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <XStack
          position='relative'
          w="100%"
          px={10}
          pb={20}
          justifyContent='flex-start'
          bg={'$background'}
          columnGap={20}
        >
          {
            props.navigationState.routes.map((route, index) => {
              const is_active = currentTabIndex == index 
              return (

                <BaseButton
                  key={index}
                  size={'$3'}
                  rounded='large'
                  type={
                    "outlined"
                  }
                  backgroundColor={!is_active ? '#071E22' : undefined}
                  onPress={() => {
                    props.jumpTo(route.key)
                  }}
                >
                  {route.title}
                </BaseButton>

              )
            })
          }
        </XStack>
      </ScrollView>
    </Animated.View>
  )
}

export default TabNavbar