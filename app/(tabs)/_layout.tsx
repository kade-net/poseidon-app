import { Bell, Home, Mail, Search } from '@tamagui/lucide-icons'
import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'
import { Text } from 'tamagui'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      initialRouteName='feed'
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => <Home />
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <Search />
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => <Bell />
        }}
      />


      <Tabs.Screen
        name="direct-messages"
        options={{
          tabBarIcon: ({ focused }) => <Mail /> 
        }}
      />
    </Tabs>
  )
}
