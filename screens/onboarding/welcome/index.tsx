import { Link, router, useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Image, SizableText, View } from 'tamagui'
import petra from '../../../lib/wallets/petra'
import delegateManager from '../../../lib/delegate-manager'
import { User } from '@tamagui/lucide-icons'
import { Text } from 'tamagui'
import account from '../../../contract/modules/account'
import { Utils } from '../../../utils'
import { BackHandler } from 'react-native'


const WelcomeScreen = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    // back handler
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {

                return true
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => {
                subscription.remove()
            }
        }, [])
    )

    const goToCreateAccount = () => {
        router.replace('/onboard/username')
    }

    const goToSignIn = () => {
        router.replace('/onboard/signin')
    }
    return (
        <View w="100%" backgroundColor={"$background"} alignItems='center' justifyContent='space-between' flex={1} px={Utils.dynamicWidth(5)} pb={insets.bottom}>
            <View h="80%" w="100%" alignItems='center' justifyContent='center' >
                <View
                    h={80}
                    w={80}
                >
                    <Image
                        source={require('../../../assets/images/adaptive-icon.png')}
                        width={80}
                        height={80}
                    />
                </View>
            </View>

            <View w="100%" rowGap={20}  >
                <Button icon={<User size={20}/>} w="100%" variant='outlined' onPress={goToSignIn}  >
                    <SizableText fontSize={"$sm"}>Sign In</SizableText>
                </Button>
                <Button w="100%" onPress={goToCreateAccount} backgroundColor={"$button"} marginBottom={Utils.dynamicHeight(5)}>
                    <SizableText fontSize={"$sm"} color={"$buttonText"} >Create Account</SizableText>
                </Button>

            </View>

        </View >
        // <SizableText>Hello</SizableText>

    )
}

export default WelcomeScreen
