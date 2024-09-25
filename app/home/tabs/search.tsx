import {YStack} from "tamagui";
import {ShellBottomTabNavigator} from "../../../screens/shell";
import UserSearch from "../../../screens/user-search";


export default function Search() {
    return (
        <YStack flex={1} bg={"$background"} w={"100%"} h={"100%"} >
            <UserSearch/>
        </YStack>
    )
}