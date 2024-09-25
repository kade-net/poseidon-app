import {Image, Separator, Spacer, Spinner, Text, useTheme, View, XStack, YStack} from "tamagui";
import storage from "../../../lib/storage";
import {useQuery, useQueryClient} from "react-query";
import { useQuery as useApolloQuery } from '@apollo/client'
import {FlatList, TouchableOpacity} from "react-native";
import {ArrowLeft, ChevronLeft, Menu, Minus, Plus} from "@tamagui/lucide-icons";
import React, {createContext, useCallback, useContext, useState} from "react";
import SearchInput from "../../../components/ui/search-input";
import {COMMUNITY_QUERY, SEARCH_COMMUNITIES} from "../../../utils/queries";
import {CommunitiesQuery} from "../../../__generated__/graphql";
import {Utils} from "../../../utils";
import {DrawerActions} from "@react-navigation/native";
import {useRouter} from "expo-router";

interface FeedContext {
    search: string
    setSearch: (search: string) => void
}

const context = createContext<FeedContext>({
    search: "",
    setSearch: (search: string) => {},
})


interface  ProviderProps {
    children: React.ReactNode
}

const FeedsProvider =  (props: ProviderProps) => {
    const { children } = props
    const [search, setSearch] = useState("")

    return (
        <context.Provider
            value={{
                search,
                setSearch,
            }}
        >
            {children}
        </context.Provider>
    )
}

const useFeedsProvider  = () => {
    const providerContext = useContext(context)

    return providerContext
}


interface FEED {
    image: string
    key: string
    title: string
}

async function saveFeed(feed: FEED) {
    try {
        await storage.save({
            key: 'feeds',
            id: feed.key?.replaceAll('_', '')?.replaceAll('-', ''),
            data: feed,
            expires: null
        })
    }
    catch (e)
    {
        console.log("Unable to save feed")
    }
}

async function removeFeed(key: string){
    try {
        await storage.remove({
            key: 'feeds',
            id: key?.replaceAll('_', '')?.replaceAll('-', '')
        })
    }
    catch(e)
    {
        console.log("Unable to remove feed", key, e)
    }
}

export async function getSavedFeeds(){
    try {
        const feeds = await storage.getAllDataForKey<FEED>('feeds')

        return feeds
    }
    catch(e)
    {
        console.log("Something went wrong", e)
        return []
    }
}

interface Props {
    feed: FEED & {description?: string}
    saved?: boolean
}
const FeedButton = (props: Props) => {
    const client = useQueryClient()
    const { feed, saved } = props
    const [localSave, setLocalSave] = useState<boolean>(saved ?? false)
    const [loading, setLoading] = useState<boolean>(false)

    const savedFeeds = client.getQueryData<Array<FEED>>(['saved-feeds'])

    const handleToggle = async () => {
        setLoading(true)
        try {
            const saved = savedFeeds?.find(f => f.key == feed.key)
            if(!saved){
                await saveFeed(feed)
                await client.invalidateQueries(['saved-feeds'])
                await client.invalidateQueries(['feeds'])
                setLocalSave(true)
            }else{
                await removeFeed(feed.key)
                await client.invalidateQueries(['saved-feeds'])
                await client.invalidateQueries(['feeds'])
                setLocalSave(false)
            }

        }
        catch(e)
        {
            console.log("Unable to save feed", e)
        }
        finally {
            setLoading(false)
        }
    }

    const HIDE = savedFeeds?.find(f => feed.key == f.key)

    if(HIDE && feed.description) return null

    return (
        <YStack width={"100%"} rowGap={feed.description ? 10 : 0} >
            <XStack width={'100%'} alignItems={'center'} justifyContent={'space-between'} >
                <XStack alignItems={'center'} columnGap={10} >
                    <Image
                        src={feed.image}
                        borderRadius={10}
                        width={40}
                        height={40}
                    />
                    <Text fontWeight={'semibold'} fontSize={18} textTransform={'capitalize'} >
                        {Utils.shortedNameToTitle(feed.title)}
                    </Text>
                </XStack>

                {loading ? <Spinner color={'$sideText'} /> : <TouchableOpacity onPress={handleToggle}>
                    {HIDE ? <Minus/> : <Plus/>}
                </TouchableOpacity>}
            </XStack>
            {feed.description && <Text>
                {feed.description}
            </Text>}
        </YStack>
    )
}

