import {Image, Separator, Spinner, Text, useTheme, XStack, YStack} from "tamagui";
import {useNavigation, useRouter} from "expo-router";
import {DrawerActions, useRoute} from "@react-navigation/native";
import {FlatList, TouchableOpacity} from "react-native";
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated'
import {ChevronUp, Hash, Menu, Newspaper, SquarePen} from "@tamagui/lucide-icons";
import React, {memo, useCallback, useContext, useMemo, useRef, useState} from "react";
import {NavigationState, SceneRendererProps, TabView} from "react-native-tab-view";
import {SceneProps} from "../profiles/tabs/common";
import {useQuery} from "@apollo/client";
import {GET_COMMUNITY_PUBLICATIONS, GET_PUBLICATIONS} from "../../utils/queries";
import account from "../../contract/modules/account";
import {isEmpty, uniqBy} from "lodash";
import publications from "../../contract/modules/publications";
import {PublicationsQuery} from "../../__generated__/graphql";
import BaseContentContainer from "../../components/ui/feed/base-content-container";
import posti from "../../lib/posti";
import {useShellProvider} from "../shell";
import delegateManager from "../../lib/delegate-manager";
import {TypedDocumentNode} from "@graphql-typed-document-node/core";
import Loading from "../../components/ui/feedback/loading";
import {TPUBLICATION} from "../../schema";
import { useQuery as uzQuery } from 'react-query'
import {getSavedFeeds} from "../v2/feeds";
import {Utils} from "../../utils";
import {MaterialTopTabBarProps} from "@react-navigation/material-top-tabs";

export const tabContext = React.createContext<{activeTab: string}>({
    activeTab: "discover",
})

export const initialFeeds: Array<Feed> = [
    {
        key: 'discover',
        type: 'predefined',
        title: 'Discover',
        query: GET_PUBLICATIONS,
        customFeedVariables: (feed)=>({
            types: [1,2]
        })
    },
    {
        key: 'following',
        type: 'predefined',
        title: 'Following',
        query: GET_PUBLICATIONS,
        customFeedVariables: (feed)=> ({
            following_feed: delegateManager.owner!,
            types: [1,2],
        })
    }
]

export interface Feed {
    key: string;
    title: string
    type: 'custom' | 'predefined',
    customFeed?: (feed: Feed) => React.ReactElement
    customFeedVariables?: (feed: Feed) => Record<string, any>
    query: TypedDocumentNode<any, any>
}

interface TabRoute {
    key: string
    title: string
}

interface FeedsTopBarProps {
    feeds: Feed[]
    materialProps: MaterialTopTabBarProps
}

