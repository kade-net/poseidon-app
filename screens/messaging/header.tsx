import { CONVERSATION_HEADER } from "@kade-net/fgs-rn";
import delegateManager from "../../lib/delegate-manager";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_MY_PROFILE } from "../../utils/queries";
import {Avatar, Text, View, XStack, YStack} from "tamagui";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "@tamagui/lucide-icons";
import BaseAvatar from "../../components/ui/avatar";
import { Utils } from "../../utils";
import React from "react";
import { useConversationContext } from "./context";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import {useQuery as uzQuery} from 'react-query'
import {getOtherParticipants} from "../../lib/fgs/functions";


interface ConversationHeaderProps {
}
export function ConversationHeader(props: ConversationHeaderProps) {
    const { conversation } = useConversationContext()

    const participantsQuery = uzQuery({
        queryKey: ['participant-search', conversation?.header?.conversation_id],
        queryFn: async () => {
            try {
                if(!conversation) return null;
                const participants = await getOtherParticipants(conversation?.header);

                return participants?.at(0)
            }
            catch (e)
            {
                console.log("Something went wrong::", e)
                return null
            }
        },
        enabled: !!conversation?.header?.conversation_id
    })

    const router = useRouter()
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: participantsQuery?.data
        },
        skip: !conversation?.header?.conversation_id || !participantsQuery?.data || participantsQuery.isLoading
    })

    if (profileQuery?.loading) {
        return (
            <MotiView transition={{ type: 'timing' }} style={{ width: '100%' }} >
                <XStack w={'100%'} columnGap={10} p={10} px={40} >
                    <Skeleton colorMode={'dark'} radius={'round'} width={40} height={40} />
                    <YStack flex={1} w={'100%'} rowGap={10} >
                        <Skeleton colorMode={'dark'} width={'40%'} height={10} />
                        <Skeleton colorMode={'dark'} width={'40%'} height={10} />
                    </YStack>
                </XStack>
            </MotiView>
        )
    }

    return (
        <TouchableOpacity style={{width: '100%', alignItems: 'center'}} onPress={router.back} >
            <XStack w={"100%"} alignItems={'center'} justifyContent={'space-between'} px={20} py={10} borderBottomWidth={1} borderBottomColor={'$border'} >
                <XStack alignItems={'center'} columnGap={20} >
                    <ChevronLeft />
                    <XStack alignItems={'center'} columnGap={10} >
                        <Avatar size={'$3'} circular >
                            <Avatar.Image src={Utils.parseAvatarImage(profileQuery?.data?.account?.address ?? "1", profileQuery?.data?.account?.profile?.pfp)} />
                            <Avatar.Fallback backgroundColor={'pink'}/>
                        </Avatar>
                        <YStack>
                            <Text fontSize={16} fontWeight={'bold'} >
                                {profileQuery?.data?.account?.profile?.display_name}
                            </Text>
                            <Text fontSize={15} color={'$sideText'} >
                                @{profileQuery?.data?.account?.username?.username}
                            </Text>
                        </YStack>
                    </XStack>
                </XStack>
                <View></View>
            </XStack>
        </TouchableOpacity>
    )

}