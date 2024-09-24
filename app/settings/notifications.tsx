import { View, Text } from 'react-native'
import React from 'react'
import Notifications from '../../screens/settings/notifications'
import { useQuery } from 'react-query'
import notifications from '../../lib/notifications'
import { Spinner, YStack } from 'tamagui'

const NotificationsScreen = () => {
    // const notificationStatusQuery = useQuery({
    //     queryKey: ['notifications'],
    //     queryFn: notifications.getNotificationStatus
    // })
    //
    // if (notificationStatusQuery.isLoading) return (
    //     <YStack flex={1} backgroundColor={'$background'} alignItems='center' p={20} >
    //         <Spinner />
    //     </YStack>
    // )
    //
    // return (
    //     <Notifications
    //         status={notificationStatusQuery.data?.enabled || false}
    //     />
    // )
    return (
        <YStack></YStack>
    )
}

export default NotificationsScreen