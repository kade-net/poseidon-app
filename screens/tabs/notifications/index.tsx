import { View, Text, Avatar, Heading, Tabs, SizableText, Separator, YStack, XStack, Spinner } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlatList, TouchableOpacity } from 'react-native'
import { Inbox, Settings } from '@tamagui/lucide-icons'
import { Utils } from '../../../utils'
import { useQuery } from '@apollo/client'
import { USER_NOTIFICATIONS } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import BaseNotificationContent from '../../../components/ui/notification'

const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const Notifications = () => {
  const notificationsQuery = useQuery(USER_NOTIFICATIONS, {
    variables: {
      accountAddress: delegateManager.owner!,
      page: 0,
      size: 20
    }
  })

  const handleFetchMore = () => {
    const nextPage = Math.floor((notificationsQuery?.data?.userNotifications?.length ?? 0) / 20)

    return notificationsQuery.fetchMore({
      variables: {
        page: nextPage,
        size: 20,
        accountAddress: delegateManager.owner!
      }
    })
  }

  const handleFetchTop = () => {
    return notificationsQuery.refetch({
      page: 0,
      size: 20,
      accountAddress: delegateManager.owner!
    })
  }

  return (
    <YStack w="100%" flex={1} h="100%" backgroundColor={'$background'} >
      <FlatList
        data={notificationsQuery?.data?.userNotifications ?? []}
        keyExtractor={(item, i) => i?.toString()}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <BaseNotificationContent
              data={item as any}
            />
          )
        }}
        refreshing={notificationsQuery.loading}
        onRefresh={handleFetchTop}
        onEndReached={handleFetchMore}
        onEndReachedThreshold={1}
        ListEmptyComponent={<YStack w="100%" alignItems='center' justifyContent='center' rowGap={20} p={20} >
          <Inbox />
          <Text>
            No notifications
          </Text>
        </YStack>}
        ListFooterComponent={() => {
          if (!notificationsQuery.loading) return null
          return (
            <XStack w="100%" p={5} alignItems='center' justifyContent='center' columnGap={10} >
              <Spinner />
              <Text>Loading...</Text>
            </XStack>
          )
        }}
      />
    </YStack>
  )
}

export default Notifications