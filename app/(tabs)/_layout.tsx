import { Bell, Home, Mail, Search, SquareSlash, Users } from '@tamagui/lucide-icons'
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
          tabBarIcon: ({ focused }) => <Home size={focused?30:'unset'} fill={focused?tamaguiTheme.text.val:tamaguiTheme.colorTransparent.val} color={focused?'$background':'$text'} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val,        
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <Search strokeWidth={focused?4:undefined} borderWidth={10} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: ({ focused }) => <SquareSlash size={focused?30:'unset'} fill={focused?tamaguiTheme.text.val:tamaguiTheme.colorTransparent.val} color={focused?'$background':'$text'}/>,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => <Bell fill={focused?tamaguiTheme.text.val:tamaguiTheme.colorTransparent.val} color={tamaguiTheme.text.val}/>,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />


      <Tabs.Screen
        name="direct-messages"
        options={{
          tabBarIcon: ({ focused }) => <Mail size={focused?30:'unset'} fill={focused?tamaguiTheme.text.val:tamaguiTheme.colorTransparent.val} color={focused?'$background':'$text'} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
    </Tabs>
  )
}
