import '../../../global'
import { View, Text, YStack, XStack, H4, H5, Button, Separator, H6, Avatar, Spinner, useTheme, setRef } from 'tamagui'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowRight, Plus, PlusSquare, Users } from '@tamagui/lucide-icons'
import { Dimensions, FlatList } from 'react-native'
import { Link } from 'expo-router'
import community from '../../../contract/modules/community'
import UserMembership from './membership'
import { useQuery } from '@apollo/client'
import { GET_ACCOUNT_COMMUNITIES } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'

const DEVICE_HEIGHT = Dimensions.get('screen').height

const Communities = () => {
    const tamaguiTheme = useTheme()
    const [refreshing, setRefreshing] = useState(false)

    // const communitiesQuery = useQuery({
    //     queryKey: ['memberships'],
    //     queryFn: community.getCommunities
    // })

    const accountCommunitiesQuery = useQuery(GET_ACCOUNT_COMMUNITIES, {
        variables: {
            accountAddress: delegateManager.owner!,
            page: 0,
            size: 20
        },
        onError: (error) => {

            console.log("Error: ", error.message, error.stack,)

        }
    })

    const handleFetchMore = async () => {
        const currentLength = accountCommunitiesQuery?.data?.accountCommunities?.length ?? 0

        if (currentLength < 15) {
            return
        }
        try {
            const totalPublications = accountCommunitiesQuery?.data?.accountCommunities?.length ?? 0
            const nextPage = (Math.floor(totalPublications / 20) - 1) + 1
            console.log("Next page", nextPage)
            const results = await accountCommunitiesQuery.fetchMore({
                variables: {
                    page: nextPage,
                    size: 20
                }
            })
        }
        catch (e) {
            console.log("Error: ", e)
        }
    }

    const handleFetchTop = async () => {
        setRefreshing(true)
        try {

            await accountCommunitiesQuery.fetchMore({
                variables: {
                    page: 0,
                    size: 20
                }
            })


        }
        catch (e) {
            console.log("Error: ", e)
        }
        finally {
            setRefreshing(false)
        }
    }


    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
        >

            <FlatList
            style={

                    {
                        backgroundColor: tamaguiTheme.background.val,
                        flex: 1,
                    }

                }
                data={accountCommunitiesQuery?.data?.accountCommunities ?? []}
                keyExtractor={(item) => item.name?.toString() ?? '0'}
                // onStartReached={handleFetchTop}
                onRefresh={handleFetchTop}
                onEndReached={handleFetchMore}
                // onStartReachedThreshold={0.5}
            onEndReachedThreshold={1}
                refreshing={false}
            ListFooterComponent={() => {
                if (!accountCommunitiesQuery?.loading) return null
                if ((accountCommunitiesQuery?.data?.accountCommunities?.length ?? 0) === 0) return null
                return (
                    <XStack w="100%" p={20} justifyContent='center' alignItems='center' columnGap={20} >
                        <Spinner />
                        <Text>
                            Loading...
                        </Text>
                    </XStack>
                )
            }}
                ListHeaderComponent={() => {
                    if (refreshing) return <XStack w="100%" alignItems='center' justifyContent='center' py={5} >
                        <Spinner />
                    </XStack>
                }}

            ItemSeparatorComponent={() => <Separator />}
            renderItem={({ item }) => {
                return (
                    // @ts-ignore
                    <UserMembership data={item} />
                    )
                }}
                ListEmptyComponent={() => {
                    if ((accountCommunitiesQuery.data?.accountCommunities?.length ?? 0) === 0 && accountCommunitiesQuery.loading) return <Loading
                        h={
                            DEVICE_HEIGHT - 200
                        }
                    />
                    return <Empty
                        emptyText={`You have no communities`}
                        h={
                            DEVICE_HEIGHT - 200
                        }
                    />
                }}
        />
        </YStack>
    )
}

export default Communities