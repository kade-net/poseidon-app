import { Bell, Home, Mail, Search, SquareSlash, Users } from '@tamagui/lucide-icons'
import { Link, Tabs } from 'expo-router'
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
          tabBarIcon: ({ focused }) => <Home color={"$text"} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <Search color={"$text"} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: ({ focused }) => <SquareSlash />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => <Bell color={"$text"} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />


      <Tabs.Screen
        name="direct-messages"
        options={{
          tabBarIcon: ({ focused }) => <Mail color={"$text"} />,
          tabBarActiveBackgroundColor: tamaguiTheme.background.val,
          tabBarInactiveBackgroundColor : tamaguiTheme.background.val
        }}
      />
    </Tabs>
  )
}
