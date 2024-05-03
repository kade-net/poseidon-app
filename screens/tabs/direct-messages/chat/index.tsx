import { View, Text, FlatList } from 'react-native'
import React, { useMemo, useRef } from 'react'
import { Button, Spinner, XStack, YStack } from 'tamagui'
import MessageEditor from './message-editor'
import { useQuery } from 'react-query'
import { useLocalSearchParams } from 'expo-router'
import hermes from '../../../../contract/modules/hermes'
import ChatBubble from './chat-bubble'
import Loading from '../../../../components/ui/feedback/loading'
import { useSubscription } from '@apollo/client'
import { INBOX_MESSAGE_SUBSCRIPTION } from '../../../../lib/convergence-client/queries'
import { convergenceWebSocketClient } from '../../../../data/apollo'
import delegateManager from '../../../../lib/delegate-manager'

interface Props {
  inbox_name: string
  other_user: string
  timestamp: number
}
const _Chat = (props: Props) => {
  const { inbox_name, other_user } = props

  const flatListRef = useRef<FlatList>(null)

  const handleScrollToLast = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }

  useSubscription(INBOX_MESSAGE_SUBSCRIPTION, {
    client: convergenceWebSocketClient,
    variables: {
      inbox_name,
      viewer: delegateManager.owner!
    },
    onError(error) {
      console.log("Error::", error)
    },
    onData: async (data) => {
      if (data?.data?.data?.liveInbox && !data?.data?.error) {
        const envelope = data?.data?.data?.liveInbox ?? null
        await hermes.saveIncomingMessage({ ...envelope, is_from_live: true, content: envelope.content.startsWith('{') ? JSON.parse(envelope.content) : envelope.content })
      }
    },

  })

  const messageQuery = useQuery({
    queryKey: ['getDecryptedMessageHistory', inbox_name],
    queryFn: () => hermes.getPDSData(inbox_name),
    onSuccess: (data) => {
      if (data.length > 0) {
        handleScrollToLast()
      }
    }
  })

  return (
    <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} >
      {messageQuery.isFetching && <XStack w="100%" px={5} alignItems='center' justifyContent='center' >
        <Spinner />
      </XStack>}
      {__DEV__ && <XStack w="100%" alignItems='center' justifyContent='center' >
        <Button onPress={() => hermes.clearSavedMessages(inbox_name)} >
          Clear All
        </Button>
      </XStack>}
      <FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        data={messageQuery.data ?? []}
        refreshing={false}
        keyExtractor={(item) => item.ref}
        renderItem={({ item }) => (
          <ChatBubble
            data={item}
          />
        )}
      />
      <MessageEditor
        handleScrollToEnd={handleScrollToLast}
      />
    </YStack>
  )
}

const Chat = () => {
  const params = useLocalSearchParams()
  const inbox_name = params.inbox_name as string
  const other_user = params.other_user as string
  const view_timestamp = useMemo(() => {
    return Date.now()
  }, [])

  const initialMessageQuery = useQuery({
    queryKey: ['getDecryptedMessageHistory', inbox_name, other_user],
    queryFn: () => hermes.getInboxHistory(inbox_name, other_user)
  })

  if (initialMessageQuery.isLoading) return <Loading flex={1} w="100%" h="100%" backgroundColor={'$background'} />

  return <_Chat inbox_name={inbox_name} other_user={other_user} timestamp={view_timestamp} />
}

export default Chat