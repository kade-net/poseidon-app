import { Text, YStack } from "tamagui";
import {useGlobalSearchParams} from "expo-router";
import Conversation from "../../../../../screens/messaging/conversation";
import {useEffect, useState} from "react";
import fgs from "../../../../../lib/fgs";
import Loading from "../../../../../components/ui/feedback/loading";
import { useConversationContext } from "../../../../../screens/messaging/context";
import { Client, getInbox } from "@kade-net/fgs-rn";
import delegateManager from "../../../../../lib/delegate-manager";


export default function ConversationDetails(){
    return (
        <YStack flex={1} w={"100%"} h={'100%'} >
            <Conversation/>
        </YStack>
    )
}