import { Conversation as CConversation } from "@kade-net/fgs-rn/build/lib/client";
import { MESSAGE } from "@kade-net/fgs-rn";
import {useInfiniteQuery, UseInfiniteQueryResult, useQuery} from "react-query";
import React, { ReactNode, useContext, useState } from "react";
import { SortOrder } from "../../__generated__/graphql";
import {useLocalSearchParams} from "expo-router";
import fgs from "../../lib/fgs";
import Loading from "../../components/ui/feedback/loading";
import {flatten} from "lodash";


interface ConversationContext {
    conversation: CConversation | null;
    messages: Array<MESSAGE>;
    addMessage: (message: MESSAGE) => void;
    setLoadedMessages: (messages: Array<MESSAGE>) => void;
    messageQuery: UseInfiniteQueryResult<MESSAGE[], unknown>
}

const context = React.createContext<ConversationContext>({
    conversation: null,
    messages: [],
    addMessage: (message: MESSAGE) => { },
    setLoadedMessages: (messages: Array<MESSAGE>) => { },
    messageQuery: {

    } as any
})

export const ConversationProvider = (props: { children: ReactNode }) => {
    const params = useLocalSearchParams<{conversationId: string}>()
    const [loadedMessages, setLoadedMessages] = useState<Array<MESSAGE>>([]);

    const conversationQuery = useQuery({
        queryKey: ['conversation', params.conversationId],
        queryFn: async ()=>{
            try {
                if(!fgs.client) return null
                const conversation = await fgs.client?.conversation(params.conversationId)
                if(!conversation) return null;
                return conversation
            }
            catch (e)
            {
                console.log("Unable to get conversation::", e)
            }
        }
    })

    const messageInfiniteQuery = useInfiniteQuery({
        queryKey: [`conversation-${params.conversationId}`],
        queryFn: async ({ pageParam, }) => {
            return conversationQuery.data!?.loadConversation({
                page: pageParam ?? 0,
                sort: SortOrder.Desc
            })
        },
        getNextPageParam(lastPage, allPages) {
            const currentPageCount = allPages.length

            if ((lastPage?.length ?? 0) >= 20) return currentPageCount !== 0 ? currentPageCount : 0

            return undefined

        },
        getPreviousPageParam(firstPage, allPages) {
            const currentPageCount = allPages?.length ?? 0

            if (currentPageCount !== 0 && currentPageCount !== 1) return currentPageCount - 1

            return undefined
        },
        enabled: !!conversationQuery.data || !conversationQuery.isLoading
    })

    const addMessage = async (message: MESSAGE) => {
        setLoadedMessages(messages => [...messages, message])
    }

    if(conversationQuery.isLoading || messageInfiniteQuery.isLoading) return <Loading flex={1} w={'100%'} h={'100%'} bg={'$background'} />

    return (
        <context.Provider value={{
            conversation: conversationQuery?.data ?? null,
            messages: flatten(messageInfiniteQuery?.data?.pages) ?? [],
            addMessage,
            setLoadedMessages,
            messageQuery: messageInfiniteQuery
        }} >
            {props.children}
        </context.Provider>
    )
}

export const useConversationContext = () => {
    const conv = useContext(context)

    return conv
}