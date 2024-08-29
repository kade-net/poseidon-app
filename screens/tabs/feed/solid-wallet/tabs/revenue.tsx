import { View, Text, YStack } from 'tamagui'
import React from 'react'
import { SceneProps } from '../../../../profiles/tabs/common'
import RevenueTransaction from './revenue-transaction'
import { FlatList } from 'react-native'
import { mockTransactions } from './mock'
import {useQuery} from "@apollo/client";
import {GET_WALLET_REVENUE} from "../../../../../lib/convergence-client/queries";
import delegateManager from "../../../../../lib/delegate-manager";
import {convergenceClient} from "../../../../../data/apollo";
import Empty from "../../../../../components/ui/feedback/empty";

interface RevenueTabProps extends SceneProps { }

const RevenueTab = (props: RevenueTabProps) => {
    const { } = props
    const revenueQuery = useQuery(GET_WALLET_REVENUE, {
        variables: {
            user_address: delegateManager.owner!
        },
        client: convergenceClient
    })

    return (
        <YStack flex={1} w="100%" >
            <FlatList
                style={{
                    rowGap: 10,
                }}
                contentContainerStyle={{
                    rowGap: 10,
                }}
                data={revenueQuery?.data?.getWalletNotifications ?? []}
                renderItem={({ item }) => <RevenueTransaction data={item} />}
                ListEmptyComponent={()=> {
                    return <Empty
                        emptyText={'No in coming transactions found'}
                    />
                }}
            />
        </YStack>
    )
}

export default RevenueTab