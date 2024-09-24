import {Text, View, XStack, YStack} from "tamagui";
import {useFocusEffect, useNavigation} from "expo-router";
import {TouchableOpacity} from "react-native";
import {DrawerActions} from "@react-navigation/native";
import {Menu, Settings} from "@tamagui/lucide-icons";
import {NotificationList} from "./notification-list";
import notifications from "../../lib/notifications";
import useDisclosure from "../../components/hooks/useDisclosure";
import BaseContentSheet from "../../components/ui/action-sheets/base-content-sheet";
import {NotificationsSettings} from "./notifications-settings";
import {useQueryClient} from "react-query";


export function Notifications() {
    const navigation = useNavigation()
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const queryClient = useQueryClient()
    useFocusEffect(()=>{
        return (
            async ()=> {
           try {
               await notifications.updateLastRead('posts')
               await queryClient.invalidateQueries(['lastReadNotification-publications'])
           }
           catch (e)
           {
               console.log("Something went wrong ::", e)
           }
        })
    })

    return (
        <YStack flex={1} w={'100%'} h={'100%'} bg={'$background'} >
            <XStack w={"100%"} alignItems={'center'} px={10} py={10} justifyContent={'space-between'} borderBottomWidth={1} borderBottomColor={'$border'} >
                <TouchableOpacity
                    onPress={()=>{
                        navigation.dispatch(DrawerActions.toggleDrawer())
                    }}
                >
                    <Menu color={'$sideText'} />
                </TouchableOpacity>
                <Text fontSize={18} fontWeight={'bold'} >
                    Notifications
                </Text>
                <TouchableOpacity
                    onPress={()=>{
                        onOpen()
                    }}
                >
                    <Settings/>
                </TouchableOpacity>
            </XStack>
            <YStack flex={1} w={"100%"} h={'100%'} >
                <NotificationList/>
            </YStack>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={()=>onClose()}
                snapPoints={[20]}
                showOverlay
            >
                <NotificationsSettings/>
            </BaseContentSheet>
        </YStack>
    )
}