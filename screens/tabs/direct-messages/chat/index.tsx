import { View, FlatList, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button, Spinner, Text, XStack, YStack } from 'tamagui'
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
import inboxes from '../../../../contract/modules/hermes/inboxes'
import BaseButton from '../../../../components/ui/buttons/base-button'

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
    queryFn: () => hermes.getPDSData(inbox_name, other_user)
  })

  const onRefetch = async () => {
    if (handleRefresh) {
      await handleRefresh()
    }
    try {
      await messageQuery.refetch()

    }
    catch (e) {

    }
  }


  if (messageQuery.isLoading) return <Loading flex={1} w="100%" h="100%" backgroundColor={'$background'} />



  return (
    <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} >
      {/* {messageQuery.isFetching && <XStack w="100%" px={5} alignItems='center' justifyContent='center' >
        <Spinner />
      </XStack>} */}
      {__DEV__ && <XStack w="100%" alignItems='center' justifyContent='center' >
        <BaseButton onPress={() => hermes.clearSavedMessages(inbox_name)} >
          <Text color={"white"} >Clear All</Text>
        </BaseButton>
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

  const loadInbox = useQuery({
    queryKey: ['loadInbox', inbox_name, other_user],
    queryFn: () => inboxes.loadInbox(other_user)
  })

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
        await hermes.saveIncomingMessage({ ...envelope, content: JSON.parse(envelope.content), is_from_live: true })
      }
    },
    skip: loadInbox.isLoading && !loadInbox.isError && !!inbox_name && !!other_user
  })



  const initialMessageQuery = useQuery({
    queryKey: ['getDecryptedMessageHistory', inbox_name, other_user],
    queryFn: () => hermes.getInboxHistory(inbox_name, other_user),
    enabled: !loadInbox.isLoading,

  })


  useFocusEffect(useCallback(() => {
    if (!initialMessageQuery.isLoading && !initialMessageQuery.isFetching) {
      initialMessageQuery.refetch()
    }
  }, []))


  if (initialMessageQuery.isLoading || loadInbox.isLoading || loadInbox.isFetching) return <Loading flex={1} w="100%" h="100%" backgroundColor={'$background'} />

  return <_Chat handleRefresh={async () => {
    await initialMessageQuery.refetch()
  }} inbox_name={inbox_name} other_user={other_user} timestamp={view_timestamp} />
}

export default Chat