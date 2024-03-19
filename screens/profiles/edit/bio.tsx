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
import { Button, Spinner, TextArea, XStack, YStack, Text } from 'tamagui'
import { useRouter } from 'expo-router'

const Bio = () => {
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


    return (
        <YStack flex={1} w="100%" h="100%" p={20} justifyContent='space-between' backgroundColor={"$background"}>
            <Controller
                control={form.control}
                name='bio'
                render={({ field }) => {
                    return (
                        <TextArea
                            backgroundColor={"$colorTransparent"}
                            onChangeText={field.onChange}
                            value={field.value}
                            placeholder='Tell people about yourself.'
                        />
                    )
                }} />
            <Button disabled={saving} onPress={form.handleSubmit(handleSubmit)} w="100%" backgroundColor={"$button"} color={"$buttonText"}>
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

export default Bio