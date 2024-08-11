import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { SceneRendererProps } from 'react-native-tab-view'
import { H4, Input, XStack, YStack } from 'tamagui'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import BaseButton from '../../../components/ui/buttons/base-button'
import { useProfileForm } from './contex'

interface Props {
    scene: SceneRendererProps
}

const DisplayName = (props: Props) => {
    const { scene } = props
    const { form } = useProfileForm()

    return (
        <KeyboardAvoidingView
            style={{
                width: '100%',
                height: '100%',
                flex: 1
            }}
            behavior={Platform.select({
                ios: 'padding',
                android: 'height'
            })}
            keyboardVerticalOffset={Platform.select({
                ios: 70,
                android: 0
            })}
            contentContainerStyle={{
                padding: 20
            }}
        >
            <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' rowGap={20} px={20} >
                <H4>
                    Have a Display Name?
                </H4>
                <Controller
                    control={form.control}
                    name="display_name"
                    render={({ field }) => {
                        return (
                            <Input
                                autoFocus
                                w="100%"
                                autoCapitalize='none'
                                placeholder='Display Name'
                                onChangeText={field.onChange}
                                value={field.value}
                                maxLength={20}
                                borderRadius={100}
                                textAlign='center'
                                backgroundColor={'$colorTransparent'}
                                borderColor={'$border'}
                            />
                        )
                    }}
                />
            </YStack>
            <XStack px={20} w="100%" alignItems='center' >
                <BaseButton onPress={() => {
                    scene.jumpTo('image')
                }} w="100%" borderRadius={100} >
                    <Text>
                        Continue
                    </Text>
                </BaseButton>
            </XStack>
        </KeyboardAvoidingView>
    )
}

export default DisplayName