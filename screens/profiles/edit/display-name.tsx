import React from 'react'
import client from '../../../data/apollo'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Controller, useForm } from 'react-hook-form'
import { TPROFILE, profileSchema } from '../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { values } from 'lodash'
import account from '../../../contract/modules/account'
import { Button, Input, Spinner, TextArea, XStack, YStack, Text } from 'tamagui'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import BaseButton from '../../../components/ui/buttons/base-button'
import * as Haptic from 'expo-haptics'
import BaseFormInput from '../../../components/ui/input/base-form-input'

const DisplayName = () => {
    const [saving, setSaving] = React.useState(false)
    const profile = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })

    const router = useRouter()
    const form = useForm<TPROFILE>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            display_name: profile?.data?.account?.profile?.display_name ?? undefined
        }
    })

    const handleSubmit = async (values: TPROFILE) => {
        await Haptic.selectionAsync()
        if (values.display_name === profile?.data?.account?.profile?.display_name) {
            router.back()
            return
        }

        setSaving(true)

        try {
            await account.updateProfile({
                ...values,
                bio: profile?.data?.account?.profile?.bio ?? undefined,
                pfp: profile?.data?.account?.profile?.pfp ?? undefined
            })
            router.back()
        }
        catch (e) {
            setSaving(false)
            console.log(`Something went wrong: ${e}`)
        }
        finally {
            setSaving(false)
        }
    }

    const handleError = async (error: any) => {
        console.log("Parse Errors::", error)
        await Haptic.notificationAsync(Haptic.NotificationFeedbackType.Error)
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Your display name cannot be empty.'
        })
    }


    return (
        <YStack flex={1} w="100%" h="100%" p={20} justifyContent='space-between'  backgroundColor={"$background"}>
            <Controller
                control={form.control}
                name='display_name'
                render={({ field, formState, fieldState }) => {
                    return (
                        <BaseFormInput
                            label='Display Name'
                            value={field.value}
                            onChangeText={field.onChange}
                            placeholder='Display name'
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            maxLength={50}
                        />
                        // <YStack>
                        //     <Input
                        //         backgroundColor={"$colorTransparent"}
                        //         onChangeText={field.onChange}
                        //         value={field.value}
                        //         placeholder='Display name'
                        //     />
                        //     {
                        //         fieldState.invalid && <Text color={"red"} fontSize={'$xxs'} >Display name cannot be empty.</Text>
                        //     }
                        // </YStack>
                    )
                }} />
            <BaseButton
                disabled={saving}
                onPress={form.handleSubmit(handleSubmit, handleError)}
                loading={saving}
            >
                <Text>Save Changes</Text>
            </BaseButton>
        </YStack>
    )
}

export default DisplayName