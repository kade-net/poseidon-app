import {Text, useTheme, XStack, YStack} from "tamagui";
import Conversation from "./conversation";
import {MESSAGE} from "@kade-net/fgs-rn";
import delegateManager from "../../lib/delegate-manager";


interface Props {
    data: MESSAGE
}
export function Message(props: Props){
    const { data } = props
    const isMe = data?.originator == delegateManager?.account?.address().toString()
    const theme = useTheme()
    return (
        <XStack w={"100%"} alignItems={'center'} justifyContent={isMe ? 'flex-end' : 'flex-start'} p={10}  >
            <YStack maxWidth={"60%"} alignItems={'center'} p={10}
                style={isMe ? {
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    backgroundColor: theme.primary.val
                } : {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor: theme.portalBackground?.val
                }}
            >
                <Text>
                    {data?.content?.trim()}
                </Text>
            </YStack>
        </XStack>
    )
}