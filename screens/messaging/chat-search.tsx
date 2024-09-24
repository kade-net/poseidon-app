import {Account} from "../../__generated__/graphql";
import { Separator, Spinner, Text, View, XStack, YStack } from "tamagui";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import BaseButton from "../../components/ui/buttons/base-button";
import {ArrowLeft, ChevronLeft, Mail} from "@tamagui/lucide-icons";
import {useRouter} from "expo-router";
import {memo, useCallback, useState} from "react";
import {useQuery} from "@apollo/client";
import {ACCOUNTS_SEARCH_QUERY} from "../../utils/queries";
import {FlatList, TouchableOpacity} from "react-native";
import SearchInput from "../../components/ui/search-input";
import Empty from "../../components/ui/feedback/empty";
import fgs from "../../lib/fgs";
import { Conversation, getInbox, NODE_ENTRY_FUNCTIONS } from "@kade-net/fgs-rn";
import * as Haptics from 'expo-haptics'
import posti from "../../lib/posti";
import { aptos, KADE_ACCOUNT_ADDRESS } from "../../contract";
import delegateManager from "../../lib/delegate-manager";
import {useQuery as uzQuery, useQueryClient} from 'react-query'
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { convergenceClient } from "../../data/apollo";
import { FGS_UPDATE_CONVERSATION_LIST } from "../../lib/convergence-client/queries";
import { AccountAddress, AccountAuthenticator, Deserializer, RawTransaction } from "@aptos-labs/ts-sdk";
import Toast from "react-native-toast-message";
import {getRegisteredDelegates} from "../../lib/fgs/functions";
import {getConversations} from "./index";


interface  ProfileCardWithButtonProps {
    data: Account
}

const ProfileCardWithButton = memo((props: ProfileCardWithButtonProps)=>{
    const [creating, setCreating] = useState(false)
    const router = useRouter()
    const { data } = props
    const queryClient = useQueryClient()

    const userInboxQuery = uzQuery({
        queryKey: ['inbox', data?.address],
        enabled: !!data?.address,
        queryFn: async () => {
            try {
                const registered = await getRegisteredDelegates(data?.address)

                return (registered?.length ?? 0) > 0 ? {address: registered.at(0)} : null
            }
            catch (e) {
                return null
            }
        },
        retry() {
            return false
        }
    })

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

            console.log("Existing")

            return
        }
        setCreating(true)
        try {

            const otherRegisteredDelegates = await getRegisteredDelegates(data?.address)
            const myRegisteredDelegates = await getRegisteredDelegates(delegateManager.owner!)

            const combinedList = myRegisteredDelegates.concat(otherRegisteredDelegates)

            const {header, hex} = await Conversation.createConversation(fgs.client!, {
                participants: combinedList,
            })

            const serializedTransaction = await convergenceClient.mutate({
                mutation: FGS_UPDATE_CONVERSATION_LIST,
                variables: {
                    input: {
                        newConversationList: hex,
                        sender_address: delegateManager.account?.address().toString()!
                    }
                }
            })

            const raw_txn = new Deserializer(new Uint8Array(serializedTransaction.data?.fgsUpdateConversationList?.raw_transaction!))
            const signature_deserializer = new Deserializer(new Uint8Array(serializedTransaction.data?.fgsUpdateConversationList?.signature!))

            const raw_transaction = RawTransaction.deserialize(raw_txn)
            const signature = AccountAuthenticator.deserialize(signature_deserializer)

            const accountSignature = aptos.transaction.sign({
                signer: delegateManager.signer!,
                transaction: {
                    rawTransaction: raw_transaction,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                }
            })

            const pendingTransaction = await aptos.transaction.submit.simple({
                senderAuthenticator: accountSignature,
                transaction: {
                    rawTransaction: raw_transaction,
                    feePayerAddress: AccountAddress.from(KADE_ACCOUNT_ADDRESS)
                },
                feePayerAuthenticator: signature
            })

            console.log("Transaction Hash:: ", pendingTransaction.hash)

            await queryClient.invalidateQueries(['pending-conversations'])

            try{
                await getConversations()
            }
            catch(e)
            {

            }

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
            Toast.show({
                text1: "Unable to create conversation",
                text2: "Please try again",
                type: 'error'
            })
        }
        finally {
            setCreating(false)
        }
    }

    if (userInboxQuery.isLoading) {
        return (
            <MotiView transition={{ type: 'timing' }} style={{ width: '100%' }} >
                <XStack w={'100%'} columnGap={10} p={10} >
                    <Skeleton colorMode={'dark'} radius={'round'} width={40} height={40} />
                    <YStack flex={1} w={'100%'} rowGap={10} >
                        <Skeleton colorMode={'dark'} width={'50%'} height={10} />
                        <Skeleton colorMode={'dark'} width={'40%'} height={10} />
                    </YStack>
                </XStack>
            </MotiView>
        )
    }

    if(data?.address == delegateManager.owner) return null;
    if(fgs.client?.conversationList?.find(c => c.participants.includes(data?.address ?? ''))) return null;

    return (
        <TouchableOpacity disabled={!userInboxQuery?.data || creating} style={{ width: '100%', opacity: userInboxQuery?.data ? 1 : 0.5 }} onPress={handleCreateConversation} >
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
                {
                    creating && <Spinner />
                }
            </XStack>
        </TouchableOpacity>
    )
})


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
                <FlatList ListEmptyComponent={() => <Empty emptyText={'Users who have \n enabled dms will appear here'} flex={1} w={"100%"} h={"100%"} />} ItemSeparatorComponent={() => <XStack w={"100%"} pb={10} />} data={profilesQuery?.data?.accounts ?? []} renderItem={renderProfile} />
            </YStack>
        </YStack>
    )
}