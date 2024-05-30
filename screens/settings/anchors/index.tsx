import { View, Text, YStack, H3, Button, Separator, XStack, Spinner } from 'tamagui'
import React from 'react'
import { Anchor, ArrowDownLeft, ArrowDownRight, ArrowUpRight, RefreshCw } from '@tamagui/lucide-icons'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { useQuery } from 'react-query'
import axios from 'axios'
import delegateManager from '../../../lib/delegate-manager'
import { Utils } from '../../../utils'
import Constants from 'expo-constants'
import config from '../../../config'
import anchors from '../../../contract/modules/anchors'
import { useQuery as useApolloQuery } from '@apollo/client'
import { GET_ANCHOR_HISTORY } from '../../../lib/convergence-client/queries'
import { AnchorTransactionType } from '../../../lib/convergence-client/__generated__/graphql'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'
import { convergenceClient } from '../../../data/apollo'

const CONNECT_URL = config.ANCHORS_URL

const Anchors = () => {

    const anchorAmountQuery = useQuery({
        queryFn: () => anchors.getBalance(),
        queryKey: ['anchors'],
        refetchInterval: 10000
    })

    const transactionsQuery = useApolloQuery(GET_ANCHOR_HISTORY, {
        variables: {
            user_address: delegateManager.owner!
        },
        client: convergenceClient
    })

    return (
        <YStack alignItems='center' flex={1} w="100%" h="100%" px={Utils.dynamicWidth(5)} py={Utils.dynamicHeight(3)} backgroundColor={"$background"}>
            <XStack w="100%" justifyContent='flex-end' >
                <TouchableOpacity
                    onPress={() => transactionsQuery.refetch()}
                    disabled={transactionsQuery.loading}
                >
                    {
                        transactionsQuery.loading ? <Spinner /> : <RefreshCw />
                    }

                </TouchableOpacity>
            </XStack>
            <View w="100%" alignItems='center' justifyContent='center' pb={10} >
                <Anchor size={100} />
            </View>
            <View>
                <H3>
                    {Intl.NumberFormat().format(anchorAmountQuery.data ?? 0)} Anchors
                </H3>
            </View>
            <Text w="85%" textAlign='center' color={'$text'} fontFamily={"$body"} fontSize={"$sm"} my={Utils.dynamicHeight(1)}>
                Anchors can be used to perform a variety of onchain and Kade specific actions.
            </Text>
            <Link
                href={"/app-connect/store"}
                asChild
            >
                <Button 
                    variant='outlined' 
                    fontSize={"$md"}
                    fontWeight={"$2"}
                    borderWidth={1} 
                    borderColor={"$button"}
                    color={"$text"}
                    mt={20} 
                    my={Utils.dynamicHeight(1)}
                >
                        
                    Get Anchors
                </Button>
            </Link>
            <Separator w="100%" />
            <YStack
                w="100%"
                mt={20}
            >
                <FlatList
                    data={transactionsQuery?.data?.anchorTransactions ?? []}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <YStack w="100%" >
                                <XStack w="100%" justifyContent='space-between' >
                                    <XStack columnGap={5} >
                                        {
                                            item.type == AnchorTransactionType.Deposit ? <ArrowDownRight /> : <ArrowUpRight />
                                        }
                                        <Text>
                                            {
                                                item.type == AnchorTransactionType.Deposit ? "Received" : "Sent"
                                            }
                                        </Text>
                                    </XStack>

                                    <XStack columnGap={5} >
                                        <Text>
                                            {Intl.NumberFormat().format(item?.anchor_amount ?? 0)}
                                        </Text>
                                    </XStack>
                                </XStack>
                                <Separator />
                            </YStack>
                        )
                    }}
                    refreshing={false}
                    onRefresh={() => transactionsQuery.refetch({
                        user_address: delegateManager.owner!
                    })}
                    ListEmptyComponent={() => {
                        if (transactionsQuery.loading) return <Loading flex={1} w="100%" h="100%" />

                        return <Empty
                            w="100%"
                            h="100%"
                            flex={1}
                            emptyText='No transactions found.'
                        />
                    }}

                />
            </YStack>
        </YStack>
    )
}

export default Anchors