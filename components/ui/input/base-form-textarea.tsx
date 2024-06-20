import { View, Text, Input, YStack, XStack, TextArea } from 'tamagui'
import React from 'react'
import { Platform, TextInput } from 'react-native'
import BaseButton from '../buttons/base-button'
import { Check } from '@tamagui/lucide-icons'

type I = Parameters<typeof TextArea>[0]

type P = I & {
    label?: string,
    invalid?: boolean,
    error?: string
}

const BaseFormTextArea = (props: P) => {
    const { label, invalid, error, ...rest } = props
    const [focused, setFocused] = React.useState(false)
    const inputRef = React.useRef<TextInput>(null)

    const handleUnfocus = () => {
        setFocused(false)
        inputRef.current?.blur()
    }

    return (
        <YStack w="100%" >
            <YStack bg={'$inputBackground'} borderRadius={5} borderColor={invalid ? '$red10' : '$primary'} borderWidth={1} px={10} py={5} >
                <XStack w="100%" alignItems='center' justifyContent='space-between' >

                    {
                        label && <Text color={'$blue10'} >
                            {label}
                        </Text>
                    }

                    {
                        rest.maxLength && <Text>
                            {rest.value?.length ?? 0}/{rest.maxLength}
                        </Text>
                    }
                </XStack>
                <YStack w="100%" >
                    <TextArea
                        onFocus={() => setFocused(true)}
                        ref={inputRef}
                        backgroundColor={"$backgroundTransparent"}
                        p={0}
                        borderWidth={0}
                        {...rest}
                    />


                </YStack>
            </YStack>
            {
                invalid && <Text color={'$red10'} >
                    {error}
                </Text>
            }
            {
                Platform.OS === 'ios' && focused && <XStack pt={5} >
                    <BaseButton size={'$2'} borderRadius={20} onPress={handleUnfocus} icon={<Check />} >
                        Done
                    </BaseButton>
                </XStack>
            }
        </YStack>
    )
}

export default BaseFormTextArea