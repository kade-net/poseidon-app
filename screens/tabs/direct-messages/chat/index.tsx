import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { YStack } from 'tamagui'
import MessageEditor from './message-editor'
import { useQuery } from 'react-query'
import { useLocalSearchParams } from 'expo-router'
import hermes from '../../../../contract/modules/hermes'
import ChatBubble from './chat-bubble'

const Chat = () => {
  const params = useLocalSearchParams()
  const inbox_name = params.inbox_name as string
  const other_user = params.other_user as string

  const messageQuery = useQuery({
    queryKey: ['getDecryptedMessageHistory', inbox_name, other_user],
    queryFn: () => hermes.getInboxHistory(inbox_name, other_user)
  })

  console.log("Messages::", messageQuery.data)
  return (
    <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} >
      <FlatList
        data={messageQuery.data ?? []}
        refreshing={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ChatBubble
            data={item}
          />
        )}
      />
      <MessageEditor />
    </YStack>
  )
}

export default Chat