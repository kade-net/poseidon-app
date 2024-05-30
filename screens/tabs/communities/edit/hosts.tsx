import { View, Text, YStack, XStack, Input, Button, Avatar, Separator, Spinner } from 'tamagui'
import React, { useEffect } from 'react'
import { Search } from '@tamagui/lucide-icons'
import { useQuery } from '@apollo/client'
import { COMMUNITY_MEMBERS_SEARCH, COMMUNITY_QUERY } from '../../../../utils/queries'
import { useLocalSearchParams } from 'expo-router'
import { FlatList } from 'react-native'
import MemberProfile from './member-profile'

const HostsEdit = () => {
    const [search, setSearch] = React.useState('')
    const params = useLocalSearchParams()
    const communityName = params?.name as string
    const searchResults = useQuery(COMMUNITY_MEMBERS_SEARCH, {
        variables: {
            communityName,
            search: ''
        }
    })

    const handleSearch = () => {
        searchResults.refetch({
            search,
            communityName
        })
    }

    useEffect(() => {
        if (search === '') {
            searchResults.refetch({
                search,
                communityName
            })
        }
    }, [search])

    return (
        <YStack flex={1} w="100%" h="100%" p={20} backgroundColor={'$background'} >
            <Text>
                Coming soon!
            </Text>
            {/* <XStack w="100%" columnGap={10} alignItems='center'  >
                <Input
                    value={search}
                    onChangeText={setSearch}
                    flex={1}
                    placeholder='Username...'
                />
                {
                    searchResults.loading ? <Spinner /> :
                        <Button
                            onPress={handleSearch}
                            disabled={searchResults.loading || search === ''}
                            icon={<Search />}
                        />
                }
            </XStack>
            <YStack flex={1} w="100%" >
                <FlatList
                    data={searchResults.data?.memberships}
                    keyExtractor={(item) => item.address}
                    renderItem={({ item }) => {
                        return <MemberProfile
                            // @ts-expect-error - we can safely ignore this
                            data={item}
                            community={communityName}
                        />
                    }}
                    ItemSeparatorComponent={() => <Separator />}
                />
            </YStack> */}
        </YStack>
    )
}

export default HostsEdit