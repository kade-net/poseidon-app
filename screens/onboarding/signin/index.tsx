import { View, Text, Button, Heading } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, KeySquare, MonitorUp } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Utils } from '../../../utils'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'

const SignIn = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const goBack = () => {
        router.back()
    }

    const goToSeedPhrase = () => {
        router.replace('/onboard/seed-phrase/')
    }

    const goToKadeConnect = () => {
        router.replace('/onboard/kade-connect/scan')
    }

    return (
        <View
            pt={insets.top}
            pb={insets.bottom}
            flex={1}
            w="100%"
            backgroundColor={"$background"}
            paddingHorizontal={Utils.dynamicWidth(5)}
        >
            <View w="100%" >
                <UnstyledButton callback={goBack} icon={<ChevronLeft/>} label={"Back"}/>  
            </View>
            <View
                flex={1}
                alignItems='center'
                justifyContent='center'
                px={20}
                rowGap={40}
            >
                <Heading textAlign='center' color={"$text"}>
                    How would you like to sign in?
                </Heading>
                <View
                    rowGap={20}
                >
                    <Button onPress={goToKadeConnect} iconAfter={<MonitorUp />} backgroundColor={"$button"} color="$buttonText">
                        Sign in with Kade Connect
                    </Button>
                    <Button onPress={goToSeedPhrase} iconAfter={<KeySquare />} backgroundColor={"$button"} color="$buttonText">
                        Sign in with Seed Phrase
                    </Button>
                </View>
            </View>
        </View>
    )
}

export default SignIn