import {Text, TextArea, useTheme, View, XStack, YStack} from "tamagui";
import {Conversation as CConversation, CONVERSATION_HEADER, MESSAGE, MESSAGE_TYPE} from "@kade-net/fgs-rn";
import {useQuery} from "@apollo/client";
import {GET_MY_PROFILE} from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import {FlatList, TouchableOpacity} from "react-native";
import {ChevronLeft, SendHorizontal} from "@tamagui/lucide-icons";
import {useRouter} from "expo-router";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {Message} from "./message";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as Haptics from 'expo-haptics'

interface ConversationContext {
    conversation: CConversation | null;
    setConversation: (conversation: CConversation) => void;
    messages: Array<MESSAGE>;
    addMessage: (message: MESSAGE) => void;
    setLoadedMessages: (messages: Array<MESSAGE>) => void;
}

const context = React.createContext<ConversationContext>({
    conversation: null,
    setConversation: (_)=>{},
    messages: [],
    addMessage: (message: MESSAGE) =>{},
    setLoadedMessages: (messages: Array<MESSAGE>) =>{},
})

export const ConversationProvider = (props: {children: ReactNode})=>{
    const [conversation, setConversation] = useState<CConversation|null>(null);
    const [loadedMessages, setLoadedMessages] = useState<Array<MESSAGE>>([]);

    const addMessage = async (message: MESSAGE) =>{
        setLoadedMessages(messages => [...messages, message])
    }
    return (
        <context.Provider value={{
            setConversation,
            conversation,
            messages: loadedMessages,
            addMessage,
            setLoadedMessages
        }} >
            {props.children}
        </context.Provider>
    )
}

export const useConversationContext = () => {
    const conv = useContext(context)

    return conv
}

interface ConversationHeaderProps {
    data: CONVERSATION_HEADER
}
export function ConversationHeader(props: ConversationHeaderProps){
    const { conversation } = useConversationContext()
    const otherParticipant = conversation?.header.participants.find(p => p !== delegateManager.account?.address().toString())

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
    const { conversation, messages } = useConversationContext()
    const { header } = props
    // TODO: get messages



    const renderMessage = (props: {item: MESSAGE}) => {
        return <Message data={props.item} />
    }


    return (
        <FlatList style={{
            paddingVertical: 20,
            flex: 1,
            width: '100%',
            height: '100%',
        }}  data={messages ?? []} renderItem={renderMessage} />
    )

}

const MessageForm = z.object({
    content: z.string().trim().min(1)
})

type TMessageForm = z.infer<typeof MessageForm>

interface MessageBoxProps {
    header: CONVERSATION_HEADER
}
function MessageBox(props: MessageBoxProps){
    const { conversation } = useConversationContext()

    const [focused, setFocused] = useState(false)
    const theme = useTheme()

    const form = useForm<TMessageForm>({
        resolver: zodResolver(MessageForm)
    })

    const handleSendMessage = async (values: TMessageForm) => {
        await Haptics.selectionAsync()
        const ack = await conversation?.sendMessage({
            content: values.content,
            type: MESSAGE_TYPE.MESSAGE,
            attachments: []
        })

        console.log("Acknowledgement::", ack)
    }

    const handleFormError = async (errors: any) => {
       await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        console.log(errors)
    }

    const content = form.watch('content') ?? ""
    const IS_ENABLED = content?.length > 0

    return (
        <XStack w={"100%"} px={10} pb={5} >
            <XStack px={5} borderWidth={focused ? 1 : 0} borderColor={focused ? '$primary' : undefined} w={"100%"} justifyContent={'space-between'} backgroundColor={'$portalBackground'} borderRadius={30} >
                <Controller control={form.control} render={({field})=>{
                    return (
                        <TextArea
                            flex={1}
                            backgroundColor={'$colorTransparent'}
                            borderWidth={0}
                            outlineWidth={0}
                            onFocus={()=>setFocused(true)}
                            onBlur={()=>setFocused(false)}
                            placeholder={'Say hey!'}
                            onChangeText={field.onChange}
                        />
                    )
                }} name={'content'} />
                <TouchableOpacity
                    disabled={!IS_ENABLED}
                    onPress={form.handleSubmit(handleSendMessage, handleFormError)}
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
        </YStack>
    )
}