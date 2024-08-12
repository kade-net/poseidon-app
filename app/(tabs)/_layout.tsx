import { Bell, Home, Mail, Search, SquareSlash, Squircle, Users } from '@tamagui/lucide-icons'
import { Link, Tabs } from 'expo-router'
import { useState } from 'react'
import { Pressable, useColorScheme } from 'react-native'
import { Text, useTheme } from 'tamagui'

export default function TabLayout() {
  const tamaguiTheme = useTheme()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      initialRouteName='feed'
      sceneContainerStyle={
        [
          {
            backgroundColor : tamaguiTheme.background.val
          }
        ]
      }
      
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => <Home size={focused ? 30 : 'unset'} fill={focused ? tamaguiTheme.primary.val : tamaguiTheme.colorTransparent.val} color={focused ? '$background' : '$text'} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val,        
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <Search color={focused ? '$primary' : undefined} strokeWidth={focused ? 4 : undefined} borderWidth={10} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
      <Tabs.Screen
        name="portals"
        options={{
          tabBarIcon: ({ focused }) => <Squircle size={focused ? 30 : 'unset'} fill={focused ? tamaguiTheme.primary.val : tamaguiTheme.colorTransparent.val} color={focused ? '$background' : '$text'} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor: tamaguiTheme.background.val
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => <Bell strokeWidth={focused ? 3 : undefined} fill={tamaguiTheme.colorTransparent.val} color={focused ? '$primary' : tamaguiTheme.text.val} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />


      {/* <Tabs.Screen
        name="direct-messages"
        options={{
          tabBarIcon: ({ focused }) => <Mail size={focused ? 30 : 'unset'} fill={focused ? tamaguiTheme.primary.val : tamaguiTheme.colorTransparent.val} color={focused ? '$background' : '$text'} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      /> */}
    </Tabs>
  )
}
