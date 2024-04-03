import { View, Text, YStack, XStack, Spinner } from 'tamagui'
import React from 'react'
import CollectionImage from './collection-image'
import { useGlobalSearchParams } from 'expo-router'
import { useQuery } from 'react-query'
import collected from '../../../contract/modules/collected'
import { FlatList } from 'react-native'
import VariantCard from './variant-card'
import { LinearGradient } from 'expo-linear-gradient'
import { Anchor } from '@tamagui/lucide-icons'

const Unminted = () => {

    const params = useGlobalSearchParams()
    const collection_id = params['collection'] as string
    const address = params['address'] as string

    const collection = useQuery({
        queryKey: ['collection', collection_id],
        queryFn: () => collected.getCollection(collection_id, address),
    })

    const collectionDetails = useQuery({
        queryKey: ["collection", collection_id, "variants"],
        queryFn: () => collected.getVariants(collection?.data?.collection_name!),
        enabled: !!collection?.data?.collection_name,
    })

    if (collection.isLoading || collectionDetails.isLoading) return (
        <YStack w="100%" h="100%" alignItems='center' justifyContent='center' backgroundColor={'$background'} >
            <Spinner />
        </YStack>
    )

    return (
        <YStack
            flex={1}
            w="100%"
            height={"100%"}
            backgroundColor={'$background'}
        >
            <FlatList
                data={collectionDetails?.data?.collection?.variants ?? []}
                keyExtractor={(variant) => variant.id}
                numColumns={2}
                contentContainerStyle={{
                    columnGap: 20
                }}
                ListHeaderComponent={() => {
                    return (
                        <YStack w="100%" >

                            <CollectionImage
                                image={collection?.data?.first_uri!}
                                name={collection?.data?.collection_name ?? 'Untitled'}
                            />
                            <Text
                                p={20}
                                fontSize={"$md"}
                            >
                                {
                                    collection?.data?.description
                                }
                            </Text>
                            {
                                (collectionDetails?.data?.collection?.anchor_amount ?? 0) > 0 ?
                                    <XStack w="100%" justifyContent='space-between' px={20} pb={20} >
                                        <XStack columnGap={20} >

                                            <Anchor />
                                            <Text>
                                                {
                                                    collectionDetails?.data?.collection?.anchor_amount
                                                }
                                            </Text>
                                        </XStack>

                                        <XStack>
                                            <Text>
                                                {collectionDetails?.data?.minted ?? 0} / {collectionDetails?.data?.collection?.max_supply} minted
                                            </Text>
                                        </XStack>
                                    </XStack> : null
                            }
                        </YStack>
                    )
                }}
                renderItem={({ item }) => {
                    return <VariantCard
                        data={item}
                    />
                }}
            />




        </YStack>
    )
}

export default Unminted