export const FeedsTopBar = memo((props: FeedsTopBarProps) => {
    const { feeds, materialProps } = props
    const listRef = useRef<FlatList>(null)
    const navigation = useNavigation()
    const router = useRouter()
    const tabState = useContext(tabContext)
    const activeTab = materialProps.state.routeNames.at(materialProps.state.index)

    const onPress = (key: string) => {
        const isFocused = activeTab == key;
        const event = materialProps.navigation.emit({
            type: 'tabPress',
            target: key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            materialProps.navigation.navigate(key);
        }
    };

    const onLongPress = (key: string) => {
        materialProps.navigation.emit({
            type: 'tabLongPress',
            target: key,
        });
    };


    const handleOpen = () => {
        navigation.dispatch(DrawerActions.toggleDrawer())
    }

    const { bottomBarMode } = useShellProvider()

    const transformStyle = useAnimatedStyle(()=>{
        return {
            opacity: Math.pow(1 - bottomBarMode.value, 2),
            transform: [
                {
                    translateY: interpolate(
                        bottomBarMode.value,
                        [0,1],
                        [0, -100]
                    )
                }
            ]
        }
    })

    return (
        <Animated.View style={[{
            width: '100%',
            position: 'absolute',
            zIndex: 50
        }, transformStyle]} >
            <XStack bg={"$background"} w={"100%"} alignItems={'center'} justifyContent={'space-between'} px={20} pt={20} >
                <TouchableOpacity onPress={handleOpen}  >
                    <Menu color={"$sideText"} />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/brand/logo.png')}
                    width={30}
                    height={30}
                />
                <TouchableOpacity
                    onPress={()=>{
                        router.push('/home/tabs/home/feeds')
                    }}
                >
                    <Newspaper color={'$sideText'} />
                </TouchableOpacity>
            </XStack>
            <XStack bg={"$background"} w={"100%"} borderBottomWidth={1} borderBottomColor={'$border'} >
                <Animated.FlatList style={{
                    paddingHorizontal: 20
                }} ref={listRef} contentContainerStyle={{
                    columnGap: 10
                }} horizontal showsHorizontalScrollIndicator={false} data={feeds} renderItem={(props)=>{
                    const isActive = materialProps.state.routeNames.at(materialProps.state.index) == props.item.key
                    return (
                        <TouchableOpacity
                            onPress={()=>{
                                console.log('props:: pressed::', materialProps?.state?.index)
                                onPress(props.item.key)
                                listRef?.current?.scrollToIndex({
                                    index: props.index,
                                    animated: true
                                })
                            }}

                            onLongPress={()=>{
                                onLongPress(props.item.key)
                            }}
                        >
                            <YStack py={10} >
                                <Text fontSize={14} textTransform={'capitalize'} fontWeight={'semibold'} color={isActive ? 'white' :'$sideText'} >
                                    {Utils.shortedNameToTitle(props?.item?.title)}
                                </Text>
                            </YStack>
                            <Separator borderColor={isActive ? '$primary' : '$colorTransparent'} />
                        </TouchableOpacity>
                    )
                }} />
            </XStack>
        </Animated.View>
    )
})

interface FeedTabProps {
    feed: Feed
}

export const FeedTab = React.memo((props: FeedTabProps) => {
    const listRef = useRef<FlatList>(null)
    const { feed } = props
    const shellContext = useShellProvider()
    const customVariables = feed.customFeedVariables?.(feed)
    const router = useRouter()

    const publicationsQuery = useQuery(feed?.query, {
        variables:{
            page: 0,
            size: 20,
            types: customVariables?.types,
            muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
            hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications,
            following_feed:customVariables?.following_feed,
            communityName: customVariables?.communityName,
        },
        fetchPolicy: 'cache-and-network',
        skip: !feed || !customVariables
        // skip: true,
    })

    const fetchedPublications: Array<any> = publicationsQuery?.data?.publications ?? publicationsQuery?.data?.communityPublications ?? []

    const handleFetchMore = async (direction: 'bottom' | 'top' | undefined = 'bottom') => {

        if(publicationsQuery.error) {
            posti.capture('home fetching more error', {error: publicationsQuery.error})
            return
        }

        if(publicationsQuery.loading || (fetchedPublications?.length ?? 0) < 20) {
            console.log("Less")
            return
        }

        try {
            const total = fetchedPublications?.length ?? 0
            const nextPage = Math.floor(total / 20)
            await publicationsQuery.fetchMore({
                variables: {
                    page: direction == 'bottom' ? nextPage : direction == 'top' ? 0 : 0,
                    size: 20,
                    types: customVariables?.types ?? [1,2],
                    muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
                    hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
                }
            })
        }
        catch (e){
            console.log("Error fetching more", e)
        }
        finally {

        }
    }

    const renderPublication = useCallback((props: {item:any, index: number })=> {
        return (
            <BaseContentContainer data={props.item} />
        )
    }, [])

    // if(tabState.activeTab !== feed.key) return null;

    return (
        <YStack flex={1} w={"100%"} h={"100%"} position={'relative'} bg={'$background'} >
            <FlatList
                contentContainerStyle={{
                    paddingTop: 100
                }}
                ref={listRef}
                data={fetchedPublications ?? []}
                renderItem={renderPublication}
                refreshing={false}
                onRefresh={()=>handleFetchMore('top')}
                onEndReached={()=>handleFetchMore()}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                keyExtractor={(i)=> i?.publication_ref}
                onScroll={shellContext?.handleScroll}
                scrollEventThrottle={1}
                ListHeaderComponent={()=>{
                    if(publicationsQuery?.loading) return <XStack w={"100%"} alignItems={'center'} justifyContent={'center'} bg={'$background'} >
                        <Spinner/>
                    </XStack>
                }}
                ListFooterComponent={()=>{
                    if(fetchedPublications?.length == 0) return null
                    if(publicationsQuery?.loading) return (
                        <Loading w={"100%"} h={'100%'} bg={'$background'} />
                    )
                    return null
                }}
            />

                <TouchableOpacity style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 20
                }} onPress={()=>{
                    listRef?.current?.scrollToOffset({
                        offset: 0,
                        animated: true
                    })
                }} >
                    <XStack alignItems={'center'} justifyContent={'center'} p={10} borderRadius={100} bg={"$background"} borderWidth={1} borderColor={'$border'} >
                        <ChevronUp/>
                    </XStack>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 20
                    }}
                    onPress={()=>{
                        if(!['discover', 'following']?.includes(feed.key)) {
                            const content: TPUBLICATION = {
                                community: feed.key,
                                content: ''
                            }

                            const encoded = Buffer.from(JSON.stringify(content), 'utf-8').toString('base64')

                            router.push(`/editor?type=1&post=${encoded}`)

                            return
                        } 
                        router.push('/editor?type=1')
                    }}
                >
                    <XStack alignItems={'center'} justifyContent={'center'} p={10} borderRadius={100} bg={"$primary"} >
                        <SquarePen/>
                    </XStack>
                </TouchableOpacity>
        </YStack>
    )
})

