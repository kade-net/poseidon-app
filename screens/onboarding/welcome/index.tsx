import { Link, router, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, View } from 'tamagui'
import petra from '../../../lib/wallets/petra'
import delegateManager from '../../../lib/delegate-manager'
import { User } from '@tamagui/lucide-icons'
import account from '../../../contract/modules/account'


const WelcomeScreen = () => {
    const insets = useSafeAreaInsets()
    const rounter = useRouter()

    useEffect(() => {
        const nextScreen =
            account.isProfileRegistered ? '/(tabs)/feed/home' :
                account.isAccountRegistered ? '/onboard/profile' :
                    delegateManager.isDeligateRegistered ? '/onboard/profile' :
                        undefined

        if (nextScreen) {
            router.push(nextScreen)
        }

    }, [])

    const goToCreateAccount = () => {
        router.push('/onboard/username')
    }

    const goToSignIn = () => {
        router.push('/onboard/signin')
    }
    return (
        <View w="100%" pb={insets.bottom} alignItems='center' justifyContent='space-between' flex={1} px={20} >
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
                    Sign In
                </Button>
                <Button w="100%" onPress={goToCreateAccount}  >
                    Create Account
                </Button>

            </View>

        </View >
    )
}

export default WelcomeScreen
