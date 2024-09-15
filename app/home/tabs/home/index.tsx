import {YStack} from "tamagui";
import {HomeTopNavigator, ShellBottomTabNavigator} from "../../../../screens/shell";
import Home from '../../../../screens/tabs/feed/home'
import FeedTabs from "../../../../screens/feed-tabs";

export default function HomeScreen(){
    return (
        <YStack flex={1} w={"100%"} h={'100%'} >
            <FeedTabs/>
        </YStack>
    )
}