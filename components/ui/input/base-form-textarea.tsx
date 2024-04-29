import { View, Text, Input, YStack, XStack, TextArea } from 'tamagui'
import React from 'react'

type I = Parameters<typeof TextArea>[0]

type P = I & {
    label?: string,
    invalid?: boolean,
    error?: string
}

const BaseFormTextArea = (props: P) => {
    const { label, invalid, error, ...rest } = props
    return (
        <YStack w="100%" >
            <YStack bg={'$baseBackround'} borderRadius={5} borderColor={invalid ? '$red10' : '$primary'} borderWidth={1} px={10} py={5} >
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
                <TextArea
                    p={0}
                    borderWidth={0}
                    {...rest}
                />
            </YStack>
            {
                invalid && <Text color={'$red10'} >
                    {error}
                </Text>
            }
        </YStack>
    )
}

export default BaseFormTextArea