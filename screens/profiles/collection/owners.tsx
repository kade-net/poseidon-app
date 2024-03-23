import { View, Text, YStack, H2, Separator } from 'tamagui'
import React from 'react'
import { useQuery } from 'react-query'
import { useQuery as useApolloQuery } from '@apollo/client'
import collected from '../../../contract/modules/collected'
import { GET_COLLECTION_COLLECTORS } from '../../../support-gql-clients/queries/barnicle'
import { FlatList } from 'react-native'
import ProfileCard from '../../../components/ui/profile/profile-card'
import { barnicleClient } from '../../../data/apollo'

interface Props {
    collection_id: string
    address: string
}

const CollectionOwners = (props: Props) => {
    const { collection_id, address } = props
    console.log('collection::', collection_id)
    const collection = useQuery({
        queryKey: ['collection', collection_id],
        queryFn: () => collected.getCollection(collection_id, address),
    })

    const collectionOwners = useApolloQuery(GET_COLLECTION_COLLECTORS, {
        variables: {
            collectionAddress: collection_id,
            page: 0,
            size: 20
        },
        client: barnicleClient,
    })


    const handleFetchMore = async () => {

        const currentCount = collectionOwners.data?.collectors?.length ?? 0
        const currentPage = Math.floor(currentCount / 20) - 1
        const nextPage = currentPage + 1
        console.log('fetching more', nextPage)

        try {
            await collectionOwners.fetchMore({
                variables: {
                    collectionAddress: collection_id,
                    page: nextPage,
                    size: 20
                }
            })
        }
        catch (e) {
            console.log(`Something went wrong: ${e}`)
        }

    }

    const handleFetchTop = async () => {
        try {
            await collectionOwners.fetchMore({
                variables: {
                    collectionAddress: collection_id,
                    page: 0,
                    size: 20
                }
            })
        }
        catch (e) {
            console.log(`Something went wrong: ${e}`)
        }
    }


    return (
        <YStack w="100%" flex={1} >
            <YStack w="100%" p={20} >
                <H2 textTransform='capitalize' >
                    {collection?.data?.collection_name ?? 'Untitled'}
                </H2>
                <Text>
                    {collection?.data?.description ?? 'No description'}
                </Text>
            </YStack>
            <Separator />
            <YStack flex={1}  >

                <FlatList
                    key={collection_id}
                    data={collectionOwners?.data?.collectors ?? []}
                    keyExtractor={(item, i) => item.address}
                    renderItem={({ item }) => {
                        return (
                            <ProfileCard data={item as any} />
                        )
                    }}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={1}
                    onRefresh={handleFetchTop}
                    refreshing={collectionOwners.loading}

                />
            </YStack>
        </YStack>
    )
}

export default CollectionOwners