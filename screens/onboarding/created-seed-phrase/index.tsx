import { View, Text, Button, TextArea } from 'tamagui'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Copy } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import delegateManager from '../../../lib/delegate-manager'
import { useRouter } from 'expo-router'

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
            flex={1}
            w="100%"
        >
            <View
                flex={1}
                w={'100%'}
                justifyContent='space-between'
            >
                <View w="100%" rowGap={20} >
                    <View w="100%" rowGap={10} >
                        <TextArea
                            placeholder='Your seed phrase should be here...'
                            value={delegateManager.mnemonic ?? ""}
                            disabled
                        />
                        <Text>
                            Please write down your seed phrase and keep it safe. You will need it to recover your account.
                        </Text>
                    </View>
                    <View w="100%" alignItems='flex-end' >
                        <Button icon={<Copy />} onPress={copySeedPhrase} >
                            Copy
                        </Button>
                    </View>
                </View>
                <View w="100%" >
                    <Button
                        onPress={goToNext}
                    >
                        Continue
                    </Button>
                </View>
            </View>

        </View>
    )
}

export default CreatedSeedPhrase