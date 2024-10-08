import { View, Text, YStack, Spinner, XStack } from 'tamagui'
import React, { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { COMMUNITY_QUERY, GET_COMMUNITY_PUBLICATIONS, GET_MEMBERSHIP } from '../../../../utils/queries'
import BaseContentContainer from '../../../../components/ui/feed/base-content-container'
import useDisclosure from '../../../../components/hooks/useDisclosure'
import { FlatList, TouchableOpacity } from 'react-native'
import { MessageCirclePlus } from '@tamagui/lucide-icons'
import BaseContentSheet from '../../../../components/ui/action-sheets/base-content-sheet'
import PublicationEditor from '../../../../components/ui/editor/publication-editor'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import delegateManager from '../../../../lib/delegate-manager'
import { getMutedUsers, getRemovedFromFeed } from '../../../../contract/modules/store-getters'
import Loading from '../../../../components/ui/feedback/loading'
import Empty from '../../../../components/ui/feedback/empty'
import { isEmpty } from 'lodash'
import * as Haptics from 'expo-haptics'

interface Props {
    name: string
}

const CommunityFeed = (props: Props) => {
    const insets = useSafeAreaInsets()
    const { name } = props

    const membershipQuery = useQuery(GET_MEMBERSHIP, {
        variables: {
            communityName: name,
            userAddress: delegateManager.owner!
        }
    })
    const { data, loading, fetchMore } = useQuery(GET_COMMUNITY_PUBLICATIONS, {
        variables: {
            communityName: name,
            page: 0,
            size: 20,
            hide: getRemovedFromFeed(),
            muted: getMutedUsers()
        },
        skip: !name,
        onError: console.log
    })
    const communityQuery = useQuery(COMMUNITY_QUERY, {
        variables: {
            name
        },
        skip: !name,
        onCompleted: console.log
    })

    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()

    const handleFetchMore = async () => {
        const currentLength = data?.communityPublications?.length ?? 0

        if (currentLength < 15) {
            return
        }
        try {
            const totalPublications = data?.communityPublications?.length ?? 0
            const nextPage = (Math.floor(totalPublications / 20) - 1) + 1
            console.log("Next page", nextPage)
            const results = await fetchMore({
                variables: {
                    page: nextPage,
                    size: 20,
                    hide: getRemovedFromFeed(),
                    muted: getMutedUsers()
                }
            })



        }
        catch (e) {
            console.log("Error fetching more", e)
        }
    }

    const handleFetchTop = async () => {
        Haptics.selectionAsync()
        console.log("Start reached")
        try {
            await fetchMore({
                variables: {
                    page: 0,
                    size: 20,
                    hide: getRemovedFromFeed(),
                    muted: getMutedUsers()
                }
            })

        }
        catch (e) {
            console.log("Error fetching more", e)
        }
    }


    const renderPublication = useCallback(({ item }: any) => {
        return (
            <BaseContentContainer
                data={item as any}
                inCommunityFeed
            />
        )

    }, [])


    return (
        <YStack w="100%" flex={1} backgroundColor={"$background"} >
            <View style={{
                flex: 1,
                position: "relative",
                height: "100%",

            }} >
                <FlatList
                    refreshing={false}
                    onRefresh={handleFetchTop}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={1}
                    showsVerticalScrollIndicator={false}
                    data={data?.communityPublications ?? []}
                    maxToRenderPerBatch={20}
                    initialNumToRender={20}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={renderPublication}
                    ListFooterComponent={() => {
                        return <View w="100%" flexDirection='row' alignItems='center' justifyContent='center' columnGap={10} >
                            {loading && <>
                                <Text color="$gray9" >
                                    Loading...
                                </Text>
                                <Spinner />
                            </>}
                        </View>
                    }}
                    ListEmptyComponent={() => {
                        if (loading) return <Loading p={20} flex={1} w="100%" h="100%" />
                        return <Empty
                            flex={1}
                            p={20}
                            w="100%"
                            h="100%"
                            emptyText='No posts yet. Be the first to post!'
                            onRefetch={handleFetchTop}
                        />
                    }}

                    ListHeaderComponent={() => {
                        if (isEmpty(data?.communityPublications)) return null
                        if (loading) return <XStack w="100%" p={5} >
                            <Spinner />
                        </XStack>
                    }}

                />
                <View
                    position='absolute'
                    bottom={20}
                    right={20}
                    zIndex={2}
                >
                    {!isOpen && membershipQuery.data?.membership && <TouchableOpacity
                        onPress={onOpen}
                    >
                        <View
                            p={10}
                            borderRadius={100}
                            backgroundColor={"$button"} 
                            // color={"$buttonText"}
                            alignItems='center'
                            justifyContent='center'

                        >
                            <MessageCirclePlus color={"$buttonText"} />
                        </View>
                    </TouchableOpacity>}
                </View>
            </View>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[100]}
            >
                <View
                    flex={1}
                    h="100%"
                    pt={insets.top}
                    pb={insets.bottom}
                    backgroundColor={"$background"}
                >
                    <PublicationEditor
                        publicationType={1}
                        onClose={onClose}
                        // @ts-expect-error - ignoring for now // FIXME
                        defaultCommunity={communityQuery?.data?.community ?? undefined}
                    />
                </View>
            </BaseContentSheet>
        </YStack>
    )
}

export default CommunityFeed