import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Button, Input, Spinner, Text, XStack, YStack } from 'tamagui'
import CommunitiesEditTopBar from './top-bar'
import { Controller, useForm } from 'react-hook-form'
import { UpdateCommunitySchema, updateSchema } from '../../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import client from '../../../../data/apollo'
import { COMMUNITY_QUERY } from '../../../../utils/queries'
import communityModule from '../../../../contract/modules/community'
import BaseFormInput from '../../../../components/ui/input/base-form-input'
import BaseButton from '../../../../components/ui/buttons/base-button'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'



const DisplayName = () => {
    const [saving, setSaving] = useState(false)
    const params = useLocalSearchParams()
    const communityName = params?.['name'] as string
    const community = client.readQuery({
        query: COMMUNITY_QUERY,
        variables: {
            name: communityName
        }
    })

    const router = useRouter()
    const form = useForm<UpdateCommunitySchema>({
        resolver: zodResolver(updateSchema),
        defaultValues: community?.community ? {
            display_name: community?.community?.display_name ?? communityName,
            community: communityName,
            description: community?.community?.description,
            image: community?.community?.image
        } : {
            display_name: communityName,
            community: communityName
        }
    })

    const handleSubmit = async (values: UpdateCommunitySchema) => {
        Haptics.selectionAsync()
        setSaving(true)
        try {
            await communityModule.updateCommunity(values)
            router.back()
        }
        catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Toast.show({
                type: 'error',
                text1: 'Something went wrong'
            })
            console.log(`Something went wrong: ${e}`)
        }
        finally {
            setSaving(false)
        }
    }


    return (
        <YStack flex={1} w="100%" h="100%" p={20} justifyContent='space-between' backgroundColor={'$background'} >
            <Controller
                control={form.control}
                name='display_name'
                render={({ field }) => {
                    return (
                        <BaseFormInput
                            maxLength={20}
                            onChangeText={field.onChange}
                            value={field.value}
                            placeholder='Display Name'
                        />
                    )
                }}
            />
            <BaseButton loading={saving} w="100%" onPress={form.handleSubmit(handleSubmit)} >
                <Text>
                    Save Changes
                </Text>
            </BaseButton>
        </YStack>
    )
}

export default DisplayName