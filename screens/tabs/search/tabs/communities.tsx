import { View, Text, YStack, XStack, Spinner } from 'tamagui'
import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { SEARCH_COMMUNITIES } from '../../../../utils/queries'
import { Dimensions, FlatList } from 'react-native'
import CommunityCard from '../../../../components/ui/community/community-card'
import searchContext from '../context'
import Loading from '../../../../components/ui/feedback/loading'
import Empty from '../../../../components/ui/feedback/empty'

const DEVICE_HEIGHT = Dimensions.get('screen').height

const CommunitiesSearch = () => {
    const { search } = useContext(searchContext)
    const communitiesQuery = useQuery(SEARCH_COMMUNITIES, {
        variables: {
            search,
            page: 0,
            size: 20
        },
        onError: (error) => {
            console.error(error)
        }
    })


    const handleFetchMore = async () => {
        const currentPage = Math.floor(
            ((communitiesQuery?.data?.communities?.length ?? 0) / 20) - 1
        )

        await communitiesQuery.fetchMore({
            variables: {
                page: currentPage + 1,
                search,
                size: 20
            }
        })
    }


    const handleFetchTop = async () => {
        await communitiesQuery.fetchMore({
            variables: {
                page: 0,
                search,
                size: 20
            }
        })
    }

    return (
        <YStack  >
            <FlatList
                data={communitiesQuery?.data?.communities ?? []}
                keyExtractor={(item) => item.name}
                refreshing={false}
                onRefresh={handleFetchTop}
                onEndReached={handleFetchMore}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={1}
                contentContainerStyle={{
                    paddingBottom: 40
                }}
                renderItem={({ item }) => {
                    return (
                        <CommunityCard
                            community={item}
                        />
                    )
                }}
                ListEmptyComponent={() => {
                    if (communitiesQuery.loading) return <Loading
                        h={DEVICE_HEIGHT - 400}
                    />
                    return <Empty
                        emptyText='No communities found'
                        h={DEVICE_HEIGHT - 400}
                    />
                }}
            />
        </YStack>
    )
}

export default CommunitiesSearch