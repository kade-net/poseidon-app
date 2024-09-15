import {Image, Separator, Spinner, Text, useTheme, XStack, YStack} from "tamagui";
import {useNavigation, useRouter} from "expo-router";
import {DrawerActions} from "@react-navigation/native";
import {FlatList, TouchableOpacity} from "react-native";
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated'
import {ChevronUp, Hash, Menu, SquarePen} from "@tamagui/lucide-icons";
import React, {useCallback, useMemo, useRef, useState} from "react";
import {NavigationState, SceneRendererProps, TabView} from "react-native-tab-view";
import {SceneProps} from "../profiles/tabs/common";
import {useQuery} from "@apollo/client";
import {GET_COMMUNITY_PUBLICATIONS, GET_PUBLICATIONS} from "../../utils/queries";
import account from "../../contract/modules/account";
import {isEmpty} from "lodash";
import publications from "../../contract/modules/publications";
import {PublicationsQuery} from "../../__generated__/graphql";
import BaseContentContainer from "../../components/ui/feed/base-content-container";
import posti from "../../lib/posti";
import {useShellProvider} from "../shell";
import delegateManager from "../../lib/delegate-manager";
import {TypedDocumentNode} from "@graphql-typed-document-node/core";
import Loading from "../../components/ui/feedback/loading";
import {TPUBLICATION} from "../../schema";

const feeds: Array<Feed> = [
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
    },
    {
        key: 'portals',
        type: 'predefined',
        title: 'Portals',
        query: GET_COMMUNITY_PUBLICATIONS,
        customFeedVariables: (feed)=> ({
            communityName: 'portals',
        })
    }
]

interface Feed {
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
    sceneProps: SceneRendererProps & {
        navigationState: NavigationState<{key: string, title: string}>
    }
}

const FeedsTopBar = (props: FeedsTopBarProps) => {
    const { feeds, sceneProps } = props
    const listRef = useRef<FlatList>()
    const navigation = useNavigation()


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
                        [0, -80]
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
            <XStack bg={"$background"} w={"100%"} alignItems={'center'} justifyContent={'space-between'} px={20} >
                <TouchableOpacity onPress={handleOpen}  >
                    <Menu color={"$sideText"} />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/brand/logo.png')}
                    width={30}
                    height={30}
                />
                <TouchableOpacity>
                    <Hash color={'$sideText'} />
                </TouchableOpacity>
            </XStack>
            <XStack bg={"$background"} w={"100%"} borderBottomWidth={1} borderBottomColor={'$border'} >
                <Animated.FlatList style={{
                    paddingHorizontal: 20
                }} contentContainerStyle={{
                    columnGap: 10
                }} horizontal data={feeds} renderItem={(props)=>{
                    const currentRoute = sceneProps.navigationState.routes.at(sceneProps.navigationState.index)
                    const isActive = currentRoute!.key == props.item.key
                    return (
                        <TouchableOpacity
                            onPress={()=>{
                                sceneProps?.jumpTo(props.item.key)

                                listRef?.current?.scrollToIndex({
                                    index: props.index,
                                    animated: true
                                })
                            }}
                        >
                            <YStack py={10} >
                                <Text fontSize={18} fontWeight={'bold'} color={isActive ? 'white' :'$sideText'} >
                                    {props?.item?.title}
                                </Text>
                            </YStack>
                            <Separator borderColor={isActive ? '$primary' : '$colorTransparent'} />
                        </TouchableOpacity>
                    )
                }} />
            </XStack>
        </Animated.View>
    )
}

interface FeedTabProps {
    feed: Feed
}

const FeedTab = React.memo((props: FeedTabProps) => {
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

    return (
        <YStack flex={1} w={"100%"} h={"100%"} position={'relative'} >
            <Animated.FlatList
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
                contentContainerStyle={{
                    paddingTop: 80
                }}
                ListHeaderComponent={()=>{
                    if(publicationsQuery?.loading) return <XStack w={"100%"} alignItems={'center'} justifyContent={'center'} >
                        <Spinner/>
                    </XStack>
                }}
                ListFooterComponent={()=>{
                    if(fetchedPublications?.length == 0) return null
                    if(publicationsQuery?.loading) return (
                        <Loading w={"100%"} />
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
const Tabs = (props: TabsProps) => {
    const { feeds } = props
    const feedTabs = useMemo(()=>{
        return feeds.map((feed) => <FeedTab feed={feed} key={feed.key} />)
    },[])
    const theme = useTheme()
    const [routes] = useState<Array<TabRoute>>(feeds.map((f)=> ({
        key: f.key,
        title: f.title
    })))

    const [currentTabIndex, setCurrentTabIndex] = useState(0)

    const renderScene = useCallback((props: SceneProps)=> {
        const { route } = props

        const tab = feedTabs.at(currentTabIndex)
        return tab ?? null

    }, [currentTabIndex])

    const renderTabBar = useCallback((props: SceneRendererProps & { navigationState: NavigationState<{key: string, title: string}>})=>{
        return (
            <FeedsTopBar feeds={feeds} sceneProps={props} />
        )
    },[currentTabIndex])

    return (
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

            />
        </YStack>
    )
}

export default function FeedTabs(){

    return (
        <YStack flex={1} w={"100%"} h={"100%"} bg={"$background"} >
            <Tabs feeds={feeds} />
        </YStack>
    )
}