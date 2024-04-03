import { View, Text, YStack, Image, Spinner, XStack } from 'tamagui'
import React from 'react'
import { GetAccountCollectionsWithOwnedTokenResponse } from '@aptos-labs/ts-sdk'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { useQuery } from 'react-query'
import { Utils } from '../../../utils'
import { Link, useGlobalSearchParams } from 'expo-router'
import { Anchor, Lock, Unlock } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'


type VARIANT = {
    timestamp: Date | null;
    id: string;
    name: string | null;
    description: string | null;
    image: string | null;
    collection_name: string | null;
}

interface Props {
    data: VARIANT
}
const VariantCard = (props: Props) => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string
    const { data } = props

    const validateImageQuery = useQuery({
        queryKey: [data.name, data.image],
        queryFn: () => Utils.validateImageUri(data.image ?? '')
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
                pathname: '/profiles/[address]/[collection]/[variant]/',
                params: {
                    address: address as string,
                    collection: data.collection_name!,
                    variant: data.name!
                }
            }}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    padding: 5
                }}
            >

                <ImageBackground
                    src={data?.image ?? ''}
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

                                <Text>
                                    {
                                        data?.name
                                    }
                                </Text>
                            </XStack>
                            <Text>
                                {data?.description}
                            </Text>
                        </YStack>
                    </LinearGradient>
                </ImageBackground>



            </TouchableOpacity>
        </Link>
    )
}

export default VariantCard