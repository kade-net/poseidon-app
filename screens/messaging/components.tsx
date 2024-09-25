import {Text, XStack, YStack} from "tamagui";
import {CONVERSATION_HEADER, MESSAGE} from "@kade-net/fgs-rn";
import {useQuery} from "@apollo/client";
import {GET_MY_PROFILE} from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import dayjs from "dayjs";
import {sortBy, truncate} from "lodash";
import {Link} from "expo-router";
import {TouchableOpacity} from "react-native";
import {useQuery as uzQuery, useQueryClient} from 'react-query'
import fgs from "../../lib/fgs";
import {SortOrder} from "../../__generated__/graphql";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import notifications from "../../lib/notifications";
import {useEffect} from "react";
import {getOtherParticipants} from "../../lib/fgs/functions";
import {Image} from "@tamagui/lucide-icons";

interface MessageCardProps {
    conversationHeader: CONVERSATION_HEADER
}
export function MessageCard(props: MessageCardProps){
    const {conversationHeader } = props

    const participantQuery = uzQuery({
        queryKey: ['participants', conversationHeader.conversation_id],
        queryFn: async ()=>{
            try {
                const participants = await getOtherParticipants(conversationHeader)
                const firstOtherParticipant = participants.at(0)

                return firstOtherParticipant
            }catch(e){
                return null
            }
        }
    })

    // let otherParticipant = conversationHeader?.participants?.find(p => p !== delegateManager.owner)
    // otherParticipant = otherParticipant ?? conversationHeader?.originator

    const queryClient = useQueryClient()

    const { data: lastNotificationRead } = uzQuery({
        queryKey: ["lastNotificationRead"],
        queryFn: () => {
            return notifications.getNotificationCounter('dms')
        }
    })

    const lastMessageQuery = uzQuery({
        queryFn: async () => {
            try {
                const conversation =  await fgs.client!?.conversation(conversationHeader.conversation_id)

                if(conversation){
                    const lastMessage = await conversation.getLastMessage()
                    return lastMessage
                }else
                {
                    return null
                }

            }
            catch (e)
            {
                return null
            }
        },
        queryKey: [`last-message-${conversationHeader.conversation_id}`]
    })

    useEffect(()=>{
        const listener = async () => {
            if(!conversationHeader.conversation_id) return null;
            if(!fgs.client) return null;
            try {
                const conversation =  await fgs.client!?.conversation(conversationHeader.conversation_id)

                if(conversation){
                    await conversation.stream({
                        onMessage(message){
                            if(message){
                                lastMessageQuery.refetch()
                                if(message.originator !== delegateManager.account?.address().toString()){
                                    queryClient.refetchQueries(['messageCount']).then(()=>{
                                        console.log("refetching data")
                                    }).catch((e)=>{

                                    })
                                }
                            }
                        },
                        onError(error){
                            console.log("Something went wrong", error)
                        },
                        onComplete(){
                            console.log("Done reading conversation")
                        }
                    })
                }

            }
            catch (e)
            {
                console.log("Something went wrong with the stream::", e)
            }
        }

        listener()


    }, [conversationHeader.conversation_id])



    const MESSAGE_CONTENT = lastMessageQuery?.data?.content?.trim() ?? ""
    const HAS_ATTACHMENT = (lastMessageQuery?.data?.attachments?.length ?? 0) > 0

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: participantQuery.data,
        },
        skip: !participantQuery.data,
    })

    const lastWasMe = lastMessageQuery?.data?.originator == delegateManager.owner

    if (lastMessageQuery?.isLoading || profileQuery?.loading || participantQuery.isLoading) {
        return (
            <MotiView transition={{ type: 'timing' }} style={{ width: '100%' }} >
                <XStack w={'100%'} columnGap={10} p={10} >
                    <Skeleton colorMode={'dark'} radius={'round'} width={40} height={40} />
                    <YStack flex={1} w={'100%'} rowGap={10} >
                        <Skeleton colorMode={'dark'} width={'100%'} height={10} />
                        <Skeleton colorMode={'dark'} width={'50%'} height={10} />
                        <Skeleton colorMode={'dark'} width={'20%'} height={5} />
                    </YStack>
                </XStack>
            </MotiView>
        )
    }

    const IS_UNREAD = lastNotificationRead?.lastRead ? lastNotificationRead.lastRead < (lastMessageQuery?.data?.timestamp ?? 1) : false

    return (
        <Link asChild href={{
            pathname: "/home/tabs/messages/[conversationId]",
            params: {
                conversationId: conversationHeader.conversation_id
            }
        }}>
            <TouchableOpacity  style={{width: "100%"}} >
                <XStack w={"100%"} columnGap={10} px={10} py={10}  >
                    <BaseAvatar size={'$lg'} src={Utils.parseAvatarImage(profileQuery?.data?.account?.address ?? '1' , profileQuery?.data?.account?.profile?.pfp)} />
                    <YStack w={"100%"} flex={1} position={'relative'} >
                        {IS_UNREAD && <XStack p={5} borderRadius={20} backgroundColor={'$primary'} pos={'absolute'} right={10}
                            top={10}></XStack>}

                        <XStack w={"100%"} columnGap={5} alignItems={'center'} flex={1} >
                            <Text fontSize={16} fontWeight={'bold'} >
                                {truncate(profileQuery?.data?.account?.profile?.display_name ?? "", {
                                    length: 10,
                                    omission: '...'
                                })}
                            </Text>
                            {lastMessageQuery?.data && <Text fontSize={16} color={'$sideText'}>
                                {
                                    Utils.formatTimestamp(lastMessageQuery?.data?.timestamp ?? Date.now())
                                }
                            </Text>}
                        </XStack>

                        <Text fontSize={15} color={'$sideText'} >
                            @{profileQuery?.data?.account?.username?.username}
                        </Text>
                        {
                            lastMessageQuery?.data &&<XStack alignItems={'center'} columnGap={5} >
                                <Text fontSize={14} color={'$sideText'} >
                                    {
                                        lastWasMe ? `You: ${truncate(lastMessageQuery?.data?.content, { length: 10 })?.trim()}` :
                                            `${profileQuery?.data?.account?.username?.username ?? ""}: ${truncate(MESSAGE_CONTENT, { length: 10 })?.trim()}`
                                    }
                                </Text>
                                {HAS_ATTACHMENT && <Image size={14} color={'$sideText'}/>}
                            </XStack>
                        }
                    </YStack>
                </XStack>
            </TouchableOpacity>
        </Link>
    )
}