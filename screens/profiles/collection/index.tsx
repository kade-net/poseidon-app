import { View, Text, Image, H3, Separator, Button, ScrollView } from 'tamagui'
import React, { useEffect } from 'react'
import { XStack, YStack } from 'tamagui'
import CollectionImage from './collection-image'
import { useQuery } from 'react-query'
import collected from '../../../contract/modules/collected'
import { Link, useGlobalSearchParams } from 'expo-router'
import { ArrowRight, Info } from '@tamagui/lucide-icons'
import { useQuery as useApolloQuery } from '@apollo/client'
import { GET_COLLECTION_DETAILS } from '../../../support-gql-clients/queries/barnicle'
import { barnicleClient } from '../../../data/apollo'
import delegateManager from '../../../lib/delegate-manager'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { Utils } from '../../../utils'



const Collection = () => {
    const params = useGlobalSearchParams()
    const collection_id = params['collection'] as string
    const address = params['address'] as string
    const profileQuery = useApolloQuery(GET_MY_PROFILE, {
        variables: {
            address
        }
    })
    const collection = useQuery({
        queryKey: ['collection', collection_id],
        queryFn: () => collected.getCollection(collection_id, address),
    })

    const ImageData = useQuery({
        queryKey: [collection_id, collection?.data?.first_uri, 'data'],
        queryFn: () => Utils.getImageData(collection?.data?.first_uri ?? ''),
        enabled: (!collection.isLoading && !collection.isFetching && !collection.data)
    })
    // console.log("Images data")

    const tokenQuery = useQuery({
        queryFn: () => collected.getTokens(collection_id, address),
        queryKey: ['tokens', collection_id, address]
    })

    const collectionDetailsQuery = useApolloQuery(GET_COLLECTION_DETAILS, {
        client: barnicleClient,
        variables: {
            collectionAddress: collection_id
        },

    })





    return (
        <ScrollView
            flex={1}
            backgroundColor={'$background'}
            px={Utils.dynamicWidth(3)}
        >

            <CollectionImage image={ImageData?.data?.image ?? collection.data?.first_uri!} name={collection?.data?.collection_name ?? 'Untitled'} />

            <YStack w="100%" px={5} py={10} rowGap={20} >
                <XStack w="100%" columnGap={10} >
                    <Info color={'aqua'} />
                    <Text color={'aqua'} textAlign='left' flex={1} w="100%"  >
                        It may take a sec for us to index all this collection's data.
                    </Text>
                </XStack>
                <YStack w="100%" rowGap={10}  >
                    <H3>
                        {
                            tokenQuery?.data?.at(0)?.current_token_data?.token_name ?? 'Untitled'
                        }
                    </H3>

                    {collectionDetailsQuery?.data && <Text fontSize={"$sm"}>
                        {collectionDetailsQuery?.data?.collection?.description ?? 'No description'}
                    </Text>}
                    {collectionDetailsQuery?.data && <Text fontSize={"$sm"}>
                        Owned by {
                            address == delegateManager.owner ? 'you' : profileQuery?.data?.account?.profile?.display_name ?? 'this user'
                        } and <Text color={"$COAText"} >
                            {(collectionDetailsQuery?.data?.collection?.kade_collectors_count ?? 1) - 1} others on the network
                        </Text>
                    </Text>}
                </YStack>
                <Separator />
                <Link
                    asChild
                    href={{
                        pathname: '/profiles/[address]/[collection]/owners',
                        params: {
                            address,
                            collection: collection_id
                        }
                    }}
                >
                    <Button iconAfter={<ArrowRight />} backgroundColor={"$button"} color={"$buttonText"} fontSize={"$sm"}>
                        View Other Owners
                    </Button>
                </Link>
            </YStack>
        </ScrollView>
    )
}

export default Collection