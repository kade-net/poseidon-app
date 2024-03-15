import { View, Text, YStack, XStack, Avatar } from 'tamagui'
import React, { useDeferredValue, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { SEARCH_COMMUNITIES } from '../../../utils/queries'
import { FlatList, TouchableOpacity } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Home } from '@tamagui/lucide-icons'
import { Community } from '../../../__generated__/graphql'

interface Props {
    search: string
    onSelect?: (community: Partial<Community>) => void
}

const schema = z.object({
    community: z.string()
})

type SCHEMA = z.infer<typeof schema>

const Communities = (props: Props) => {
    const { search, onSelect } = props
    const searchDeffered = useDeferredValue(search)
    const communityQuery = useQuery(SEARCH_COMMUNITIES, {
        variables: {
            search: searchDeffered,
            page: 0,
            size: 20
        }
    })

    const form = useForm<SCHEMA>({
        resolver: zodResolver(schema)
    })

    const chosenCommunity = form.watch("community")

    useEffect(() => {
        if (chosenCommunity) {
            const community = communityQuery?.data?.communities?.find((community) => community.name == chosenCommunity) ?? {
                __typename: "Community",
                id: 0,
                name: "home",
                description: "",
                image: "",
            }
            community && onSelect?.(community)
        }
    }, [chosenCommunity])


    return (
        <YStack w="100%" >
            <Controller
                control={form.control}
                name="community"
                render={({ field }) => {
                    return (
                        <FlatList
                            data={[{
                                __typename: "Community",
                                id: 0,
                                name: "home",
                                description: "",
                                image: "",
                            }, ...(communityQuery?.data?.communities ?? [])]}
                            keyExtractor={(item) => item?.id?.toString()}
                            contentContainerStyle={{
                                rowGap: 10
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        field.onChange(item.name)
                                    }} >
                                        <XStack w="100%" columnGap={10} borderRadius={"$1"} px={5} py={5} alignItems='center' justifyContent='space-between' >
                                            <XStack columnGap={20} >
                                                {
                                                    item.name == "home" ?
                                                        <XStack
                                                            w="$4"
                                                            // h="$4"
                                                            alignItems='center'
                                                            justifyContent='center'
                                                        >
                                                            <Home />
                                                        </XStack> :
                                                        <Avatar circular >
                                                            <Avatar.Image
                                                                src={item.image ?? ""}

                                                            />
                                                            <Avatar.Fallback
                                                                bg="$pink10"
                                                            />
                                                        </Avatar>

                                                }
                                                <Text>
                                                    {item.name}
                                                </Text>
                                            </XStack>
                                            {
                                                field.value == item.name && <CheckCircle
                                                    color={"green"}
                                                />
                                            }
                                        </XStack>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    )
                }}
            />
        </YStack>
    )
}

export default Communities