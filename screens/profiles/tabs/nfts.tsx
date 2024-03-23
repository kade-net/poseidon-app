import { View, Text, YStack } from 'tamagui'
import React from 'react'
import { ProfileTabsProps, SceneProps, ScrollManager } from './common'
import { Animated, Platform } from 'react-native'
import { useQuery } from 'react-query'
import collected from '../../../contract/modules/collected'
import { useGlobalSearchParams } from 'expo-router'
import CollectionCard from './collection-card'

const NftsTab = (props: ProfileTabsProps) => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string
    const nftsQuery = useQuery({
        queryFn: () => collected.getCollections(address),
        queryKey: ['collections', address],
        onError: console.log,
        onSuccess: console.log
    })



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
                // refreshing={postsQuery.loading}
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
                // onRefresh={handleFetchTop}
                // onEndReached={handleFetchMore}
                onEndReachedThreshold={1}
                showsVerticalScrollIndicator={false}
                data={nftsQuery?.data ?? []}
                maxToRenderPerBatch={20}
                initialNumToRender={20}
                keyExtractor={(item, i) => item?.collection_id ?? i.toString()}
                renderItem={({ item, index }) => (
                    <CollectionCard
                        data={item}
                        key={index}
                    />
                )}

            />
        </YStack>
    )
}

export default NftsTab