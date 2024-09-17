import {Stack} from "expo-router";
import {ConversationProvider} from "../../../../../screens/messaging/conversation";


export default function _layout(){
    return (
        <ConversationProvider>
            <Stack screenOptions={{headerShown: false}} >
                <Stack.Screen name={"index"} />
            </Stack>
        </ConversationProvider>
    )
}