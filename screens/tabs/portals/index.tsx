import { View, Text, YStack, XStack, H3 } from 'tamagui'
import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_PORTALS } from '../../../lib/convergence-client/queries'
import { FlatList } from 'react-native'
import LinkResolver from '../../../components/ui/feed/link-resolver'
import { convergenceClient } from '../../../data/apollo'
import PortalCard from './portal-card'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'

const Portals = () => {
    const portalsQuery = useQuery(GET_PORTALS, {
        client: convergenceClient
    })

    return (
        <YStack
            flex={1}
            w='100%'
            h={'100%'}
            backgroundColor={'$background'}
            p={20}
        >
            <XStack w="100%" alignItems='center' pb={20} >
                <H3 fontFamily={'$roboto'} >
                    Portals
                </H3>
            </XStack>
            <YStack flex={1} w="100%" h="100%" >
                <FlatList
                    data={portalsQuery?.data?.portals}
                    keyExtractor={(item) => item.url}
                    contentContainerStyle={{
                        rowGap: 20,
                    }}
                    style={{
                        height: '100%',
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <PortalCard
                            portal={item}
                        />
                    }}
                    ListEmptyComponent={() => {
                        if (portalsQuery.loading) {
                            return <Loading
                                h='100%'
                                flex={1}
                            />
                        }

                        return <Empty
                            emptyText='No portals found, yet!'
                            flex={1}
                        />
                    }}
                />
            </YStack>
        </YStack>
    )
}

export default Portals