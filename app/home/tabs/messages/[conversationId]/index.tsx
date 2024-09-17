import {YStack} from "tamagui";
import {useGlobalSearchParams} from "expo-router";
import Conversation, {useConversationContext} from "../../../../../screens/messaging/conversation";
import {useEffect, useState} from "react";
import { Conversation as CConversation } from '@kade-net/fgs-rn'
import fgs, {FGS} from "../../../../../lib/fgs";
import Loading from "../../../../../components/ui/feedback/loading";
import {SortOrder} from "../../../../../__generated__/graphql";


export default function ConversationDetails(){
    const [loading, setLoading] = useState(false);
    const params = useGlobalSearchParams<{
        conversationId: string
    }>()
    const {setConversation, setLoadedMessages} = useConversationContext()

    useEffect(()=> {
        ;(async ()=>{
            if(fgs.client && params.conversationId) {
                setLoading(true);
                try {
                    const currentConversation = await fgs.client.conversation(params.conversationId);

                    if(currentConversation){
                        setConversation(currentConversation);

                        const messages = await currentConversation.loadConversation({page: 0, size: 20}, SortOrder.Asc)

                        setLoadedMessages(messages)

                    }
                }catch (e)
                {
                    console.log("Something went wrong:: ", e)
                }
                finally {
                    setLoading(false);
                }
            }
        })();
    },[params.conversationId])


    if(loading) return <Loading bg={"$background"} flex={1} w={"100%"} h={"100%"} />

    return (
        <YStack flex={1} w={"100%"} h={'100%'} >
            <Conversation/>
        </YStack>
    )
}