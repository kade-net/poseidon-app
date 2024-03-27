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
            bio: profile?.data?.account?.profile?.bio ?? '',
            display_name: profile?.data?.account?.profile?.display_name ?? '',
            pfp: profile?.data?.account?.profile?.pfp ?? ''
        }
    })

    const handleSubmit = async (values: TPROFILE) => {

        if (values.display_name === profile?.data?.account?.profile?.display_name) {
            router.back()
            return
        }

        setSaving(true)

        try {
            await account.updateProfile(values)
            router.back()
        }
        catch (e) {
            console.log(`Something went wrong: ${e}`)
        }
        finally {
            setSaving(false)
        }
    }

    const handleError = async () => {
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
                        <YStack>
                            <Input
                                backgroundColor={"$colorTransparent"}
                                onChangeText={field.onChange}
                                value={field.value}
                                placeholder='Display name'
                            />
                            {
                                fieldState.invalid && <Text color={"red"} fontSize={'$xxs'} >Display name cannot be empty.</Text>
                            }
                        </YStack>
                    )
                }} />
            <Button disabled={saving} onPress={form.handleSubmit(handleSubmit, handleError)} w="100%" backgroundColor={"$button"} color={"$buttonText"}>
                {
                    saving ? <XStack columnGap={10} >
                        <Spinner />
                        <Text>Saving...</Text>
                    </XStack> : 'Save changes'
                }
            </Button>
        </YStack>
    )
}

export default DisplayName