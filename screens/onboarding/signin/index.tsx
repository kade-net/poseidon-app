import { View, Text, Button, Heading } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, KeySquare, MonitorUp } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'

const SignIn = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const goBack = () => {
        router.back()
    }

    const goToSeedPhrase = () => {
        router.push('/onboard/seed-phrase/')
    }

    const goToKadeConnect = () => {
        router.push('/onboard/kade-connect/scan')
    }

    return (
        <View
            pt={insets.top}
            pb={insets.bottom}
            flex={1}
            w="100%"
            backgroundColor={"$background"}
        >
            <View w="100%" >
                <Button
                    onPress={goBack}
                    icon={<ChevronLeft />}
                    w={100}
                    backgroundColor={"$button"}
                    color="$buttonText"
                >
                    Back
                </Button>
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