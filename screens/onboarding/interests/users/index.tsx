import { Button, Heading, Text, View, YStack } from "tamagui"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Utils } from "../../../../utils"
import UnstyledButton from "../../../../components/ui/buttons/unstyled-button"
import { ChevronRight } from "@tamagui/lucide-icons"
import { router } from "expo-router"
import PeopleSearch from "../../../tabs/search/tabs/people"
import UsersAccounts from "./users-accounts"
import Toast from "react-native-toast-message"
import { useEffect } from "react"
import { BackHandler, NativeEventSubscription } from "react-native"

const UsersInterest =  () => {
    const insets = useSafeAreaInsets()

    const handleSkip = () => {
        router.push('/onboard/interests/topics/')
    }

    const preventBackFlow = (): boolean => {
        Toast.show({
            type: 'info',
            text2: `Please complete profile creation`,
        })

        return true
    }

    useEffect(() => {

        const subscription: NativeEventSubscription = BackHandler.addEventListener('hardwareBackPress', preventBackFlow)


        return () => {
            
            subscription.remove()
        }

    },[])


    return(
        <View px={20} flex={1} backgroundColor={"$background"}>
            <YStack>
                <View flexDirection='row' w="100%" justifyContent='space-between' alignItems='center'>
                    <Heading size={"$md"} color={"$text"} >
                        Users
                    </Heading>
                    <UnstyledButton label='Skip' icon={<ChevronRight/>} after={true} callback={handleSkip}/>
                </View>
                <Heading color={"$text"} size="$sm" py={10}>
                    Follow users to see their posts and updates
                </Heading>
                <UsersAccounts/>
            </YStack>
        </View>
    )
}

export default UsersInterest;