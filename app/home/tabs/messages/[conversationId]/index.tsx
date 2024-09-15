import {YStack} from "tamagui";
import {useGlobalSearchParams} from "expo-router";
import Conversation from "../../../../../screens/messaging/conversation";


export default function ConversationDetails(){
    const params = useGlobalSearchParams<{
        conversationId: string
    }>()
    console.log(params)

    // TODO: fetch the conversation header
    return (
        <YStack flex={1} w={"100%"} h={'100%'} >
            <Conversation/>
        </YStack>
    )
}