import { View, Text, Button, TextArea } from 'tamagui'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Copy, Lock } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import delegateManager from '../../../lib/delegate-manager'
import { useRouter } from 'expo-router'
import { Utils } from '../../../utils'
import Toast from 'react-native-toast-message'
import * as Haptics from 'expo-haptics'
import { BackHandler, NativeEventSubscription } from 'react-native'
import BaseButton from '../../../components/ui/buttons/base-button'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Burnt from 'burnt'

const CreatedSeedPhrase = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const secureAndContinue = async () => {
        await Haptics.selectionAsync()
        const authResult = await LocalAuthentication.authenticateAsync()
        if (authResult.success) {
            goToNext()
        } else {
            Burnt.alert({
                preset: 'error',
                title: 'Biometric authentication required',
                message: 'Secure your account with biometric authentication',
                shouldDismissByTap: true
            })
        }
    }

    const copySeedPhrase = async () => {
        Haptics.selectionAsync()
        const mnemonic = delegateManager.mnemonic

        if (mnemonic) {
            try {
                await Clipboard.setStringAsync(mnemonic)
            }
            catch (e) {
                console.log(`SOMETHING WENT WRONG:: ${e}`)
                Burnt.toast({
                    title: 'Uh oh',
                    message: `Something went wrong, please try again`,
                    preset: 'error'
                })
            }
        }
    }

    const goToNext = async () => {
        router.push('/onboard/profile')
    }

    const preventBackFlow = (): boolean => {
        Burnt.toast({
            title: 'Profile creation',
            message: `Please complete profile creation`,
            preset: 'none'
        })

        return true
    }

    useEffect(() => {

        const subscription: NativeEventSubscription = BackHandler.addEventListener('hardwareBackPress', preventBackFlow)


        return () => {
            
            subscription.remove()
        }

    },[])


    return (
        <View
            p={20}
            flex={1}
            w="100%"
            backgroundColor={"$background"}
        >
            <View
                flex={1}
                w={'100%'}
                justifyContent='space-between'
            >
                <View w="100%" rowGap={20} >
                    <View w="100%" rowGap={10} >
                        <TextArea
                            fontWeight={"$2"}
                            fontSize={"$sm"}
                            placeholder='Your seed phrase should be here...'
                            value={delegateManager.mnemonic ?? ""}
                            disabled
                            backgroundColor={"$colorTransparent"}
                        />
                        <Text color={"$text"} fontFamily={"$body"} fontSize={"$sm"} marginVertical={Utils.dynamicHeight(1)}>
                            Please write down your seed phrase and keep it safe. You will need it to recover your account.
                        </Text>
                    </View>
                    <View w="100%" alignItems='flex-end' >
                        <Button borderRadius={100} icon={<Copy />} onPress={copySeedPhrase} color={"$buttonText"} backgroundColor={"$button"}>
                            Copy
                        </Button>
                    </View>
                </View>
                <View w="100%" >
                    <BaseButton
                        onPress={secureAndContinue}
                        borderRadius={100}
                        icon={<Lock />}
                    >
                        Secure
                    </BaseButton>
                </View>
            </View>

        </View>
    )
}

export default CreatedSeedPhrase