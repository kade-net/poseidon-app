import {YStack} from "tamagui";
import Messaging from "../../../../screens/messaging";
import {Stack} from "expo-router";


export default function MessagingScreen(){

    return (
        <YStack flex={1} w={"100%"} h={"100%"} pos={'relative'} >
            <Stack.Screen/>
            <Messaging/>
        </YStack>
    )
}