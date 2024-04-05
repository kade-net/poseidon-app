import { View, Text, YStack, XStack, Spinner } from 'tamagui'
import React from 'react'
import { useQuery } from '@apollo/client'
import { SEARCH_COMMUNITIES } from '../../../../utils/queries'
import { FlatList } from 'react-native'
import CommunityCard from '../../../../components/ui/community/community-card'

interface Props {
    search: string
}

const CommunitiesSearch = (props: Props) => {
    const { search } = props
    const communitiesQuery = useQuery(SEARCH_COMMUNITIES, {
        variables: {
            search,
            page: 0,
            size: 20
        },
        onError: (error) => {
            console.error(error)
        },
        onCompleted: (data) => {
            console.log(`Data::`, data)
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
                refreshing={communitiesQuery.loading}
                onRefresh={handleFetchTop}
                onEndReached={handleFetchMore}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={1}
                contentContainerStyle={{
                    paddingBottom: 40
                }}
                ListFooterComponent={() => {
                    return (
                        <XStack w="100%" alignItems='center' justifyContent='center' >
                            {
                                communitiesQuery?.loading ? <Spinner /> : null
                            }
                        </XStack>
                    )
                }}
                renderItem={({ item }) => {
                    return (
                        <CommunityCard
                            community={item}
                        />
                    )
                }}
            />
        </YStack>
    )
}

export default CommunitiesSearch