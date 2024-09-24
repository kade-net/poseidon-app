import {Text, XStack} from "tamagui";
import {NotificationOutlined, NotificationSolid} from "../../lib/icons";
import React from "react";
import {useQuery} from "@apollo/client";
import {USER_NOTIFICATIONS} from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import { useQuery as uzQuery } from 'react-query'
import notifications from "../../lib/notifications";
import {Utils} from "../../utils";


interface Props {
    focused: boolean;
}
export function NotificationsTabButton(props: Props) {

    const { focused } = props;

    const notificationsQuery = useQuery(USER_NOTIFICATIONS, {
        variables: {
            accountAddress: delegateManager.owner!,
            page: 0,
            size: 20
        }
    })

    const unreadCountQuery = uzQuery({
        queryKey: ['lastReadNotification-publications'],
        queryFn: async ()=> {
            const counter = await notifications.getNotificationCounter("posts")
            const notificationsData = await notificationsQuery.refetch()
            const unread = notificationsData?.data?.userNotifications?.filter((not)=> not.timestamp > (counter?.lastRead ?? Date.now()))

            return unread?.length  ?? 0
        }
    })




    return (
        <XStack pos={'relative'} >
            {focused ? <NotificationSolid color={'white'} /> : <NotificationOutlined color={'white'} />}
            {
                (!unreadCountQuery?.isLoading && ((unreadCountQuery?.data ?? 0) > 0)) && <XStack w={20} h={20} alignItems={'center'} justifyContent={'center'} borderRadius={20} backgroundColor={'$primary'} top={-10} right={10} zIndex={10} >
                    <Text>
                        {Utils.badgeCountFormatter(unreadCountQuery?.data ?? 0)}
                    </Text>
                </XStack>
            }
        </XStack>
    )

}