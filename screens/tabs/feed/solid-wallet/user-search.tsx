import { View, Text, YStack, XStack, Separator, ScrollView } from 'tamagui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { MENTION_USER_SEARCH } from '../../../../utils/queries'
import { useQuery } from '@apollo/client'
import delegateManager from '../../../../lib/delegate-manager'
import SearchInput from '../../../../components/ui/search-input'
import { FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import BaseAvatar from '../../../../components/ui/avatar'
import { Utils } from '../../../../utils'
import Empty from '../../../../components/ui/feedback/empty'

const isActualAddress = (address: string) => {
    return address.length === 66 && address.startsWith('0x')
}

interface Props {
    onSelect: (address: string) => void
}

const UserSearch = (props: Props) => {
    const { onSelect } = props
    const [name, setName] = React.useState('')

    const searchQuery = useQuery(MENTION_USER_SEARCH, {
        variables: {
            search: name,
            userAddress: delegateManager.owner!
        },
        skip: isActualAddress(name)
    })




    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                width: '100%',
                height: '100%'
            }}

            behavior={Platform.select({
                ios: 'padding',
                android: 'height'
            })}

            keyboardVerticalOffset={Platform.select({
                ios: 100,
                android: 0
            })}
        >
            <YStack flex={1} w="100%" alignItems='center' rowGap={20} p={20} >
                <XStack w="100%" >
                    <SearchInput
                        placeholder='Search for a user'
                        value={name}
                        onChangeText={setName}
                    />
                </XStack>
                <FlatList
                    style={{
                        width: '100%'
                    }}
                    data={searchQuery?.data?.accountsSearch ?? []}
                    scrollEnabled={false}
                    disableScrollViewPanResponder
                    pinchGestureEnabled={false}
                    ListHeaderComponent={() => {
                        if (!isActualAddress(name)) return null
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelect(name)
                                }}
                            >
                                <XStack columnGap={10} w="100%" py={10} >
                                    <BaseAvatar
                                        size='$md'
                                        src={Utils.parseAvatarImage(name ?? '1')}
                                    />
                                    <YStack>
                                        <Text fontSize={18} fontWeight={'600'} >
                                            Address
                                        </Text>
                                        <Text color={'$sideText'} >
                                            {Utils.formatAddress(name)}
                                        </Text>
                                    </YStack>
                                </XStack>
                            </TouchableOpacity>
                        )
                    }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelect(item?.address)
                                }}
                            >
                                <XStack columnGap={10} w="100%" py={10} >
                                    <BaseAvatar
                                        size='$md'
                                        src={Utils.parseAvatarImage(item?.address ?? '1', item?.profile?.pfp)}
                                    />
                                    <YStack>
                                        <Text fontSize={18} fontWeight={'600'} >
                                            {item?.profile?.display_name}
                                        </Text>
                                        <Text color={'$sideText'} >
                                            @{item?.username?.username}
                                        </Text>
                                    </YStack>
                                </XStack>
                            </TouchableOpacity>
                        )
                    }}
                    ListEmptyComponent={() => {
                        if (isActualAddress(name)) return null
                        return <Empty
                            emptyText='No users found'
                        />
                    }}
                    ItemSeparatorComponent={() => <Separator borderColor={'$border'} />}
                />
            </YStack>
        </KeyboardAvoidingView>
    )
}

export default UserSearch