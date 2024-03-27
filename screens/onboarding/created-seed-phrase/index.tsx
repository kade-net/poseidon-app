import { View, Text, Button, TextArea } from 'tamagui'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Copy } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import delegateManager from '../../../lib/delegate-manager'
import { useRouter } from 'expo-router'
import { Utils } from '../../../utils'
import Toast from 'react-native-toast-message'

const CreatedSeedPhrase = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const copySeedPhrase = async () => {
        const mnemonic = delegateManager.mnemonic

        if (mnemonic) {
            try {
                await Clipboard.setStringAsync(mnemonic)
            }
            catch (e) {
                console.log(`SOMETHING WENT WRONG:: ${e}`)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to copy seed phrase'
                })
            }
        }
    }

    const goToNext = async () => {
        router.push('/onboard/profile')
    }

    return (
        <View
            pt={insets.top}
            pb={insets.bottom}
            px={Utils.dynamicWidth(5)}
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
                        <Button icon={<Copy />} onPress={copySeedPhrase} color={"$buttonText"} backgroundColor={"$button"}>
                            Copy
                        </Button>
                    </View>
                </View>
                <View w="100%" >
                    <Button
                        onPress={goToNext}
                        color={"$buttonText"} backgroundColor={"$button"}
                        marginBottom={Utils.dynamicHeight(5)}
                        fontSize={"$sm"}
                    >
                        Continue
                    </Button>
                </View>
            </View>

        </View>
    )
}

export default CreatedSeedPhrase