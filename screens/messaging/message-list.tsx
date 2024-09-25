import { CONVERSATION_HEADER, MESSAGE } from "@kade-net/fgs-rn";
import React, {useCallback, useEffect} from "react";
import dayjs from "dayjs";
import { Message } from "./message";
import { FlatList } from "react-native";
import { flatten, uniqBy } from "lodash";
import { useConversationContext } from "./context";
import {useQueryClient} from "react-query";
import delegateManager from "../../lib/delegate-manager";


interface ConversationListProps {
}
export function ConversationList(props: ConversationListProps) {
    const { conversation, messages, messageQuery } = useConversationContext()

    const queryClient = useQueryClient()
    const renderMessage = useCallback((props: { item: MESSAGE, index: number }) => {
        const { index, item } = props
        const sameDate = messages.filter(m => m !== null && m!== undefined).filter(m => dayjs(item.timestamp).isSame(m.timestamp, 'date') && m.id !== item.id)
        const before = sameDate.filter(m => (m.timestamp ?? 0) <= (item.timestamp ?? 0)) ?? []
        const after = sameDate.filter(m => (m.timestamp ?? 0) > (item.timestamp ?? 0)) ?? []

        return <Message data={props.item} surrounding={[before, after]} />
    }, [messages?.length])

    useEffect(() => {
        const loadStream = async () => {
            if(conversation){
                try {
                    await conversation.stream({
                        onMessage(message){
                            if(message && message.originator !== delegateManager.account?.address().toString()){
                                queryClient.setQueryData<{ pages: Array<Array<MESSAGE>>, pageParams: Array<number> }>([`conversation-${conversation?.header.conversation_id}`], (data) => {
                                    return {
                                        pages: data?.pages.map((page, i) => {
                                            if (i !== (data?.pages?.length - 1)) return page
                                            return [message, ...page]
                                        }) ?? [],
                                        pageParams: data?.pageParams ?? []
                                    }
                                })
                            }
                        },
                        onError(error){
                            console.log("Something went wrong", error)
                        },
                        onComplete(){
                            console.log("Done reading conversation")
                        }
                    })
                }
                catch (e)
                {
                    console.log("error creating stream::", e)
                }
            }
        }

        loadStream()
    }, []);

    return (
        <FlatList
            inverted
            refreshing={messageQuery?.isLoading}
            style={{
                paddingVertical: 20,
                width: '100%',
            }}
            contentContainerStyle={{
                paddingBottom: 20
            }}
            data={uniqBy(flatten(messageQuery?.data?.pages ?? []) , item => item?.id)} renderItem={renderMessage} onEndReached={() => messageQuery?.fetchNextPage()} />
    )

}
