import { View, Text, YStack, H3, Button, Separator, XStack } from 'tamagui'
import React from 'react'
import { Anchor, ArrowDownLeft, ArrowDownRight, ArrowUpRight, RefreshCw } from '@tamagui/lucide-icons'
import { FlatList, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { useQuery } from 'react-query'
import axios from 'axios'
import delegateManager from '../../../lib/delegate-manager'

const CONNECT_URL = "https://anchor-connect.vercel.app"

const Anchors = () => {

    const anchorsQuery = useQuery({
        queryKey: 'anchors',
        queryFn: async () => {
            try {
                const response = await axios.get<{
                    total_amount: number,
                    transactions: Array<{
                        type: "deposit" | "transfer",
                        amount: number,
                        timestamp: number
                    }>

                }>(`${CONNECT_URL}/api/anchors`, {
                    params: {
                        user_address: delegateManager?.owner
                    }
                })

                return response?.data
            }
            catch (e) {
                return null
            }

        }
    })
    return (
        <YStack alignItems='center' flex={1} w="100%" h="100%" px={20} py={20} >
            <XStack w="100%" justifyContent='flex-end' >
                <TouchableOpacity
                    onPress={() => anchorsQuery.refetch()}
                    disabled={anchorsQuery.isLoading}
                >
                    <RefreshCw />
                </TouchableOpacity>
            </XStack>
            <View w="100%" alignItems='center' justifyContent='center' pb={10} >
                <Anchor size={100} />
            </View>
            <H3 w="100%" textAlign='center' >
                {Intl.NumberFormat().format(anchorsQuery?.data?.total_amount ?? 0)} Anchors
            </H3>
            <Text w="80%" textAlign='center' color={'gray'} >
                Anchors can be used to perform a variety of onchain and Kade specific actions.
            </Text>
            <Link
                href={"/app-connect/store"}
                asChild
            >
                <Button variant='outlined' mt={20}  >
                    Get Anchors
                </Button>
            </Link>
            <Separator w="100%" />
            <YStack
                w="100%"
                mt={20}
            >
                <FlatList
                    data={anchorsQuery?.data?.transactions ?? []}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={(item) => {
                        return (
                            <YStack w="100%" >
                                <XStack w="100%" justifyContent='space-between' >
                                    <XStack columnGap={5} >
                                        {
                                            item.item.type == "deposit" ? <ArrowDownRight /> : <ArrowUpRight />
                                        }
                                        <Text>
                                            {
                                                item.item.type == "deposit" ? "Received" : "Sent"
                                            }
                                        </Text>
                                    </XStack>

                                    <XStack columnGap={5} >
                                        <Text>
                                            {Intl.NumberFormat().format(item.item.amount)}
                                        </Text>
                                    </XStack>
                                </XStack>
                                <Separator />
                            </YStack>
                        )
                    }}
                />
            </YStack>
        </YStack>
    )
}

export default Anchors