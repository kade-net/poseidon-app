import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Button, Input, Spinner, TextArea, XStack, YStack, Text } from 'tamagui'
import CommunitiesEditTopBar from './top-bar'
import client from '../../../../data/apollo'
import { COMMUNITY_QUERY } from '../../../../utils/queries'
import { Controller, useForm } from 'react-hook-form'
import { UpdateCommunitySchema, updateSchema } from '../../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import communityModule from '../../../../contract/modules/community'

const Description = () => {
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
        setSaving(true)
        try {
            await communityModule.updateCommunity(values)
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
        <YStack flex={1} w="100%" h="100%" p={20} justifyContent='space-between' >
            <Controller
                control={form.control}
                name='description'
                render={({ field }) => {
                    return (
                        <TextArea
                            onChangeText={field.onChange}
                            value={field.value}
                            placeholder='Tell people why they should join your community.'
                        />
                    )
                }} />
            <Button disabled={saving} onPress={form.handleSubmit(handleSubmit)} w="100%" >
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

export default Description