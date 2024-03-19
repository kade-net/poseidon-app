import { View, Text, YStack, XStack, Avatar, Spinner, Separator } from 'tamagui'
import React, { useCallback, useDeferredValue } from 'react'
import { ACCOUNTS_SEARCH_QUERY } from '../../../utils/queries'
import { useQuery } from '@apollo/client'
import { FlatList, TouchableOpacity } from 'react-native'

interface Props {
    search: string
    onSelect: (username: string) => void
}
const UserMentionsSearch = (props: Props) => {
    const currentMention = useDeferredValue(props.search?.replace("@", '') ?? "")

    const mentionsQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
        variables: {
            search: currentMention,
            page: 0,
            size: 5
        },
        skip: currentMention?.length < 1
    })

    const handleSelect = (username: string) => {
        props?.onSelect?.(username)
    }

    const renderItem = useCallback(({ item }: any) => {
        return (
            <TouchableOpacity onPress={() => handleSelect(item?.username?.username)} >
                <XStack w="100%" columnGap={10} p={20} >
                    <Avatar circular size={"$3"} >
                        <Avatar.Image src={item?.profile?.pfp ?? ''} />
                        <Avatar.Fallback bg="$pink10" />
                    </Avatar>
                    <YStack>
                        <Text fontSize={"$sm"} >{item?.profile?.display_name}</Text>
                        <Text fontSize={"$xs"} color="gray" >@{item?.username?.username}</Text>
                    </YStack>
                </XStack>
            </TouchableOpacity>
        )

    }, [])

    return (
        <YStack w="100%" >
            <FlatList
                data={mentionsQuery?.data?.accounts}
                keyExtractor={(item) => item?.address}
                refreshing={mentionsQuery?.loading}

                renderItem={renderItem}
                ListFooterComponent={() => {
                    if (!mentionsQuery?.loading) return null
                    return <XStack w="100%" alignItems='center' justifyContent='center' p={20} columnGap={10}>
                        <Spinner />
                        <Text>Searching...</Text>
                    </XStack>
                }}
                ItemSeparatorComponent={() => <Separator />}
            />
        </YStack>
    )
}

export default UserMentionsSearch