import {Text, TextArea, useTheme, View, XStack, YStack} from "tamagui";
import {CONVERSATION_HEADER, MESSAGE_TYPE} from "@kade-net/fgs-rn";
import {useQuery} from "@apollo/client";
import {GET_MY_PROFILE} from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import {FlatList, TouchableOpacity} from "react-native";
import {ChevronLeft, SendHorizontal} from "@tamagui/lucide-icons";
import {useRouter} from "expo-router";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import {useState} from "react";
import {Message} from "./message";


interface ConversationHeaderProps {
    data: CONVERSATION_HEADER
}
export function ConversationHeader(props: ConversationHeaderProps){
    const {data} = props;
    const otherParticipant = data.participants.find(p => p !== delegateManager.account?.address().toString())

    const router = useRouter()
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: otherParticipant
        }
    })

    return (
        <XStack w={"100%"} alignItems={'center'} justifyContent={'space-between'} px={20} py={10} borderBottomWidth={1} borderBottomColor={'$border'} >
            <XStack alignItems={'center'} columnGap={20} >
                <TouchableOpacity onPress={router.back} >
                    <ChevronLeft/>
                </TouchableOpacity>
                <XStack alignItems={'center'} columnGap={10} >
                    <BaseAvatar size={'$md'} src={Utils.parseAvatarImage(profileQuery?.data?.account?.address ?? "1", profileQuery?.data?.account?.profile?.pfp)} />
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
    )

}

interface ConversationListProps {
    header: CONVERSATION_HEADER
}
export function ConversationList(props: ConversationListProps){
    const { header } = props
    // TODO: get messages

    const renderMessage = (props: any) => {
        return <Message data={{content: 'hello', originator:props?.item?.originator, type: MESSAGE_TYPE.MESSAGE}} />
    }

    return (
        <FlatList style={{
            paddingVertical: 20
        }}  data={[{}, {
            originator: delegateManager.account?.address().toString(),
        }]} renderItem={renderMessage} />
    )

}


interface MessageBoxProps {
    header: CONVERSATION_HEADER
}
function MessageBox(props: MessageBoxProps){
    const [focused, setFocused] = useState(false)
    const theme = useTheme()
    return (
        <XStack w={"100%"} px={10} pb={5} >
            <XStack px={5} borderWidth={focused ? 1 : 0} borderColor={focused ? '$primary' : undefined} w={"100%"} justifyContent={'space-between'} backgroundColor={'$portalBackground'} borderRadius={30} >
                <TextArea
                    flex={1}
                    backgroundColor={'$colorTransparent'}
                    borderWidth={0}
                    outlineWidth={0}
                    onFocus={()=>setFocused(true)}
                    onBlur={()=>setFocused(false)}
                    placeholder={'Say hey!'}
                />
                <TouchableOpacity
                 style={{
                     alignItems: 'center',
                     justifyContent: 'center',
                     backgroundColor: theme.primary.val,
                     borderRadius: 15,
                     padding: 5,
                     height: 30,
                     width: 30,
                     marginTop: 5
                 }}
                >
                    <SendHorizontal size={18} />
                </TouchableOpacity>
            </XStack>
        </XStack>
    )
}

export default function Conversation(){
    return (
        <YStack flex={1} w={"100%"} h={"100%"} bg={"$background"} >
            <ConversationHeader data={{ participants: ['0x4ef479c7f529d93cd4cf7bcbc0e9c9516816dd6d9bfad032d543327deb24ed85'] } as CONVERSATION_HEADER}/>
            <ConversationList header={{} as CONVERSATION_HEADER} />
            <MessageBox header={{} as CONVERSATION_HEADER} />
        </YStack>
    )
}