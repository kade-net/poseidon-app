import { Button, Heading, Text, View, YStack } from "tamagui"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from "expo-router"
import CommunitiesChoice from "./communities-choice"
import Toast from "react-native-toast-message"
import { useEffect } from "react"
import { BackHandler, NativeEventSubscription } from "react-native"

const CommunitiesInterest =  () => {
    const insets = useSafeAreaInsets()

    const goToNext = () => {
        router.replace('/onboard/notification')
    }

    const handleCommunitiesInterestSkip = async () => {
        goToNext()
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
        <View p={20} flex={1} backgroundColor={"$background"}>
            <YStack>
                <View flexDirection='row' w="100%" justifyContent='space-between' alignItems='center'>
                    <Heading size={"$md"} color={"$text"} >
                        Communities
                    </Heading>
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