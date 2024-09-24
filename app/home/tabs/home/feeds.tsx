import {YStack} from "tamagui";
import {Feeds} from "../../../../screens/v2/feeds";


export default function FeedsScreen(){
    return (
        <YStack flex={1} w={'100%'} h={'100%'} bg={'$background'} >
            <Feeds/>
        </YStack>
    )
}