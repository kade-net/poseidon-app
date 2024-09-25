import {View, Text, YStack, XStack, H3, useTheme, Separator} from 'tamagui'
import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_PORTALS } from '../../../lib/convergence-client/queries'
import {FlatList, TouchableOpacity} from 'react-native'
import LinkResolver from '../../../components/ui/feed/link-resolver'
import { convergenceClient } from '../../../data/apollo'
import PortalCard from './portal-card'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'
import { Portal } from '../../../lib/convergence-client/__generated__/graphql'
import { WebView } from 'react-native-webview'
import BaseButton from '../../../components/ui/buttons/base-button'
import { useRouter } from 'expo-router'
import {ChevronLeft, Menu} from "@tamagui/lucide-icons";

const Portals = () => {
    const theme = useTheme()
    const portalsQuery = useQuery(GET_PORTALS, {
        client: convergenceClient
    })
    const router = useRouter()

    return (
        <YStack
            flex={1}
            w='100%'
            h={'100%'}
            backgroundColor={'$background'}
            rowGap={20}
        >
            <YStack w={'100%'} >
                <XStack w="100%" alignItems='center' justifyContent='space-between' px={20} pt={0} py={10}  >
                    <TouchableOpacity onPress={router.back} style={{width: 80}}>
                        <ChevronLeft/>
                    </TouchableOpacity>
                    <Text fontWeight={'bold'} fontSize={18} >
                        Portals
                    </Text>
                    <View style={{width: 80}} ></View>
                    </XStack>
                    <Separator borderColor={'$border'} />
            </YStack>
            <YStack p={20} flex={1} w="100%" h="100%" >
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