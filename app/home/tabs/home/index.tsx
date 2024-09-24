import {Text, useTheme, YStack} from "tamagui";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {useQuery } from "react-query";
import {uniqBy} from "lodash";
import {Feed, FeedsTopBar, FeedTab, initialFeeds, tabContext} from "../../../../screens/feed-tabs";
import {useCallback} from "react";
import {getSavedFeeds} from "../../../../screens/v2/feeds";
import {GET_COMMUNITY_PUBLICATIONS} from "../../../../utils/queries";
import Loading from "../../../../components/ui/feedback/loading";


const Tab = createMaterialTopTabNavigator();


export default function FeedScreen(){
    const theme = useTheme()
    const feedsQuery = useQuery({
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
                        communityName: f?.key,
                    }),
                } as Feed
            })

            return uniqBy([
                ...initialFeeds,
                ...mapped
            ], f => f.key)
        }
    })

    const renderFeeds = useCallback(()=>{
        return (
            <>
                {
                    feedsQuery?.data?.map((feed)=>{
                        const FTab = () => <FeedTab feed={feed}/>
                        return (
                            <Tab.Screen key={feed.key} name={feed.key} options={{ title: feed.title, lazy: true }} component={FTab}/>
                        )
                    })
                }
            </>
        )
    }, [feedsQuery?.isLoading, feedsQuery?.data?.length])

    if(feedsQuery?.isLoading || (feedsQuery?.data?.length ?? 0) == 0) return <YStack flex={1} backgroundColor={'$background'} ></YStack>

    return (
        <tabContext.Provider value={{
            activeTab: 'discover'
        }} >
            <YStack flex={1} w={'100%'} h={'100%'} bg={'$background'} >
                <Tab.Navigator
                    screenOptions={{
                        tabBarScrollEnabled: true,
                        tabBarStyle:{
                            backgroundColor: theme.background.val
                        },
                        lazy: true,
                        lazyPlaceholder: ()=><Loading flex={1} width={'100%'} height={'100%'} bg={'$background'} />,
                        swipeEnabled: false,
                        animationEnabled: false,
                    }}
                    tabBar={(props)=><FeedsTopBar materialProps={props} feeds={feedsQuery?.data ?? []} />}
                >
                    {
                        renderFeeds()
                    }
                </Tab.Navigator>
            </YStack>
        </tabContext.Provider>
    )
}