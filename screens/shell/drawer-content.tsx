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
import {Settings, Wallet} from "@tamagui/lucide-icons";
import {FlatList, TouchableOpacity} from "react-native";
import {useCallback} from "react";
import {RouteParams, useRouter} from "expo-router";

type DrawerNavigationKey = {
    key: string,
    title: string,
    icon: (focused: boolean) => JSX.Element,
}

const drawerKeys: Array<DrawerNavigationKey> = [
    {
        key: 'home',
        title: 'Home',
        icon(focused){
            return focused ? <HomeIcon color={'white'} /> : <HomeIconOutlined color={'white'} />
        }
    },
    {
        key: 'search',
        title: 'Search',
        icon(focused){
            return focused ? <SearchIcon color={'white'} /> : <SearchIconOutlined color={'white'} />
        }
    },
    {
        key: 'message',
        title: 'Message',
        icon(focused){
            return focused ? <MessageIcon color={'white'} /> : <MessageOutlined color={'white'} />
        }
    },
    {
        key: 'notifications',
        title: 'Notifications',
        icon(focused){
            return focused ? <NotificationSolid color={'white'} /> : <NotificationOutlined color={'white'} />
        }
    },
    {
        key: 'profile',
        title: 'Profile',
        icon(focused){
            return focused ? <ProfileIconSolid color={'white'} /> : <ProfileIcon color={'white'} />
        }
    },
    {
        key: 'settings',
        title: 'Settings',
        icon(focused){
            return focused ? <Settings/> : <Settings/>
        }
    },
    {
        key: 'wallet',
        title: 'Wallet',
        icon(focused){
            return focused ? <Wallet /> : <Wallet />
        }
    }
]


interface DrawerProps extends DrawerContentComponentProps {}


export default function DrawerContent(props: DrawerProps) {
    const { state, navigation, descriptors } = props
    const router = useRouter()

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


        return (
            <TouchableOpacity style={{width: '100%'}} >
                <XStack w={'100%'} columnGap={10} alignItems={'center'} py={20} >
                    {item?.icon(false)}
                    <Text fontSize={18} >
                        {item.title}
                    </Text>
                </XStack>
            </TouchableOpacity>
        )
    },[])


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