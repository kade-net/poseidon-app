import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Input, XStack } from 'tamagui'
import { Plus, SendHorizontal } from '@tamagui/lucide-icons'
import BaseButton from '../../../../components/ui/buttons/base-button'
import { Controller, useForm } from 'react-hook-form'
import { TDM, dmSchema } from '../../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import hermes from '../../../../contract/modules/hermes'
import Toast from 'react-native-toast-message'

const MessageEditor = () => {
    const [loading, setLoading] = useState(false)
    const params = useLocalSearchParams()
    const inbox_name = params.inbox_name as string
    const other_user = params.other_user as string

    console.log("Inbox Name::", inbox_name)

    const form = useForm<TDM>({
        resolver: zodResolver(dmSchema)
    })

    const handleSend = async (values: TDM) => {
        setLoading(true)
        Haptics.selectionAsync()

        const response = await hermes.send({
            data: values,
            inbox_name,
            to: other_user
        })

        if (response.error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send message'
            })
        }

        if (response.success) {
            console.log("Hash::", response.data)
            form.reset()
        }
        setLoading(false)
    }

    const handleError = async (error: any) => {
        console.log("Error::", error)
    }

    return (
        <XStack w="100%" alignItems='flex-start' justifyContent='center' columnGap={5} px={5} py={5} >
            <BaseButton height={40} circular type="outlined" display='flex' alignItems='center' justifyContent='center' >
                <Plus
                    color={'$primary'}
                />
            </BaseButton>
            <Controller
                control={form.control}
                name='content'
                render={({ field }) => {
                    return (
                        <Input
                            onChangeText={field.onChange}
                            value={field.value}
                            flex={1}
                            // size="$3"
                            minHeight={40}
                            borderRadius={20}
                            multiline
                            placeholder='Message...'

                        />
                    )
                }}
            />
            <BaseButton loading={loading} onPress={form.handleSubmit(handleSend, handleError)} height={40} circular type="primary" display='flex' alignItems='center' justifyContent='center' >
                <SendHorizontal
                    size={'$1'}
                />
            </BaseButton>
        </XStack>
    )
}

export default MessageEditor