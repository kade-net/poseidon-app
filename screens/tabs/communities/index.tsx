import '../../../global'
import { View, Text, YStack, XStack, H4, H5, Button, Separator, H6, Avatar, Spinner } from 'tamagui'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, PlusSquare } from '@tamagui/lucide-icons'
import { Animated, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { useQuery } from 'react-query'
import community from '../../../contract/modules/community'
import UserMembership from './membership'
// TODO: if user has no anchors show bottom sheet leading them to buy some
const Communities = () => {
    const communitiesQuery = useQuery({
        queryKey: ['memberships'],
        queryFn: community.getCommunities
    })


    return (

            <Animated.FlatList
                data={communitiesQuery.data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    width: '100%',
                }}
            onStartReached={() => communitiesQuery?.refetch()}
            onEndReached={() => communitiesQuery?.refetch()}
            onEndReachedThreshold={1}
            refreshing={communitiesQuery.isFetching}
            ListFooterComponent={() => {
                if (!communitiesQuery.isLoading) return null
                return (
                    <XStack w="100%" p={20} justifyContent='center' alignItems='center' columnGap={20} >
                        <Spinner />
                        <Text>
                            Loading...
                        </Text>
                    </XStack>
                )
            }}
            ItemSeparatorComponent={() => <Separator />}
            renderItem={({ item }) => {
                return (
                    // @ts-expect-error - gql generated types are too strict
                    <UserMembership data={item} />
                    )
                }}
        />
    )
}

export default Communities