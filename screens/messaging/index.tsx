import {Separator, Text, View, XStack, YStack} from "tamagui";
import {FlatList, TouchableOpacity} from "react-native";
import {Menu, Plus} from "@tamagui/lucide-icons";
import {Link, useNavigation} from "expo-router";
import {DrawerActions} from "@react-navigation/native";
import {conversationHeaders} from "./data";
import {useCallback, useMemo} from "react";
import {CONVERSATION_HEADER, deserialize_conversation_header, getInbox, MESSAGE_TYPE,} from "@kade-net/fgs-rn";
import {MessageCard} from "./components";
import {useConversationContext} from "./conversation";
import fgs from "../../lib/fgs";
import {useQuery} from "react-query";
import delegateManager from "../../lib/delegate-manager";
import nacl from 'tweetnacl'
import {Buffer} from 'buffer'

export enum Invite_Type {
    Accepted = 'ACCEPTED',
    Pending = 'PENDING',
    Rejected = 'REJECTED'
}

async function getConversations(){
    const pendingConversations = await  fgs.client?.nodeClient!?.getInvitations({
        address: delegateManager.account?.address().toString()!,
        type: Invite_Type.Pending
    })

    const headers = await Promise.all((pendingConversations?.invitations ?? [])?.map(async (invitation)=>{

        if(invitation.from == delegateManager.account?.address().toString()) {
            return null
        }

        const combinedHeader = Buffer.from(invitation.encrypted_conversation_id, 'hex')
        const nonce = combinedHeader.subarray(0,nacl.secretbox.nonceLength)
        const data = combinedHeader.subarray(nacl.secretbox.nonceLength)

        console.log("Data::", data)
        const initiatorInbox = await getInbox(invitation.from)

        const shared_secret = nacl.box.before(
            Buffer.from(initiatorInbox.encrypt_public_key, 'hex'),
            fgs.client!.encryptionKeyPair.secretKey.subarray(0,32)
        )


        const decrypted = nacl.secretbox.open(
            data,
            nonce,
            shared_secret
        )

        if(!decrypted) return null

        const utf8des = Buffer.from(decrypted).toString('utf-8')

        return deserialize_conversation_header(utf8des)

    }))
    const currentConversationList = fgs.client?.conversationList ?? []
    const combinedConversationList = [
        ...currentConversationList,
        ...headers
    ]
    return combinedConversationList?.filter(conv => conv !== null) as Array<CONVERSATION_HEADER>
}


export default function Messaging() {
    const navigation = useNavigation()
    const pendingConversationsQuery = useQuery({
        queryFn: getConversations,
        queryKey: ['pending-conversations'],
    })

    const renderConversation = useCallback((props: {item: CONVERSATION_HEADER})=>{
        return <MessageCard conversationHeader={props.item} />
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
            <FlatList ItemSeparatorComponent={()=> <Separator borderColor={'$border'} />} data={pendingConversationsQuery?.data ?? []} renderItem={renderConversation} ListFooterComponent={()=> {
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