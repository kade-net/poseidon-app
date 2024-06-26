import { View, Text, Button, Heading, XStack } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Info, KeySquare, MonitorUp, Wallet } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Utils } from '../../../utils'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import BaseButton from '../../../components/ui/buttons/base-button'

const SignIn = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const goBack = () => {
        router.replace('/')
    }

    const goToSeedPhrase = () => {
        router.replace('/onboard/seed-phrase/')
    }

    const goToKadeConnect = () => {
        router.replace('/onboard/kade-connect/scan')
    }

    const goToPetra = () => {
        router.replace('/onboard/petra-signin')
    }

    return (
        <View
            flex={1}
            w="100%"
            backgroundColor={"$background"}
            paddingHorizontal={20}
        >
            <View w="100%" >
                <UnstyledButton callback={goBack} icon={<ChevronLeft/>} label={"Back"}/>  
            </View>
            <View
                flex={1}
                alignItems='center'
                px={20}
                rowGap={40}
            >
                <Heading textAlign='center' color={"$text"}>
                    How would you like to sign in?
                </Heading>
                <View
                    rowGap={20}
                >
                    <XStack w="100%" columnGap={10}  >
                        <Info color={'$blue10'} />
                        <Text
                            color={'$blue10'}
                        >
                            Sign in with Kade Connect will only work if you already have a username!
                        </Text>
                    </XStack>
                    <BaseButton onPress={goToKadeConnect} iconAfter={<MonitorUp />} >
                        Sign in with Kade Connect
                    </BaseButton>
                    <BaseButton onPress={goToSeedPhrase} iconAfter={<KeySquare />} >
                        Sign in with Seed Phrase
                    </BaseButton>
                    {/* <BaseButton onPress={goToPetra} iconAfter={<Wallet />} >
                        Sign in with Petra
                    </BaseButton> */}
                </View>
            </View>
        </View>
    )
}

export default SignIn