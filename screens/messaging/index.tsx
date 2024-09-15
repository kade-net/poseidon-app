import {Separator, Text, View, XStack, YStack} from "tamagui";
import {FlatList, TouchableOpacity} from "react-native";
import {Menu, Plus} from "@tamagui/lucide-icons";
import {Link, useNavigation} from "expo-router";
import {DrawerActions} from "@react-navigation/native";
import {conversationHeaders} from "./data";
import {useCallback} from "react";
import {CONVERSATION_HEADER, MESSAGE_TYPE} from "@kade-net/fgs-rn";
import {MessageCard} from "./components";


export default function Messaging() {
    const navigation = useNavigation()

    // TODO: load conversations

    const renderConversation = useCallback((props: {item: CONVERSATION_HEADER})=>{
        return <MessageCard lastMessage={{
            originator: '0xa5531453406f380515049743a59620fb6f4e126c2c0cca1f379712f0d835d574',
            content: 'GM',
            attachments: [],
            timestamp: Date.now(),
            id: 'msg_43',
            type: MESSAGE_TYPE.MESSAGE
        }} conversationHeader={props.item} />
    },[])

    return (
        <YStack bg={"$background"} flex={1} w={"100%"} h={"100%"} rowGap={10} position={'relative'} >
            <XStack w={"100%"} alignItems={'center'} px={10} py={10} justifyContent={'space-between'} borderBottomWidth={1} borderBottomColor={'$border'} >
                <TouchableOpacity
                    onPress={()=>{
                        navigation.dispatch(DrawerActions.toggleDrawer())
                    }}
                >
                    <Menu color={'$sideText'} />
                </TouchableOpacity>
                <Text fontSize={18} fontWeight={'bold'} >
                    Messages
                </Text>
                <View></View>
            </XStack>
            <FlatList ItemSeparatorComponent={()=> <Separator borderColor={'$border'} />} data={conversationHeaders} renderItem={renderConversation} ListFooterComponent={()=> {
                return (
                    <XStack w={"100%"} alignItems={'center'} justifyContent={'center'} p={20} >
                        <Text fontSize={15} color={'$sideText'} >
                            No more conversations to show
                        </Text>
                    </XStack>
                )
            }} />

            <Link asChild href={`/home/tabs/messages/search`}>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 20,
                        bottom: 10,
                    }}
                >
                    <XStack p={10} borderRadius={100} backgroundColor={'$primary'} >
                        <Plus/>
                    </XStack>
                </TouchableOpacity>
            </Link>
        </YStack>
    )
}