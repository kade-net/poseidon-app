import { View, Text, FlatList, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button, Spinner, XStack, YStack } from 'tamagui'
import MessageEditor from './message-editor'
import { useQuery } from 'react-query'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import hermes from '../../../../contract/modules/hermes'
import ChatBubble from './chat-bubble'
import Loading from '../../../../components/ui/feedback/loading'
import { useSubscription } from '@apollo/client'
import { INBOX_MESSAGE_SUBSCRIPTION } from '../../../../lib/convergence-client/queries'
import { convergenceWebSocketClient } from '../../../../data/apollo'
import delegateManager from '../../../../lib/delegate-manager'
import index from '../../../../app'

interface Props {
  inbox_name: string
  other_user: string
  timestamp: number
  handleRefresh?: () => Promise<any>
}
const _Chat = (props: Props) => {
  const { inbox_name, other_user, handleRefresh } = props

  const flatListRef = useRef<FlatList>(null)

  const messageQuery = useQuery({
    queryKey: ['getDecryptedMessageHistory', inbox_name],
    queryFn: () => hermes.getPDSData(inbox_name)
  })

  const onRefetch = async () => {
    if (handleRefresh) {
      await handleRefresh()
    }
    messageQuery.refetch()
  }


  if (messageQuery.isLoading) return <Loading flex={1} w="100%" h="100%" backgroundColor={'$background'} />



  return (
    <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} >
      {/* {messageQuery.isFetching && <XStack w="100%" px={5} alignItems='center' justifyContent='center' >
        <Spinner />
      </XStack>} */}
      {__DEV__ && <XStack w="100%" alignItems='center' justifyContent='center' >
        <Button onPress={() => hermes.clearSavedMessages(inbox_name)} >
          Clear All
        </Button>
      </XStack>}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <FlatList
          ref={flatListRef}
          // initialScrollIndex={(messageQuery?.data?.length ?? 1) - 9}
          // inverted
          onRefresh={onRefetch}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
      </KeyboardAvoidingView>
      <MessageEditor />
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

  const initialMessageQuery = useQuery({
    queryKey: ['getDecryptedMessageHistory', inbox_name, other_user],
    queryFn: () => hermes.getInboxHistory(inbox_name, other_user)
  })

  if (initialMessageQuery.isLoading) return <Loading flex={1} w="100%" h="100%" backgroundColor={'$background'} />

  return <_Chat handleRefresh={() => initialMessageQuery.refetch()} inbox_name={inbox_name} other_user={other_user} timestamp={view_timestamp} />
}

export default Chat