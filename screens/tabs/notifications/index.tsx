import { View, Text, Avatar, Heading, Tabs, SizableText, Separator } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { Settings } from '@tamagui/lucide-icons'

const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const Notifications = () => {
  const insets = useSafeAreaInsets()
  return (
    <View flex={1} pt={insets.top} pb={insets.bottom} >
      <View flexDirection='row' w="100%" alignItems='center' justifyContent='space-between' px={20} py={10} >
        <TouchableOpacity>
          <Avatar circular  >
            <Avatar.Image
              accessibilityLabel='Profile Picture'
              src={IMAGE}
            />
            <Avatar.Fallback
              backgroundColor={'$pink10'}
            />
          </Avatar>
        </TouchableOpacity>
        <Heading size="$6" >
          Home
        </Heading>
        <TouchableOpacity>
          <Settings />
        </TouchableOpacity>
      </View>
      <View flex={1} >
        <Tabs flexDirection='column' orientation='horizontal' defaultValue='people' flex={1} width="100%" height="100%" >
          <Tabs.List disablePassBorderRadius="bottom" w="100%" >
            <Tabs.Tab flex={1} value='people' >
              <SizableText size="$3" >
                All
              </SizableText>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value='communities' >
              <SizableText size="$3" >
                Mentions
              </SizableText>
            </Tabs.Tab>
          </Tabs.List>
          <Separator w="100%" />
          <Tabs.Content value='people' >
            <View flex={1} justifyContent='center' alignItems='center' >

            </View>
          </Tabs.Content>
          <Tabs.Content value='communities' >
            <View flex={1} justifyContent='center' alignItems='center' >

            </View>
          </Tabs.Content>
        </Tabs>
      </View>
    </View>
  )
}

export default Notifications