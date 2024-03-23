import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { Spinner, XStack, YStack } from 'tamagui'
import { useQuery } from '@apollo/client'
import { GET_ACCOUNT_FOLLOWERS, GET_ACCOUNT_FOLLOWING } from '../../../utils/queries'
import ProfileCard from '../../../components/ui/profile/profile-card'

interface Props {
    address: string
}
const Following = (props: Props) => {
    const { address } = props
    const followersQuery = useQuery(GET_ACCOUNT_FOLLOWING, {
        variables: {
            accountAddress: address,
            page: 0,
            size: 20
        }
    })

    const handleFetchMore = async () => {
        if (followersQuery.loading) return null
        const currentPage = Math.floor(((followersQuery.data?.following?.length ?? 0) / 20)) - 1
        const next = currentPage + 1
        await followersQuery.fetchMore({
            variables: {
                page: next,
                size: 20,
                accountAddress: address
            }
        })
    }

    const handleFetchTop = async () => {
        if (followersQuery.loading) return null
        await followersQuery.fetchMore({
            variables: {
                page: 0,
                size: 20,
                accountAddress: address
            }
        })
    }

    return (
        <YStack backgroundColor={'$background'} flex={1} >
            <FlatList
                data={followersQuery?.data?.following ?? []}
                keyExtractor={(item) => item?.address}
                renderItem={({ item }) => {
                    return <ProfileCard
                        data={item as any}
                    />
                }}
                onEndReached={handleFetchMore}
                onEndReachedThreshold={1}
                onStartReached={handleFetchTop}
                ListFooterComponent={() => {
                    return <XStack w="100%" alignItems='center' justifyContent='center' p={20} >
                        {
                            followersQuery.loading ? <Spinner /> : null
                        }
                    </XStack>
                }}
            />
        </YStack>
    )
}

export default Following