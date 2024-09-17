import {Account} from "../../__generated__/graphql";
import {Separator, Text, View, XStack, YStack} from "tamagui";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import BaseButton from "../../components/ui/buttons/base-button";
import {ArrowLeft, ChevronLeft, Mail} from "@tamagui/lucide-icons";
import {useRouter} from "expo-router";
import {useCallback, useState} from "react";
import {useQuery} from "@apollo/client";
import {ACCOUNTS_SEARCH_QUERY} from "../../utils/queries";
import {FlatList, TouchableOpacity} from "react-native";
import SearchInput from "../../components/ui/search-input";
import Empty from "../../components/ui/feedback/empty";
import fgs from "../../lib/fgs";
import {Conversation, NODE_ENTRY_FUNCTIONS} from "@kade-net/fgs-rn";
import * as Haptics from 'expo-haptics'
import posti from "../../lib/posti";
import {aptos} from "../../contract";
import delegateManager from "../../lib/delegate-manager";


interface  ProfileCardWithButtonProps {
    data: Account
}

function ProfileCardWithButton(props: ProfileCardWithButtonProps){
    const [creating, setCreating] = useState(false)
    const router = useRouter()
    const { data } = props

    const handleCreateConversation = async () => {
        await Haptics.selectionAsync()
        if(creating){
            return
        }
        if(!fgs.client){
            return
        }

        const existingConversation = fgs.client.conversationList.find((header)=>{
            const participantMatch = header.participants.find(p => p == data?.address)
            if(participantMatch){
                return true
            }
        })

        if(existingConversation){
            router.push({
                pathname: '/home/tabs/messages/[conversationId]',
                params: {
                    conversationId: existingConversation.conversation_id
                }
            })
        }
        setCreating(true)
        try {
            const {header, hex} = await Conversation.createConversation(fgs.client!, {
                participants: [
                    data?.address
                ]
            })

            const transaction = await aptos.transaction.build.simple({
                sender: delegateManager.account?.address().toString()!,
                data: {
                    function: NODE_ENTRY_FUNCTIONS.updateConversationList.path,
                    functionArguments: NODE_ENTRY_FUNCTIONS.updateConversationList.parseArgs({
                        newConversationList: hex
                    })
                }
            })

            const commitedTxn = await aptos.transaction.signAndSubmitTransaction({
                signer: delegateManager.signer!,
                transaction
            })

            console.log("Transaction Hash:: ", commitedTxn.hash)

            router.push({
                pathname: '/home/tabs/messages/[conversationId]',
                params: {
                    conversationId: header.conversation_id
                }
            })

        }
        catch(e){
            posti.capture("unable to create conversation", {
                error: e
            })
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            console.log("Something went wrong::", e)
        }
        finally {
            setCreating(false)
        }
    }

    return (
        <TouchableOpacity style={{width: '100%'}} onPress={handleCreateConversation} >
            <XStack w={"100%"} justifyContent={'space-between'} alignItems={'center'} px={10} py={10} >
                <XStack columnGap={10} >
                    <BaseAvatar size={'$md'} src={Utils.parseAvatarImage(data?.address ?? "1", data?.profile?.pfp)} />
                    <YStack>
                        <Text fontSize={16} fontWeight={'bold'} >
                            {data?.profile?.display_name}
                        </Text>
                        <Text fontSize={15}  >
                            @{data?.username?.username}
                        </Text>
                    </YStack>
                </XStack>
            </XStack>
        </TouchableOpacity>
    )
}


export function ChatSearch(){
    const router = useRouter()
    const [search, setSearch] = useState("")

    const profilesQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
        variables: {
            search: search.trim(),
            page: 0,
            size: 10
        },
        skip: (search.trim().length ?? 0) == 0
    })

    const renderProfile =  useCallback((props: {item: any, index: number})=>{


        return (
            <ProfileCardWithButton data={props.item}  />
        )
    }, [])


    return (
        <YStack flex={1} w={"100%"} h={"100%"} bg={"$background"} rowGap={10} >
            <XStack w={"100%"} alignItems={'center'} justifyContent={'space-between'} px={10} >
                <TouchableOpacity onPress={router.back} >
                    <ChevronLeft color={'$sideText'} />
                </TouchableOpacity>
                <Text fontSize={18} >
                    Start a new chat
                </Text>
                <View></View>
            </XStack>
            <XStack columnGap={10} px={10} py={10} alignItems={'center'} >
                <SearchInput value={search} onChangeText={setSearch} />
            </XStack>
            <YStack w={"100%"} h={"100%"} flex={1} >
                <FlatList ListEmptyComponent={()=> <Empty emptyText={'Matches will show up here'} flex={1} w={"100%"} h={"100%"} />} ItemSeparatorComponent={()=><XStack w={"100%"} pb={10} />} data={profilesQuery?.data?.accounts ?? []} renderItem={renderProfile} />
            </YStack>
        </YStack>
    )
}