interface TabsProps {
    feeds: Array<Feed>
}
const Tabs = memo((props: TabsProps) => {
    const { feeds } = props
    const feedTabs = useMemo(()=>{
        return feeds?.reduce((prev, curr )=> {
            prev[curr.key] = <FeedTab feed={curr} />
            return prev
        }, {} as Record<string, React.ReactNode> )
    },[feeds?.length])
    const theme = useTheme()
    const [routes] = useState<Array<TabRoute>>(feeds.map((f)=> ({
        key: f.key,
        title: f.title
    })))


    const [currentTabIndex, setCurrentTabIndex] = useState(0)

    const renderScene = useCallback((props: SceneProps)=> {
        const { route } = props
        const activeRoute = routes.at(currentTabIndex)?.key ?? 'discover'
        console.log("Current Route::", activeRoute)
        const tab = feedTabs[activeRoute]
        return tab ?? null

    }, [currentTabIndex])

    const renderTabBar = useCallback((props: SceneRendererProps & { navigationState: NavigationState<{key: string, title: string}>})=>{
        return null
    },[feeds?.length])

    return (
        <tabContext.Provider value={{ activeTab: feeds.at(currentTabIndex)?.key ?? 'discover' }} >
            <YStack flex={1} w={"100%"} h={"100%"} >
                <TabView onIndexChange={setCurrentTabIndex} navigationState={{
                    index: currentTabIndex,
                    routes
                }} lazy renderLazyPlaceholder={()=><Loading flex={1} w={"100%"} h={"100%"} />} renderScene={renderScene} sceneContainerStyle={{
                            width: '100%',
                            height: '100%',
                            flex: 1
                        }}
                         renderTabBar={renderTabBar}
                         animationEnabled={false}
                         swipeEnabled={false}
                />
            </YStack>
        </tabContext.Provider>
    )
})

export default function FeedTabs(){
    const feedsQuery = uzQuery({
        queryKey: ['feeds'],
        queryFn: async () => {
            const saved = await getSavedFeeds()
            const mapped = saved?.map((f)=>{
                return {
                    key: f.key,
                    title: f.title,
                    type: 'custom',
                    query: GET_COMMUNITY_PUBLICATIONS,
                    customFeedVariables: (feed)=> ({
                        communityName: feed.key,
                    })
                } as Feed
            })

            return uniqBy([
                ...initialFeeds,
                ...mapped
            ], f => f.key)
        }
    })

    if(feedsQuery.isLoading){
        return (
            <Loading flex={1} backgroundColor={'$background'} w={'100%'} h={'100%'} />
        )
    }

    return (
        <YStack flex={1} w={"100%"} h={"100%"} py={10} bg={"$background"} >
            <Tabs feeds={feedsQuery?.data ?? []} />
        </YStack>
    )
}