import { View, Text, Avatar, Heading, Tabs, SizableText, Separator, YStack, XStack, Spinner } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { Inbox, Settings } from '@tamagui/lucide-icons'
import { Utils } from '../../../utils'
import { useQuery } from '@apollo/client'
import { USER_NOTIFICATIONS } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import BaseNotificationContent from '../../../components/ui/notification'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'

const DEVICE_HEIGHT = Dimensions.get('screen').height

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
        refreshing={false}
        onRefresh={handleFetchTop}
        onEndReached={handleFetchMore}
        onEndReachedThreshold={1}
        ListEmptyComponent={() => {
          if (notificationsQuery.loading) return <Loading
            h={
              DEVICE_HEIGHT - 200
            }
          />
          return <Empty
            emptyText='No notifications yet'
            h={
              DEVICE_HEIGHT - 200
            }
          />
        }}
      />
    </YStack>
  )
}

export default Notifications