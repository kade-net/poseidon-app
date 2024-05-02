import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useQuery } from '@apollo/client'
import { getInboxes } from '../../../../lib/hermes-client/queries'
import { Exact, InboxType, InputMaybe } from '../../../../lib/hermes-client/__generated__/graphql'
import { hermesClient } from '../../../../data/apollo'
import { YStack } from 'tamagui'
import ChatPreview from '../components/chat-preview'
import ChatRequest from '../components/chat-request'

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

    return (
        <YStack flex={1} w="100%" h="100%" >
            <FlatList
                data={inboxQuery?.data?.inboxes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    if (item.active) return <ChatPreview
                        data={item}
                    />

                    return <ChatRequest
                        data={item}
                    />
                }}
            />
        </YStack>
    )
}

export default Inboxes