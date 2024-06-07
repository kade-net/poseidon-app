import { View, Text, YStack, XStack, Avatar, Spinner, Separator } from 'tamagui'
import React, { useCallback, useDeferredValue } from 'react'
import { ACCOUNTS_SEARCH_QUERY, MENTION_USER_SEARCH } from '../../../utils/queries'
import { useQuery } from '@apollo/client'
import { FlatList, SectionList, TouchableOpacity } from 'react-native'
import delegateManager from '../../../lib/delegate-manager'
import { Utils } from '../../../utils'

interface Props {
    search: string
    onSelect: (username: string, address: string) => void
}
const UserMentionsSearch = (props: Props) => {
    const currentMention = useDeferredValue(props.search?.replace("@", '') ?? "")

    const mentionsQuery = useQuery(MENTION_USER_SEARCH, {
        variables: {
            search: currentMention,
            userAddress: delegateManager.owner!
        },
        skip: currentMention?.length < 1
    })

    const handleSelect = (username: string, address: string) => {
        props?.onSelect?.(username, address)
    }

    const renderItem = useCallback(({ item }: any) => {
        return (
            <TouchableOpacity onPress={() => handleSelect(item?.username?.username, item?.address)} >
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
            {
                mentionsQuery?.loading && <XStack w="100%" p={10} alignItems='center' justifyContent='center' >
                    <Spinner />
                </XStack>
            }
            {((mentionsQuery?.data?.accountsSearch?.length ?? 0) > 0) &&
                mentionsQuery?.data?.accountsSearch?.map((item, i) => {
                    return (
                        <YStack w="100%" key={i} >

                            <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => handleSelect(item?.username?.username!, item?.address)} >
                                <XStack w="100%" columnGap={10} p={20} >
                                    <Avatar circular size={"$3"} >
                                        <Avatar.Image src={
                                            Utils.parseAvatarImage(item?.address, item?.profile?.pfp)
                                        } />
                                        <Avatar.Fallback bg="$pink10" />
                                    </Avatar>
                                    <YStack>
                                        <Text fontSize={"$sm"} >{item?.profile?.display_name}</Text>
                                        <Text fontSize={"$xs"} color="gray" >@{item?.username?.username}</Text>
                                    </YStack>
                                </XStack>
                            </TouchableOpacity>
                            <Separator w="100%" />
                        </YStack >
                    )
                })
            }
        </YStack>
    )
}

export default UserMentionsSearch