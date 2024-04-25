import { View, Text, XStack, Button, Input, ScrollView, YStack, TextArea } from 'tamagui'
import React from 'react'
import { TextInput } from 'react-native'
import delegateManager from '../../../lib/delegate-manager'
import { Copy } from '@tamagui/lucide-icons'
import * as clipboard from 'expo-clipboard'
import { Utils } from '../../../utils'
import * as Haptics from 'expo-haptics'

const RecoveryPhrase = () => {

    const handleSelect = async (type: 'account-address' | 'delegate-address' | 'delegate-private-key' | 'delegate-seed-phrase') => {
        Haptics.selectionAsync()
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
        <ScrollView flex={1} w="100%" h="100%" backgroundColor={"$background"} showsVerticalScrollIndicator={false}>
            <YStack flex={1} w="100%" h="100%" p={20} rowGap={20} >

                <YStack>
                    <Text color={"$text"} fontSize={"$md"}>
                        Account Address
                    </Text>
                    <TextArea
                        fontWeight={"$2"}
                        fontSize={"$sm"}
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
                        fontSize={"$sm"}
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
                        fontSize={"$sm"}
                        backgroundColor={"$colorTransparent"}
                        my={Utils.dynamicHeight(1)}
                        disabled
                        value={delegateManager.private_key ?? ""}
                        secureTextEntry
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
                    <Input
                        fontWeight={"$2"}
                        fontSize={"$sm"}
                        backgroundColor={"$colorTransparent"}
                        my={Utils.dynamicHeight(1)}
                        disabled
                        value={delegateManager.mnemonic ?? ""}
                        secureTextEntry

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