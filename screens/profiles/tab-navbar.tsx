import { Animated, Platform, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { ScrollManager } from './tabs/common';
import { XStack, Text, useTheme } from 'tamagui';
import { clone } from 'lodash';

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

  const [currentTitle, setCurrentTitle] = useState( props.navigationState.routes[0].title)

  useEffect(() => {
    Animated.timing(TAB_SLIDER_X, {
      toValue: tabLayoutDetails[tabRoutes[currentTabIndex].key]?.x,
      duration: 200,
      useNativeDriver: true
    }).start()
  }, [currentTabIndex])

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
      <XStack
        position='relative'
        w="100%"
        justifyContent='space-between'
        bg={'$background'}
      >
        {
          props.navigationState.routes.map((route, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flex: index == 3 ? undefined : 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {
                  setCurrentTitle(route.title)
                  props.jumpTo(route.key)
                }}
                onLayout={(event) => {
                  const layout = clone(event?.nativeEvent?.layout)

                  setTabLayoutDetails((prev) => {
                    return {
                      ...prev,
                      [route.key]: {
                        width: layout?.width ?? 0,
                        x: layout?.x ?? 0
                      }
                    }
                  })
                }}
              >
                <Text color={currentTitle===route.title?'$text':"$sideText"} fontWeight={"$5"} fontSize={"$xs"} numberOfLines={1} >
                  {route.title}
                </Text>
              </TouchableOpacity>
            )
          })
        }
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            height: 2,
            backgroundColor: tamaguiTheme.sideText.val,
            width: tabLayoutDetails[props.navigationState.routes[currentTabIndex].key]?.width,
            left: 0,
            transform: [
              {
                translateX: TAB_SLIDER_X
              }
            ]
          }}
        />
      </XStack>
    </Animated.View>
  )
}

export default TabNavbar