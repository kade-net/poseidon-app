import {Text, XStack, YStack} from "tamagui";
import {CONVERSATION_HEADER, MESSAGE} from "@kade-net/fgs-rn";
import {useQuery} from "@apollo/client";
import {GET_MY_PROFILE} from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import dayjs from "dayjs";
import {truncate} from "lodash";
import {Link} from "expo-router";
import {TouchableOpacity} from "react-native";

interface MessageCardProps {
    lastMessage?: MESSAGE
    conversationHeader: CONVERSATION_HEADER
}
export function MessageCard(props: MessageCardProps){
    const { lastMessage, conversationHeader } = props

    const otherParticipant = conversationHeader?.participants?.find(p=> p !== delegateManager.owner)

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: otherParticipant,
        },
        skip: !otherParticipant,
    })

    const lastWasMe = lastMessage?.originator == delegateManager.owner

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
                            {lastMessage && <Text fontSize={16} color={'$sideText'}>
                                {
                                    dayjs(lastMessage?.timestamp).fromNow()
                                }
                            </Text>}
                        </XStack>
                        <Text fontSize={15} color={'$sideText'} >
                            @{profileQuery?.data?.account?.username?.username}
                        </Text>
                        {
                            lastMessage && <Text fontSize={14} color={'$sideText'} >
                                {
                                    lastWasMe ? `You: ${truncate(lastMessage?.content, { length: 10 })}` :
                                        `${profileQuery?.data?.account?.username?.username ?? ""}: ${truncate(lastMessage?.content, { length: 10 })}`
                                }
                            </Text>
                        }
                    </YStack>
                </XStack>
            </TouchableOpacity>
        </Link>
    )
}