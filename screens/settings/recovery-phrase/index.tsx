import { View, Text, XStack, Button, Input, ScrollView } from 'tamagui'
import React from 'react'
import { TextArea, YStack } from 'tamagui'
import delegateManager from '../../../lib/delegate-manager'
import { Copy } from '@tamagui/lucide-icons'
import * as clipboard from 'expo-clipboard'
import { Utils } from '../../../utils'

const RecoveryPhrase = () => {

    const handleSelect = async (type: 'account-address' | 'delegate-address' | 'delegate-private-key' | 'delegate-seed-phrase') => {

        switch (type) {
            case 'account-address':
                await clipboard.setStringAsync(delegateManager.owner!)
                break;
            case 'delegate-address':
                await clipboard.setStringAsync(delegateManager.account?.address().toString() ?? "")
                break;
            case 'delegate-private-key':
                await clipboard.setStringAsync(delegateManager.private_key ?? "")
                break;
            case 'delegate-seed-phrase':
                await clipboard.setStringAsync(delegateManager.mnemonic ?? "")
                break;
            default:
                break;
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <YStack p={20} rowGap={20} backgroundColor={"$background"}>

                <YStack>
                    <Text color={"$text"} fontSize={"$md"}>
                        Account Address
                    </Text>
                    <TextArea
                        fontWeight={"$2"}
                        backgroundColor={"$colorTransparent"}
                        my={Utils.dynamicHeight(1)}
                        multiline
                        disabled
                        value={delegateManager.owner ?? ""}

                    />
                    <XStack justifyContent='flex-end' >
                        <Button onPress={() => handleSelect('account-address')} icon={<Copy />} backgroundColor={"$button"} color={"$buttonText"}>
                            Copy
                        </Button>
                    </XStack>
                </YStack>
                <YStack>
                    <Text color={"$text"} fontSize={"$md"}>
                        Delegate Address
                    </Text>
                    <TextArea
                        fontWeight={"$2"}
                        backgroundColor={"$colorTransparent"}
                        my={Utils.dynamicHeight(1)}
                        multiline
                        disabled
                        value={delegateManager.account?.address().toString() ?? ""}

                    />
                    <XStack justifyContent='flex-end' >
                        <Button onPress={() => handleSelect('delegate-address')} icon={<Copy />} backgroundColor={"$button"} color={"$buttonText"}>
                            Copy
                        </Button>
                    </XStack>
                </YStack>
                <YStack>
                    <Text color={"$text"} fontSize={"$md"}>
                        Delegate Private Key
                    </Text>
                    <Input
                        fontWeight={"$2"}
                        backgroundColor={"$colorTransparent"}
                        my={Utils.dynamicHeight(1)}
                        multiline
                        disabled
                        value={delegateManager.private_key ?? ""}
                        textContentType='password'
                    />
                    <XStack justifyContent='flex-end' >
                        <Button onPress={() => handleSelect('delegate-private-key')} icon={<Copy />} backgroundColor={"$button"} color={"$buttonText"}>
                            Copy
                        </Button>
                    </XStack>
                </YStack>

                <YStack>
                    <Text color={"$text"} fontSize={"$md"}>
                        Recovery Phrase
                    </Text>
                    <TextArea
                        fontWeight={"$2"}
                        backgroundColor={"$colorTransparent"}
                        my={Utils.dynamicHeight(1)}
                        multiline
                        disabled
                        value={delegateManager.mnemonic ?? ""}

                    />
                    <XStack justifyContent='flex-end' >
                        <Button onPress={() => handleSelect('delegate-seed-phrase')} icon={<Copy />} backgroundColor={"$button"} color={"$buttonText"}>
                            Copy
                        </Button>
                    </XStack>
                </YStack>

            </YStack>
        </ScrollView>
    )
}

export default RecoveryPhrase