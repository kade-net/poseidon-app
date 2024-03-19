import { View, Text, XStack, Button, Input } from 'tamagui'
import React from 'react'
import { TextArea, YStack } from 'tamagui'
import delegateManager from '../../../lib/delegate-manager'
import { Copy } from '@tamagui/lucide-icons'
import * as clipboard from 'expo-clipboard'

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
        <YStack p={20} rowGap={20} >

            <YStack>
                <Text>
                    Account Address
                </Text>
                <TextArea
                    multiline
                    disabled
                    value={delegateManager.owner ?? ""}

                />
                <XStack justifyContent='flex-end' >
                    <Button onPress={() => handleSelect('account-address')} icon={<Copy />} >
                        Copy
                    </Button>
                </XStack>
            </YStack>
            <YStack>
                <Text>
                    Delegate Address
                </Text>
                <TextArea
                    multiline
                    disabled
                    value={delegateManager.account?.address().toString() ?? ""}

                />
                <XStack justifyContent='flex-end' >
                    <Button onPress={() => handleSelect('delegate-address')} icon={<Copy />} >
                        Copy
                    </Button>
                </XStack>
            </YStack>
            <YStack>
                <Text>
                    Delegate Private Key
                </Text>
                <Input
                    multiline
                    disabled
                    value={delegateManager.private_key ?? ""}
                    textContentType='password'
                />
                <XStack justifyContent='flex-end' >
                    <Button onPress={() => handleSelect('delegate-private-key')} icon={<Copy />} >
                        Copy
                    </Button>
                </XStack>
            </YStack>

            <YStack>
                <Text>
                    Recovery Phrase
                </Text>
                <TextArea
                    multiline
                    disabled
                    value={delegateManager.mnemonic ?? ""}

                />
                <XStack justifyContent='flex-end' >
                    <Button onPress={() => handleSelect('delegate-seed-phrase')} icon={<Copy />} >
                        Copy
                    </Button>
                </XStack>
            </YStack>

        </YStack>
    )
}

export default RecoveryPhrase