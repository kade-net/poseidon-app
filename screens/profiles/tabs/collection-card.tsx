import { View, Text, YStack, Image, Spinner, XStack } from 'tamagui'
import React, { useEffect } from 'react'
import { GetAccountCollectionsWithOwnedTokenResponse } from '@aptos-labs/ts-sdk'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { useQuery } from 'react-query'
import { Utils } from '../../../utils'
import { Link, useGlobalSearchParams } from 'expo-router'
import { Anchor, Lock, Unlock } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'

type COLLECTION = GetAccountCollectionsWithOwnedTokenResponse['0'] & { first_uri: string, is_internal?: boolean, is_locked?: boolean, description?: string }

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

    const ImageData = useQuery({
        queryKey: [data.collection_id, data.first_uri, 'data'],
        queryFn: () => Utils.getImageData(data.first_uri ?? ''),
        enabled: (!validateImageQuery.isFetching && !validateImageQuery.isLoading && !validateImageQuery.data)
    })

    useEffect(() => {
        ; (async () => {
            if (!validateImageQuery.isFetching) {
                const json = await Utils.getImageData(data.first_uri ?? '')
            }

        })()
    }, [validateImageQuery.isFetching])

    if (validateImageQuery.isLoading || ImageData.isLoading) return (
        <YStack flex={1} aspectRatio={1} alignItems='center' justifyContent='center' >
            <Spinner />
        </YStack>
    )

    if (!validateImageQuery.data && !ImageData.data) return (
        <YStack borderColor={'$primary'} flex={1} aspectRatio={1} borderRadius={5} overflow='hidden' alignItems='center' justifyContent='center'  >
            <Text>
                {data?.collection_name ?? 'Untitled'}
            </Text>
        </YStack>
    )

    return (
        <Link
            asChild
            href={{
                pathname: data?.is_internal ? '/profiles/[address]/[collection]/unminted' : '/profiles/[address]/[collection]/',
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
                {
                    data?.is_internal ? (
                        <ImageBackground
                            src={data?.first_uri ?? ''}
                            style={{
                                aspectRatio: 1,
                                justifyContent: 'flex-end',
                                position: 'relative'
                            }}
                        >
                            <LinearGradient
                                colors={[
                                    'transparent', 'rgba(0,0,0,0.8)'
                                ]}
                                style={{
                                    flex: 1
                                }}
                            >

                                <YStack w="100%" flex={1} h="100%" justifyContent='flex-end' p={20} rowGap={10} >

                                    <XStack columnGap={10} alignItems='flex-end' >
                                        {
                                            data?.is_locked ? <Anchor color="yellow" /> : <Unlock color={'green'} />
                                        }
                                        <Text color={'white'} >
                                            {
                                                data?.is_locked ? "Get with Anchors" : "Unlocked"
                                            }
                                        </Text>
                                    </XStack>
                                    <Text color={'white'} >
                                        {data?.description}
                                    </Text>
                                </YStack>
                            </LinearGradient>
                        </ImageBackground>
                    ) : (
                            <YStack aspectRatio={1} borderRadius={5} overflow='hidden'  >
                    <Image
                                    src={ImageData?.data ?? data.first_uri ?? ''}
                        aspectRatio={1}
                    />
                </YStack>
                    )
                }

            </TouchableOpacity>
        </Link>
    )
}

export default CollectionCard