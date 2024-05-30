import { View, Text, YStack, Spinner, Avatar, Button, XStack } from 'tamagui'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TouchableOpacity } from 'react-native'
import { Plus } from '@tamagui/lucide-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import client from '../../../../data/apollo'
import { COMMUNITY_QUERY } from '../../../../utils/queries'
import { UpdateCommunitySchema, updateSchema } from '../../../../schema'
import communityModule from '../../../../contract/modules/community'
import * as ImagePicker from 'expo-image-picker'
import uploadManager from '../../../../lib/upload-manager'
import BaseButton from '../../../../components/ui/buttons/base-button'

const schema = z.object({
    image: z.string()
})

type TSchema = z.infer<typeof schema>

const CommunityImageEdit = () => {
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
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

    const addImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (result.canceled) {
            return
        }

        const image = result.assets.at(0)

        if (image) {
            setUploading(true)
            try {
                const upload = await uploadManager.uploadFile(image.uri, {
                    type: image.type,
                    name: image.fileName ?? "community-image",
                    size: image.fileSize
                })

                form.setValue('image', upload)

            }
            catch (e) {
                console.log("Something went wrong::", e)
            }
            finally {
                setUploading(false)
            }
        }
    }

    return (
        <YStack flex={1} w="100%" h="100%" p={20} justifyContent='space-between' backgroundColor={'$background'} >
            <YStack flex={1} w="100%" alignItems='center' rowGap={20} >

                <Controller
                    control={form.control}
                    name="image"
                    render={({ field: { value } }) => {
                        return (
                            <YStack alignItems='center' rowGap={10} >


                                    <Avatar
                                        size={"$10"}
                                        circular
                                    >
                                        <Avatar.Image source={{ uri: value }} />
                                        <Avatar.Fallback
                                            bg="lightgray"

                                        />
                                </Avatar>

                                <BaseButton onPress={addImage} type='outlined' >
                                    <Text>
                                        Change Image
                                    </Text>
                                </BaseButton>
                            </YStack>
                        )
                    }}
                />
                {
                    uploading && <XStack columnGap={10} >
                        <Spinner />
                        <Text>Uploading...</Text>
                    </XStack>
                }
            </YStack>

            <BaseButton w="100%" onPress={form.handleSubmit(handleSubmit)} loading={saving} >
                <Text>
                    Save Changes
                </Text>
            </BaseButton>
        </YStack>
    )
}

export default CommunityImageEdit