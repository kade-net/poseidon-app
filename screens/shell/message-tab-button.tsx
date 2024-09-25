import { useRouter } from "expo-router";
import { Text, XStack } from "tamagui";
import { MessageIcon, MessageOutlined } from "../../lib/icons";
import React, {memo, useEffect, useState} from "react";
import {Client, Conversation, CONVERSATION_HEADER} from "@kade-net/fgs-rn";
import fgs, { FGS } from "../../lib/fgs";
import notifications from "../../lib/notifications";
import delegateManager from "../../lib/delegate-manager";
import {useQuery} from "react-query";
import {getConversations} from "../messaging";
import conversation from "../messaging/conversation";
import {Platform} from "react-native";
import {Utils} from "../../utils";

interface Props {
    isActive: boolean;
    conversationList: CONVERSATION_HEADER[]
}
export const TabButton = memo((props: Props) => {
    const { isActive, conversationList } = props

    const pendingConversationsQuery = useQuery({
        queryFn: getConversations,
        queryKey: ['pending-conversations'],
        onError: (e) => {
            console.log("Pending Conversations Error::", e)
        }
    })

    const messageCountQuery = useQuery({
        queryKey: [`messageCount`],
        queryFn: async ()=> {
            if (!fgs || !fgs.client) return 0;
            try {

                const lastRead = await notifications.getNotificationCounter("dms")

                const count = await fgs.client.monitorConversations({
                    last_read: lastRead?.lastRead,
                    conversations: conversationList?.map(c=>c.conversation_id)
                })

                return count ?? 0

            }
            catch (e) {
                console.log("error", e)
                return 0
            }
        },
        enabled: !pendingConversationsQuery.isLoading
    })

    const newMessageCount = messageCountQuery?.data ?? 0

    return (
        <XStack pos={'relative'} overflow={'visible'} >
            {
                isActive ? <MessageIcon color={'white'} /> : <MessageOutlined color={'white'} />
            }
            {newMessageCount > 0 && <XStack top={-10} right={-10} zIndex={10} pos={'absolute'} bg={'$primary'} w={20} h={20}
                alignItems={'center'} justifyContent={'center'} borderRadius={50}>
                <Text>
                    {Utils.badgeCountFormatter(newMessageCount)}
                </Text>
            </XStack>}
        </XStack>
    )
})


export const MessageTabButton = memo((props: {isActive: boolean}) => {
    const { isActive } = props

    const pendingConversationsQuery = useQuery({
        queryFn: getConversations,
        queryKey: ['pending-conversations'],
        onError: (e) => {
            console.log("Pending Conversations Error::", e)
        }
    })

    return <TabButton isActive={isActive} conversationList={pendingConversationsQuery?.data ?? []} />
})