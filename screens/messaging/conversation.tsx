import { YStack } from "tamagui";
import {
    CONVERSATION_HEADER,
} from "@kade-net/fgs-rn";
import React, {memo, useEffect} from "react";

import { ConversationHeader } from "./header";
import { ConversationList } from "./message-list";
import { MessageBox } from "./message-box";
import { useFocusEffect } from "expo-router";
import notifications from "../../lib/notifications";
import {useQueryClient} from "react-query";


const Conversation = ()=> {
    const queryClient = useQueryClient();
    useFocusEffect(() => {
        const updateNotifications = async ()=> {
            try {
                await notifications.updateLastRead('dms')
                await queryClient.invalidateQueries(['messageCount'])
                await queryClient.invalidateQueries(['lastNotificationRead'])
            }
            catch (e) {
                console.log("Unable to update last read")
            }
        }

        updateNotifications()

        return updateNotifications
    })
    return (
        <YStack flex={1} w={"100%"} h={"100%"} bg={"$background"} >
            <ConversationHeader />
            <ConversationList />
            <MessageBox />
        </YStack>
    )
}

export default Conversation;