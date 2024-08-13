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
import { z } from 'zod'
import OtpCodeForm from './otp-code-form'
import { convergenceClient } from '../../../data/apollo'
import { SEND_VERIFICATION_EMAIL, VERIFY_EMAIL } from '../../../lib/convergence-client/queries'
import delegateManager from '../../../lib/delegate-manager'
import posti from '../../../lib/posti'

const OtpForm = (props: SceneProps) => {
    const [resendingCode, setResendingCode] = React.useState(false)
    const [sendingCode, setSendingCode] = React.useState(false)
    const [validatingCode, setValidatingCode] = React.useState(false)
    const router = useRouter()

    const goBack = () => {
        router.back()
    }
    const { form } = useVerificationForm()

    const handleVerifyCode = async (values: P) => {
        Haptics.selectionAsync()
        setValidatingCode(true)
        try {

            await convergenceClient.mutate({
                mutation: VERIFY_EMAIL,
                variables: {
                    input: {
                        email: values.email,
                        code: values.code,
                        sender_address: delegateManager.owner || delegateManager?.account?.address().toString()
                    }
                }
            })

            Burnt.toast({
                preset: 'done',
                title: 'Email Verified',
                message: 'You can now proceed',
            })

            router.push('/onboard/username')
        }
        catch (e) {
            posti.capture('otp-form-verify-code', {
                error: e,
                values
            })
            Burnt.toast({
                preset: 'error',
                title: 'Code Invalid',
                message: 'Please try again',
                haptic: 'error'
            })
        }
        finally {
            setValidatingCode(false)
        }

    }

    const handleResendCode = async () => {
        Haptics.selectionAsync()
        setResendingCode(true)
        const email = form.getValues('email')

        try {
            await convergenceClient.mutate({
                mutation: SEND_VERIFICATION_EMAIL,
                variables: {
                    input: {
                        email: email,
                        sender_address: delegateManager.owner || delegateManager?.account?.address().toString()
                    }
                }
            })

            Burnt.toast({
                preset: 'done',
                title: 'Code Sent',
                message: 'Check your email for the verification code',
            })
        }
        catch (e) {
            Burnt.toast({
                preset: 'error',
                title: 'Unable to resend code',
                message: 'Please try again later',
                haptic: 'error'
            })
        }
        finally {
            setResendingCode(false)
        }
    }
    return (
        <YStack flex={1} w="100%" h="100%" p={20} bg="$background" >
            <TouchableOpacity style={{ width: '100%' }} onPress={() => props.jumpTo('email')} >
                <XStack w="100%" columnGap={10} alignItems='center' >
                    <ArrowLeft size={16} />
                    <Text>
                        Change Email
                    </Text>
                </XStack>
            </TouchableOpacity>
            <YStack flex={1} w="100%" alignItems='center' justifyContent='center' rowGap={20} >
                <H3>
                    Enter Verification Code
                </H3>
                <Controller
                    control={form.control}
                    name='code'
                    render={({ field, fieldState }) => {
                        return (
                            <XStack >
                                <OtpCodeForm
                                    onChangeText={field.onChange}
                                />
                            </XStack>
                        )
                    }}
                />

                <BaseButton loading={resendingCode} onPress={handleResendCode} type='text' rounded='full' >
                    Resend Code
                </BaseButton>

            </YStack>
            <XStack w="100%" alignItems='center' >
                <Controller
                    control={form.control}
                    name='code'
                    render={({ field, fieldState }) => {
                        const invalid = (field.value?.length ?? 0) !== 6
                        return (
                            <BaseButton
                                disabled={invalid}
                                onPress={form.handleSubmit(handleVerifyCode)}

                                w="100%"
                                type={
                                    (invalid) ? 'outlined' : 'primary'
                                }
                                rounded='full'
                                loading={validatingCode}
                            >
                                Verify
                            </BaseButton>
                        )
                    }}
                />
            </XStack>
        </YStack>
    )
}

export default OtpForm