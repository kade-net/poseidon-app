import { View, Text, YStack, XStack, Spinner } from 'tamagui'
import React from 'react'
import { ProfileTabsProps, SceneProps, ScrollManager } from './common'
import { Animated, Platform } from 'react-native'
import { useQuery } from 'react-query'
import collected from '../../../contract/modules/collected'
import { useGlobalSearchParams } from 'expo-router'
import CollectionCard from './collection-card'
import delegateManager from '../../../lib/delegate-manager'
import { Info } from '@tamagui/lucide-icons'

const NftsTab = (props: ProfileTabsProps) => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string
    const nftsQuery = useQuery({
        queryFn: () => {
            return collected.getCollections(address)
        },
        queryKey: ['collections', address],
    })

    if (nftsQuery.isLoading) return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
            <Spinner />
        </YStack>
    )



    const renderCollection = ({ item }: any) => {
        console.log(item)
        return (
            <CollectionCard
                data={item}
            />
        )
    }

    return (
        <YStack w="100%" h="100%" px={5} >
            <Animated.FlatList
                // debug
                numColumns={2}
                horizontal={false}
                onMomentumScrollBegin={props.manager.onMomentumScrollBegin}
                onMomentumScrollEnd={props.manager.onMomentumScrollEnd}
                onScrollEndDrag={props.manager.onScrollEndDrag}
                ref={(ref) => props.manager.trackRef(props.route.key, ref as any)}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: props.manager.scrollY } } }],
                    { useNativeDriver: true }
                )}
                refreshing={nftsQuery.isLoading}
                contentContainerStyle={Platform.select({
                    ios: {
                        flexGrow: 1,
                        paddingBottom: 40,
                        columnGap: 5,
                        rowGap: 5
                    },
                    android: {
                        flexGrow: 1,
                        paddingBottom: 40,
                        paddingTop: props.topSectionHeight + 40,
                        columnGap: 5,
                        rowGap: 5
                    },
                })}
                contentOffset={Platform.select({
                    ios: {
                        y: -(props.topSectionHeight + 40),
                        x: 0
                    }
                })}
                contentInset={Platform.select({
                    ios: {
                        top: props.topSectionHeight + 40,
                    }
                })}
                onRefresh={nftsQuery.refetch}
                onEndReached={() => nftsQuery.refetch()}
                onStartReached={() => nftsQuery.refetch()}
                onEndReachedThreshold={1}
                showsVerticalScrollIndicator={false}
                data={nftsQuery?.data ?? []}
                maxToRenderPerBatch={20}
                initialNumToRender={20}
                keyExtractor={(item, i) => item?.collection_id ?? i.toString()}
                ListHeaderComponent={() => {
                    return (
                        <YStack p={5} pt={20} >

                            <YStack p={15} borderWidth={1} borderColor={'$borderColor'} borderRadius={10} >
                                <XStack columnGap={10} alignItems='center' flex={1} >
                                    <Info color={'aqua'} />
                                    <Text fontSize={'$xxs'} flex={1} textAlign='left' color={'aqua'} >
                                        It may take a sec for us to index all {
                                            delegateManager.owner == address ? 'your' : 'their'
                                        } nfts. You can pull down to reload
                                    </Text>
                                </XStack>
                            </YStack>
                        </YStack>
                    )
                }}
                renderItem={({ item, index }) => (
                    <CollectionCard
                        data={item}
                        key={index}
                    />
                )}
                ListFooterComponent={() => {
                    if (nftsQuery.isLoading) return (
                        <XStack p={20} alignItems='center' justifyContent='center' >
                            <Spinner />
                        </XStack>
                    )
                    return null
                }}
            />
        </YStack>
    )
}

export default NftsTab