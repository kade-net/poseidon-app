import {DrawerContentComponentProps} from "@react-navigation/drawer";
import {Avatar, Text, XStack, YStack} from "tamagui";
import {GET_ACCOUNT_STATS, GET_MY_PROFILE} from "../../utils/queries";
import {useQuery} from "@apollo/client";
import delegateManager from "../../lib/delegate-manager";
import {Utils} from "../../utils";
import {
    HomeIcon,
    HomeIconOutlined,
    MessageIcon,
    MessageOutlined, NotificationOutlined, NotificationSolid, ProfileIcon, ProfileIconSolid,
    SearchIcon,
    SearchIconOutlined
} from "../../lib/icons";
import NotificationIcon from "../../assets/svgs/notification-icon";
import {Compass, Settings, Wallet} from "@tamagui/lucide-icons";
import {FlatList, TouchableOpacity} from "react-native";
import {useCallback} from "react";
import {RouteParams, useRouter} from "expo-router";
import {MessageTabButton} from "./message-tab-button";
import {NotificationsTabButton} from "./notifications-tab-button";
import {useShellProvider} from "./index";

type DrawerNavigationKey = {
    key: string,
    title: string,
    icon: (focused: boolean) => JSX.Element,
    to: string
}

const drawerKeys: Array<DrawerNavigationKey> = [
    {
        key: 'home',
        title: 'Home',
        icon(focused){
            return focused ? <HomeIcon color={'white'} /> : <HomeIconOutlined color={'white'} />
        },
        to: '/home'
    },
    {
        key: 'search',
        title: 'Search',
        icon(focused){
            return focused ? <SearchIcon color={'white'} /> : <SearchIconOutlined color={'white'} />
        },
        to: '/home/tabs/search'
    },
    {
        key: 'message',
        title: 'Message',
        icon(focused){
            return <MessageTabButton isActive={focused} />
        },
        to: '/home/tabs/messages'
    },
    {
        key: 'notifications',
        title: 'Notifications',
        icon(focused){
            return <NotificationsTabButton focused={focused} />
        },
        to: '/home/tabs/notifications'
    },
    {
        key: 'profile',
        title: 'Profile',
        icon(focused){
            return focused ? <ProfileIconSolid color={'white'} /> : <ProfileIcon color={'white'} />
        },
        to: `/home/tabs/${delegateManager.owner!}`
    },
    {
      key: 'portals',
      title: 'Portals',
      icon(focused){
          return <Compass
            fill={focused ? 'white' : undefined}
            color={focused ? 'black' : undefined}
          />
      },
        to: '/portals'
    },

    {
        key: 'wallet',
        title: 'Wallet',
        icon(focused){
            return focused ? <Wallet /> : <Wallet />
        },
        to: '/solid-wallet'
    },
    {
        key: 'settings',
        title: 'Settings',
        icon(focused){
            return focused ? <Settings/> : <Settings/>
        },
        to: '/settings'
    }
]


interface DrawerProps extends DrawerContentComponentProps {}


export default function DrawerContent(props: DrawerProps) {
    const { state, navigation, descriptors } = props
    const router = useRouter()
    const { currentTabKey, setCurrentTabKey } = useShellProvider()
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })
    const accountStats = useQuery(GET_ACCOUNT_STATS, {
        variables: {
            accountAddress: delegateManager.owner!
        }
    })

    const renderKey = useCallback((props: { item: DrawerNavigationKey, index: number })=>{
        const { item, index } = props

        const handleNavigate = () => {
            setCurrentTabKey(item.key)
            router.push(
                // @ts-ignore - react router's problems
                item.to
            )
        }

        return (
            <TouchableOpacity onPress={handleNavigate} style={{width: '100%'}} >
                <XStack w={'100%'} columnGap={10} alignItems={'center'} py={20} >
                    {item?.icon(currentTabKey == item.key)}
                    <Text fontSize={18} >
                        {item.title}
                    </Text>
                </XStack>
            </TouchableOpacity>
        )
    },[currentTabKey])


    return <YStack backgroundColor={'$portalBackground'} flex={1} w={"100%"} h={"100%"} p={20} >
        <FlatList ListHeaderComponent={()=>(
            <YStack mb={20} w={"100%"} rowGap={10} >
                <Avatar circular size={'$6'} >
                    <Avatar.Image src={Utils.parseAvatarImage(delegateManager?.owner ?? '1' ,profileQuery?.data?.account?.profile?.pfp)} />
                    <Avatar.Fallback backgroundColor={'pink50'} />
                </Avatar>
                <YStack>
                    <Text fontWeight={'bold'} fontSize={22} >
                        {profileQuery?.data?.account?.profile?.display_name}
                    </Text>
                    <Text color={'$sideText'} fontSize={18} >
                        @{profileQuery?.data?.account?.username?.username}
                    </Text>
                </YStack>
                <XStack columnGap={10} >
                    <XStack alignItems={'center'} columnGap={5} >
                        <Text fontSize={17} >
                            {accountStats?.data?.accountStats?.followers}
                        </Text>
                        <Text fontSize={17} color={'$sideText'} >followers</Text>
                    </XStack>
                    <XStack alignItems={'center'} columnGap={5} >
                        <Text fontSize={17} >
                            {accountStats?.data?.accountStats?.following}
                        </Text>
                        <Text fontSize={17} color={'$sideText'} >following</Text>
                    </XStack>
                </XStack>
            </YStack>
        )} data={drawerKeys} renderItem={renderKey} />

    </YStack>
}