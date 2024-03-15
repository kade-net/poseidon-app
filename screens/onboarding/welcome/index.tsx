import { Link, router, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, SizableText, View } from 'tamagui'
import petra from '../../../lib/wallets/petra'
import delegateManager from '../../../lib/delegate-manager'
import { User } from '@tamagui/lucide-icons'
import { Text } from 'tamagui'
import account from '../../../contract/modules/account'
import { Utils } from '../../../utils'


const WelcomeScreen = () => {
    const insets = useSafeAreaInsets()
    const rounter = useRouter()
    const goToCreateAccount = () => {
        router.push('/onboard/username')
    }

    const goToSignIn = () => {
        router.push('/onboard/signin')
    }
    return (
        <View w="100%" backgroundColor={"$background"} alignItems='center' justifyContent='space-between' flex={1} px={Utils.dynamicWidth(5)} pb={Utils.dynamicHeight(3)}>
            <View h="80%" w="100%" alignItems='center' justifyContent='center' >
                <View w="$1" h="$1" bg="$red10" transform={[
                    {
                        translateY: 50
                    }
                ]} >

                </View>
            </View>

            <View w="100%" rowGap={20}  >
                <Button icon={<User />} w="100%" variant='outlined' onPress={goToSignIn}  >
                    <SizableText>Sign In</SizableText>
                </Button>
                <Button w="100%" onPress={goToCreateAccount} backgroundColor={"$button"}>
                    <SizableText color={"$buttonText"} >Create Account</SizableText>
                </Button>

            </View>

        </View >
        // <SizableText>Hello</SizableText>

    )
}

export default WelcomeScreen
