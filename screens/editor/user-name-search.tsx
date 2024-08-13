import { View, FlatList, TouchableOpacity, Platform } from 'react-native'
import React, { memo, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../schema'
import { useQuery } from '@apollo/client'
import { MENTION_USER_SEARCH } from '../../utils/queries'
import { Utils } from '../../utils'
import delegateManager from '../../lib/delegate-manager'
import { Separator, Text, XStack, YStack } from 'tamagui'
import BaseAvatar from '../../components/ui/avatar'
import * as Haptics from 'expo-haptics'

interface Props {
    form: UseFormReturn<TPUBLICATION, any, any>
    selection: { start: number, end: number }
}

const UserNameSearch = (props: Props) => {
    const { form, selection } = props
    const CONTENT = form.watch('content') ?? ""
    const currentMention = useMemo(() => {
        if (CONTENT.length < 2) return ""

        const CONTENT_BEFORE_CURSOR = CONTENT.slice(0, selection.start + 1) ?? ""
        const WORDS_BEFORE_CURSOR = CONTENT_BEFORE_CURSOR.split(" ") ?? []
        const LAST_WORD = WORDS_BEFORE_CURSOR?.[WORDS_BEFORE_CURSOR.length - 1] ?? ""

        const currentMention = Utils.mentionRegex.test(LAST_WORD) ? LAST_WORD?.replace("@", "") : ""

        return currentMention
    }, [CONTENT])

    const mentionsQuery = useQuery(MENTION_USER_SEARCH, {
        variables: {
            search: currentMention,
            userAddress: delegateManager.owner!
        },
        skip: currentMention?.length < 1
    })

    const handleReplaceMention = (username: string) => {
        Haptics.selectionAsync()
        const updated = CONTENT.slice(0, selection.start - (currentMention.length + 1)) + `@${username} ` + CONTENT.slice(selection.end)

        form.setValue('content', updated)
        const address = mentionsQuery?.data?.accountsSearch?.find((account) => account?.username?.username === username)?.address
        const currentMentions = form.getValues('mentions') ?? {} as Record<string, string>
        form.setValue('mentions', {
            ...currentMentions,
            [username]: address ?? ''
        })
    }


    return (
        <FlatList
            style={{
                width: '100%',
                zIndex: 1000,
            }}
            contentContainerStyle={{
                rowGap: 10,
                paddingTop: 20,
            }}
            disableScrollViewPanResponder
            scrollEnabled={false}
            data={mentionsQuery?.data?.accountsSearch ?? []}
            keyExtractor={(item) => item?.address}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            handleReplaceMention(item?.username?.username ?? '')
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
            ItemSeparatorComponent={() => <Separator borderColor={'$border'} />}
        />
    )
}

export default memo(UserNameSearch)