import { View, Text, Image, H3, Separator, Button } from 'tamagui'
import React, { useEffect } from 'react'
import { XStack, YStack } from 'tamagui'
import CollectionImage from './collection-image'
import { useQuery } from 'react-query'
import collected from '../../../contract/modules/collected'
import { Link, useGlobalSearchParams } from 'expo-router'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useQuery as useApolloQuery } from '@apollo/client'
import { GET_COLLECTION_DETAILS } from '../../../support-gql-clients/queries/barnicle'
import { barnicleClient } from '../../../data/apollo'
import delegateManager from '../../../lib/delegate-manager'
import { GET_MY_PROFILE } from '../../../utils/queries'



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
        <YStack
            flex={1}
        >

            <CollectionImage image={collection.data?.first_uri!} name={collection?.data?.collection_name ?? 'Untitled'} />

            <YStack w="100%" px={5} py={10} rowGap={20} >
                <YStack w="100%" rowGap={10}  >
                    <H3>
                        {
                            tokenQuery?.data?.at(0)?.current_token_data?.token_name ?? 'Untitled'
                        }
                    </H3>
                    {collectionDetailsQuery?.data && <Text>
                        {collectionDetailsQuery?.data?.collection?.description ?? 'No description'}
                    </Text>}
                    {collectionDetailsQuery?.data && <Text>
                        Owned by {
                            address == delegateManager.owner ? 'you' : profileQuery?.data?.account?.profile?.display_name ?? 'this user'
                        } and <Text color={'palegreen'} >
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
                    <Button iconAfter={<ArrowRight />} >
                        View Other Owners
                    </Button>
                </Link>
            </YStack>
        </YStack>
    )
}

export default Collection