import {Image, ScrollViewProps, Text, useTheme, XStack, YStack} from "tamagui";
import {FlatList, TouchableWithoutFeedback, Dimensions, StatusBar, TouchableOpacity} from "react-native";
import React, {useCallback, useContext, useRef, useState} from "react";
import {Hash, Menu} from "@tamagui/lucide-icons";
import {
    HomeIcon,
    HomeIconOutlined,
    MessageIcon,
    MessageOutlined, NotificationOutlined, NotificationSolid, ProfileIcon, ProfileIconSolid,
    SearchIcon,
    SearchIconOutlined
} from "../../lib/icons";
import {useNavigation, useRouter} from "expo-router";
import {DrawerActions} from "@react-navigation/native";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import delegateManager from "../../lib/delegate-manager";
import {interpolate, SharedValue, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const DEVICE_WIDTH = Dimensions.get('screen').width;
const CONTENT_WIDTH = DEVICE_WIDTH - 40
import Animated from 'react-native-reanimated'

type BOTTOM_NAV_KEYS = {
    key: string,
    icon: (focused: boolean) => React.ReactNode
}

const bottom_nav_keys: Array<BOTTOM_NAV_KEYS> = [
    {
        key: 'home',
        icon: (focused) => {
            return focused ? <HomeIcon color={'white'} /> : <HomeIconOutlined color={'white'} />
        },
    },
    {
        key: 'search',
        icon: (focused) => {
            return focused ? <SearchIcon color={'white'} /> : <SearchIconOutlined color={'white'} />
        }
    },
    {
        key: 'message',
        icon: (focused)=> {
            return focused ? <MessageIcon color={'white'} /> : <MessageOutlined color={'white'} />
        }
    },
    {
        key: 'notifications',
        icon: (focused) => {
            return focused ? <NotificationSolid color={'white'} /> : <NotificationOutlined color={'white'} />
        }
    },
    {
        key: 'profile',
        icon: (focused) => {
            return focused ? <ProfileIconSolid color={'white'} /> : <ProfileIcon color={'white'} />
        }
    }
]

interface ShellContext {
    scrolledDown: boolean;
    currentOffset: number;
    setCurrentOffset?: (currentOffset: number) => void;
    handleScrollDirectionChange: (down: boolean) => void;
    bottomBarMode: SharedValue<number>
    currentTabIndex: number;
    setCurrentTabIndex: (index: number) => void;
}

const shellContext = React.createContext<ShellContext>({
    scrolledDown: false,
    currentOffset: 0,
    currentTabIndex: 0,
    setCurrentTabIndex: (index: number) => {},
    handleScrollDirectionChange: (boolean) => {},
    bottomBarMode: {
        value: 0,
        modify(){},
        addListener(){},
        removeListener(){}
    }
})

export function ShellProvider(props: {children: React.ReactNode}) {
    const {children} = props
    const [currentOffset, setCurrentOffset] = useState(0);
    const [scrolledDown, setScrolledDown] = useState(false)
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const bottomBarMode = useSharedValue(0)
    return (
        <shellContext.Provider value={{scrolledDown: scrolledDown, handleScrollDirectionChange: setScrolledDown, currentOffset, setCurrentOffset, bottomBarMode, currentTabIndex, setCurrentTabIndex}}  >{children}</shellContext.Provider>
    )

}

export function useShellProvider(){
    const [yOffset, setYOffset] = React.useState<number>(0)
    const [mode, setMode] = useState(0)
    const context = useContext(shellContext)

    const handleScroll: ScrollViewProps['onScroll'] = (event)=>{
        'worklet'
        const currentYOffset = event.nativeEvent.contentOffset.y
        if(currentYOffset > yOffset && currentYOffset > 200) {
            context.handleScrollDirectionChange(true)
            setMode(1)
            context.bottomBarMode.value = withSpring(1, {
                overshootClamping: true
            })
        }else{
            context.handleScrollDirectionChange(false)
            setMode(0)
            context.bottomBarMode.value = withSpring(0, {
                overshootClamping: true
            })
        }
        setYOffset(currentYOffset)
    }

    return {
        ...context,
        handleScroll,
        mode
    }
}

const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 80;

interface FEED_KEYS {
    title: string,
    key: string
}

const feed_keys: Array<FEED_KEYS> = [
    {
        title: 'Discover',
        key: 'discover'
    },
    {
        title: 'Following',
        key: 'following'
    },
    {
        title: 'Portals',
        key: 'portals'
    }
    // ...other custom feeds (prep for bsky integration)
]

export function FeedNavigator(){

    const ref = useRef<FlatList|null>(null)
    const theme = useTheme()

    const FeedButton = useCallback((props: {item: FEED_KEYS,index: number})=>{
        const { title, key } = props.item
        return (
            <TouchableWithoutFeedback
                onPress={()=>{
                    ref.current?.scrollToIndex({
                        index: props.index,
                        animated: true,
                    })
                }}
            >
                <YStack px={10} py={10} >
                    <Text fontSize={18} >
                        {title}
                    </Text>
                </YStack>
            </TouchableWithoutFeedback>
        )
    }, [])

    return (
        <Animated.FlatList onScroll={(p)=>{}} ref={ref} horizontal style={{borderBottomColor: theme.border?.val, borderBottomWidth: 1}} data={feed_keys} keyExtractor={f=>f.key} renderItem={FeedButton} />
    )
}


interface ShellBottomTabNavigatorProps extends BottomTabBarProps {}
export function ShellBottomTabNavigator(props: ShellBottomTabNavigatorProps) {
    const theme = useTheme()
    const router = useRouter()
    const {bottomBarMode, mode} = useShellProvider()
    const currentRouteIndex = props.state.index ?? 0
    const activeKey = currentRouteIndex == 0 ? 'home' : currentRouteIndex == 1 ? 'search' : currentRouteIndex == 2 ? 'message' : currentRouteIndex == 3 ? 'notifications' : 'profile'
    const bottomTabButton = useCallback((props: {item: BOTTOM_NAV_KEYS, index: number})=> {
        const { item, index } = props
        return (
            <TouchableOpacity style={{
                flex: 1,
                width: CONTENT_WIDTH / 5,
                alignItems: 'center',
            }} onPress={()=>{
                router.push(
                    // @ts-ignore - react router's problems
                    item.key == 'home' ? '/home/tabs/home' :
                        item.key == 'search' ? '/home/tabs/search' :
                            item.key == 'message' ? '/home/tabs/messages' :
                                item.key == 'notifications' ? '/home/tabs/notifications' :
                                    item.key == 'profile' ? `/home/tabs/${delegateManager.owner!}` : ''
                )
            }} >
                {item?.icon(activeKey == item.key)}
            </TouchableOpacity>
        )
    }, [activeKey])




    return (
        <Animated.View
            style={[{
                backgroundColor: theme.background.val,
                borderTopWidth: 1,
                borderTopColor: theme.border.val,
                width: '100%',

            }]}
        >
            <XStack bg={"$background"} borderTopWidth={1} borderTopColor={'$border'} width={'100%'} px={20} py={10} alignItems={'center'} justifyContent={'center'} >
                <Animated.FlatList scrollEnabled={false}  horizontal data={bottom_nav_keys} renderItem={bottomTabButton} />
            </XStack>
        </Animated.View>
    )
}

export function HomeTopNavigator(){

    const navigation = useNavigation()

    const handleOpen = () => {
        navigation.dispatch(DrawerActions.toggleDrawer())
    }

    return (
        <YStack w={"100%"} h={HEADER_HEIGHT} justifyContent={'space-between'} >
            <XStack w={"100%"} px={10} justifyContent={'space-between'} alignItems={'center'} >
                <TouchableOpacity onPress={handleOpen}  >
                    <Menu/>
                </TouchableOpacity>
                <Image
                    source={require('../../assets/brand/logo.png')}
                    width={30}
                    height={30}
                />
                <TouchableOpacity>
                    <Hash/>
                </TouchableOpacity>
            </XStack>
        </YStack>
    )
}

export default function Shell() {
    return (
        <YStack flex={1} bg={"$background"} w={"100%"} h={"100%"} >
            {/*top section can easily be swapped out, but would still need to maintain height*/}
            <HomeTopNavigator/>
            <YStack flex={1} w={"100%"} >

            </YStack>
        </YStack>
    )
}