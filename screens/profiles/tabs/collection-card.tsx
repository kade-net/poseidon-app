import { View, Text, YStack, Image, Spinner } from 'tamagui'
import React from 'react'
import { GetAccountCollectionsWithOwnedTokenResponse } from '@aptos-labs/ts-sdk'
import { TouchableOpacity } from 'react-native'
import { useQuery } from 'react-query'
import { Utils } from '../../../utils'
import { Link, useGlobalSearchParams } from 'expo-router'

type COLLECTION = GetAccountCollectionsWithOwnedTokenResponse['0'] & { first_uri: string }

interface Props {
    data: COLLECTION
}
const CollectionCard = (props: Props) => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string
    const { data } = props
    const validateImageQuery = useQuery({
        queryKey: [data.collection_id, data.first_uri],
        queryFn: () => Utils.validateImageUri(data.first_uri ?? '')
    })

    if (validateImageQuery.isLoading) return (
        <YStack flex={1} aspectRatio={1} alignItems='center' justifyContent='center' >
            <Spinner />
        </YStack>
    )

    if (!validateImageQuery.data) return (
        <YStack bg='$button' flex={1} aspectRatio={1} borderRadius={5} overflow='hidden' alignItems='center' justifyContent='center'  >
            <Text>
                {data?.collection_name ?? 'Untitled'}
            </Text>
        </YStack>
    )

    return (
        <Link
            asChild
            href={{
                pathname: '/profiles/[address]/[collection]/',
                params: {
                    address: address as string,
                    collection: data.collection_id!
                }
            }}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    padding: 5
                }}
            >
                <YStack aspectRatio={1} borderRadius={5} overflow='hidden'  >
                    <Image
                        src={data.first_uri ?? ''}
                        aspectRatio={1}
                    />
                </YStack>
            </TouchableOpacity>
        </Link>
    )
}

export default CollectionCard