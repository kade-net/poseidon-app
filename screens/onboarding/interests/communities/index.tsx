import { Button, Heading, Text, View, YStack } from "tamagui"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Utils } from "../../../../utils"
import UnstyledButton from "../../../../components/ui/buttons/unstyled-button"
import { ChevronRight } from "@tamagui/lucide-icons"
import { router } from "expo-router"
import CommunitiesChoice from "./communities-choice"

const CommunitiesInterest =  () => {
    const insets = useSafeAreaInsets()

    const goToNext = () => {
        router.replace('/(tabs)/feed/home')
    }

    const handleCommunitiesInterestSkip = async () => {
        goToNext()
    }

    return(
        <View pt={insets.top} px={Utils.dynamicWidth(5)} pb={insets.bottom} flex={1} backgroundColor={"$background"}>
            <YStack>
                <View flexDirection='row' w="100%" justifyContent='space-between' alignItems='center'>
                    <Heading size={"$md"} color={"$text"} >
                        Communities
                    </Heading>
                    <UnstyledButton label='Skip' icon={<ChevronRight/>} after={true} callback={handleCommunitiesInterestSkip}/>
                </View>
                <Heading color={"$text"} size="$sm" my={10}>
                        What communities would you be interested in?
                </Heading>
            </YStack>
            <CommunitiesChoice/>
        </View>
    )
}

export default CommunitiesInterest;