export function SavedFeeds() {

    const savedFeedsQuery = useQuery({
        queryKey: ['saved-feeds'],
        queryFn: getSavedFeeds,
    })

    return (
        <YStack width={'100%'} alignItems={'center'} rowGap={5} pt={10}  >
            <YStack w={'100%'} >
                <Text fontSize={18} fontWeight={'semibold'} >
                    My Feeds
                </Text>
                <Text>
                    Your saved feeds
                </Text>
                {
                    (savedFeedsQuery?.data?.length ?? 0) == 0 &&
                    <XStack py={10} >
                        <Text color={'$sideText'} >
                            You haven't saved any feeds yet
                        </Text>
                    </XStack>
                }
            </YStack>
            {
                savedFeedsQuery?.data?.map((feed, i)=> {
                    return (
                        <FeedButton feed={{...feed, description: ''} } key={i} />
                    )
                })
            }
            <XStack width={'100%'} p={5} >

            </XStack>
            <Separator borderColor={'$border'} />
            <XStack width={'100%'} p={5} >

            </XStack>
        </YStack>
    )

}


export function SearchFeeds(){
    const { search, setSearch } = useFeedsProvider()

    return (
        <YStack w={'100%'} rowGap={10} paddingBottom={10} >
            <Text fontSize={18} fontWeight={'semibold'} >
                Discover New Feeds
            </Text>
            <Text>
                Choose a feed. A feed is a curation of posts from a topic of interest.
            </Text>

            <SearchInput onChangeText={setSearch} />
        </YStack>
    )
}



export function SearchFeedsList() {
    const { search } = useFeedsProvider()
    const client = useQueryClient()
    const savedFeeds = client.getQueryData<Array<FEED>>(['saved-feeds'])
    const feedsQuery = useApolloQuery(SEARCH_COMMUNITIES, {
        variables: {
            search: search?.trim()?.toLowerCase(),
            size: 20,
            page: 0,
        }
    })


    const renderHeader = useCallback(()=> {
        return (
            <YStack w={'100%'} >
                <SavedFeeds/>
                <SearchFeeds/>
            </YStack>
        )
    }, [])

    const renderFeedButton = useCallback((props: {item: {name: string, description: string, image: string}, index: number})=> {
        const { item, index } = props
        return (
            <YStack pb={20} >
                <FeedButton feed={{
                    key: item.name,
                    title: item.name,
                    description: item.description,
                    image: item.image,
                }}/>
            </YStack>
        )
    }, [])


    return (
        <FlatList  ListHeaderComponent={renderHeader} showsVerticalScrollIndicator={false} data={feedsQuery?.data?.communities?.filter(f=>{
            const existingSaved = savedFeeds?.find(feed => f.name == feed.key )
            if(existingSaved) return false
            return true
        })} renderItem={renderFeedButton} />
    )
}



export function Feeds(){
    const router = useRouter()
    return (
        <FeedsProvider>
            <XStack columnGap={10} alignItems={'center'} px={10} py={10} justifyContent={'space-between'}  >
                <TouchableOpacity onPress={router.back} style={{width: 80, height: '100%'}}  >
                    <ChevronLeft />
                </TouchableOpacity>
                <Text fontWeight={'bold'} fontSize={18} >
                    Feeds
                </Text>
                <View style={{width: 80}} ></View>
            </XStack>
            <Separator borderColor={'$border'} />
            <YStack flex={1} w={'100%'} h={'100%'} backgroundColor={'$background'} px={20} >
                <SearchFeedsList/>
            </YStack>
        </FeedsProvider>
    )
}