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
import { useQuery as uzQuery } from 'react-query'
import fgs from "../../lib/fgs";
import {SortOrder} from "../../__generated__/graphql";

interface MessageCardProps {
    conversationHeader: CONVERSATION_HEADER
}
export function MessageCard(props: MessageCardProps){
    const {conversationHeader } = props

    const otherParticipant = conversationHeader?.participants?.find(p=> p !== delegateManager.owner)

    const lastMessageQuery = uzQuery({
        queryFn: async () => {
            try {
                const conversation =  await fgs.client!?.conversation(conversationHeader.conversation_id)

                if(conversation){
                    const messages = sortBy((await conversation.loadConversation({page: 0, size: 20}, SortOrder.Asc)) ?? [], item => -(item.timestamp ?? 0))
                    return messages?.at(0) ?? null
                }else
                {
                    return null
                }

            }
            catch (e)
            {
                console.log("Something went wrong: ", e)
                return null
            }
        },
        queryKey: [`last-message-${conversationHeader.conversation_id}`]
    })

    const MESSAGE_CONTENT = lastMessageQuery?.data?.content?.trim() ?? ""
    console.log("Content::", MESSAGE_CONTENT)

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: otherParticipant,
        },
        skip: !otherParticipant,
    })

    const lastWasMe = lastMessageQuery?.data?.originator == delegateManager.owner

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
                    <YStack w={"100%"} flex={1} >
                        <XStack w={"100%"} columnGap={5} alignItems={'center'} >
                            <Text fontSize={16} fontWeight={'bold'} >
                                {profileQuery?.data?.account?.profile?.display_name}
                            </Text>
                            {lastMessageQuery?.data && <Text fontSize={16} color={'$sideText'}>
                                {
                                    dayjs(lastMessageQuery?.data?.timestamp).fromNow()
                                }
                            </Text>}
                        </XStack>
                        <Text fontSize={15} color={'$sideText'} >
                            @{profileQuery?.data?.account?.username?.username}
                        </Text>
                        {
                            lastMessageQuery?.data && <Text fontSize={14} color={'$sideText'} >
                                {
                                    lastWasMe ? `You: ${truncate(lastMessageQuery?.data?.content, { length: 10 })?.trim()}` :
                                        `${profileQuery?.data?.account?.username?.username ?? ""}: ${truncate(MESSAGE_CONTENT, { length: 10 })?.trim()}`
                                }
                            </Text>
                        }
                    </YStack>
                </XStack>
            </TouchableOpacity>
        </Link>
    )
}