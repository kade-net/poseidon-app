import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useQuery } from '@apollo/client'
import { getInboxes } from '../../../../lib/hermes-client/queries'
import { Exact, InboxType, InputMaybe } from '../../../../lib/hermes-client/__generated__/graphql'
import { hermesClient } from '../../../../data/apollo'
import { Spinner, XStack, YStack } from 'tamagui'
import ChatPreview from '../components/chat-preview'
import ChatRequest from '../components/chat-request'
import Empty from '../../../../components/ui/feedback/empty'
import Loading from '../../../../components/ui/feedback/loading'

interface Props {
    variables: Exact<{
        address: string;
        type?: InputMaybe<InboxType> | undefined;
        active?: InputMaybe<boolean> | undefined;
    }>
}

const Inboxes = (props: Props) => {
    const { variables } = props

    const inboxQuery = useQuery(getInboxes, {
        variables,
        client: hermesClient
    })

    const handleRefetch = async () => {
        await inboxQuery.refetch()
    }

    return (
        <YStack flex={1} w="100%" h="100%" >
            <FlatList
                data={inboxQuery?.data?.inboxes}
                onRefresh={handleRefetch}
                refreshing={false}
                contentContainerStyle={{
                    padding: 20,
                    rowGap: 10
                }}
                ListHeaderComponent={() => {
                    if (!inboxQuery.loading || (inboxQuery?.data?.inboxes?.length ?? 0) == 0) return null
                    return <XStack w="100%" alignItems='center' justifyContent='center' py={5} >
                        <Spinner />
                    </XStack>
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    if (item.active) return <ChatPreview
                        data={item}
                    />

                    return <ChatRequest
                        data={item}
                    />
                }}
                ListEmptyComponent={() => {
                    if (inboxQuery.loading) return <Loading
                        flex={1}
                        w="100%"
                        h="100%"
                    />
                    return <Empty
                        flex={1}
                        w="100%"
                        h="100%"
                        onRefetch={handleRefetch}
                    />
                }}
            />
        </YStack>
    )
}

export default Inboxes