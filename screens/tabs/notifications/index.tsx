import { View, Text, Avatar, Heading, Tabs, SizableText, Separator } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { Settings } from '@tamagui/lucide-icons'
import { Utils } from '../../../utils'

const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const Notifications = () => {
  const insets = useSafeAreaInsets()
  return (
    <View flex={1} alignItems='center' justifyContent='center' backgroundColor={"$background"} >
      <Heading color={"$text"}>
        🏗️ Under Construction 🏗️
      </Heading>
    </View>
  )
}

export default Notifications