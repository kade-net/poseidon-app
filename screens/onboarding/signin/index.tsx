import { View, Text, Button, Heading, XStack, H3 } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft, ChevronLeft, Info, KeySquare, MonitorUp, Wallet } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Utils } from '../../../utils'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import BaseButton from '../../../components/ui/buttons/base-button'
import { TouchableOpacity } from 'react-native'

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
            p={20}
        >
            <TouchableOpacity style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
            }} onPress={goBack} >
                <ArrowLeft />
            </TouchableOpacity>
            <View
                flex={1}
                w="100%"
                h="100%"
                alignItems='center'
                justifyContent='center'
                rowGap={40}
            >
                <H3 w="100%" textAlign='center' color={"$text"}>
                    How would you like to sign in?
                </H3>
                <View
                    rowGap={20}
                    w="100%"
                >
                    <BaseButton borderRadius={100} onPress={goToKadeConnect} iconAfter={<MonitorUp />} >
                        Sign in with Kade Connect
                    </BaseButton>
                    <BaseButton borderRadius={100} onPress={goToSeedPhrase} iconAfter={<KeySquare />} >
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