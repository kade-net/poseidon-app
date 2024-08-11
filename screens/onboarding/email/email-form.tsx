import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SceneProps } from '../../profiles/tabs/common'
import { H3, Input, Text, XStack, YStack } from 'tamagui'
import { ArrowLeft, Mail } from '@tamagui/lucide-icons'
import { Controller } from 'react-hook-form'
import BaseButton from '../../../components/ui/buttons/base-button'
import { P, useVerificationForm } from './context'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import * as Burnt from 'burnt'
import { Clerk } from '@clerk/clerk-js'
import { z } from 'zod'
import { convergenceClient } from '../../../data/apollo'
import { SEND_VERIFICATION_EMAIL } from '../../../lib/convergence-client/queries'
import delegateManager from '../../../lib/delegate-manager'
import posti from '../../../lib/posti'

const EmailForm = (props: SceneProps) => {
    const [sendingCode, setSendingCode] = React.useState(false)
    const router = useRouter()
    const { form, goBack } = useVerificationForm()

    const handleSendCode = async (values: P) => {
        setSendingCode(true)
        Haptics.selectionAsync()
        try {

            await convergenceClient.mutate({
                mutation: SEND_VERIFICATION_EMAIL,
                variables: {
                    input: {
                        email: values.email,
                        sender_address: delegateManager.owner || delegateManager?.account?.address().toString()
                    }
                }
            })


            props.jumpTo('code')

            Burnt.toast({
                preset: 'done',
                title: 'Code Sent',
                message: 'Check your email for the verification code',
                haptic: 'success'
            })

        }
        catch (e) {
            posti.capture('email-form-send-code', {
                error: e,
                values
            })
            console.log("Error::", e)
            Burnt.toast({
                preset: 'error',
                title: 'Unable to send code',
                message: 'Please try again later',
                haptic: 'error'
            })
        }
        finally {
            setSendingCode(false)
        }

    }

    return (
        <YStack flex={1} w="100%" h="100%" p={20} bg="$background" >
            <XStack w="100%" >
                <TouchableOpacity onPress={goBack} style={{ width: '100%' }} >
                    <ArrowLeft />
                </TouchableOpacity>
            </XStack>
            <YStack flex={1} w="100%" alignItems='center' justifyContent='center' px={20} rowGap={10} >
                <H3>
                    Enter your email
                </H3>
                <Controller
                    control={form.control}
                    name='email'
                    render={({ field, fieldState }) => {
                        return (
                            <Input
                                autoCapitalize='none'
                                textContentType='emailAddress'
                                backgroundColor={'$colorTransparent'}
                                borderRadius={100}
                                // fontSize={20}
                                placeholder='email@email.com'
                                w="100%"
                                textAlign='center'
                                autoFocus
                                onChangeText={field.onChange}
                                value={field.value}
                            />
                        )
                    }}
                />
                <Text color={'$sideText'} >
                    We will send you an OTP
                </Text>

            </YStack>
            <XStack w="100%" alignItems='center' >

                <Controller
                    control={form.control}
                    name='email'
                    render={({ field, fieldState }) => {
                        const invalid = (field.value?.length ?? 0) < 3 || !z.string().email().safeParse(field.value).success
                        return (
                            <BaseButton
                                disabled={invalid}
                                onPress={form.handleSubmit(handleSendCode)}
                                loading={sendingCode}
                                w="100%"
                                type={
                                    (invalid) ? 'outlined' : 'primary'
                                }
                                rounded='full'
                            >
                                Continue
                            </BaseButton>
                        )
                    }}
                />
            </XStack>
        </YStack>
    )
}

export default EmailForm