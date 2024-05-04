import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { memo, useState } from 'react'
import { Button, Input, Spinner, XStack } from 'tamagui'
import { Plus, SendHorizontal } from '@tamagui/lucide-icons'
import BaseButton from '../../../../components/ui/buttons/base-button'
import { Controller, useForm } from 'react-hook-form'
import { TDM, dmSchema } from '../../../../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import hermes from '../../../../contract/modules/hermes'
import Toast from 'react-native-toast-message'

interface Props {
}
const MessageEditor = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const params = useLocalSearchParams()
    const inbox_name = params.inbox_name as string
    const other_user = params.other_user as string

    const form = useForm<TDM>({
        resolver: zodResolver(dmSchema)
    })

    const content = form.watch('content')
    const IS_EMPTY = content ? content.trim().length === 0 : true

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
            <TouchableOpacity
                style={[
                    Platform.select({
                        android: {
                            padding: 10,

                        },
                        ios: {
                            padding: 10
                        }
                    }),
                    {
                        borderRadius: 20,
                    }
                ]}
                disabled
            >
                <Plus
                    color={'$sideText'}
                    size={'$1'}
                />
            </TouchableOpacity>
            <Controller
                control={form.control}
                name='content'
                render={({ field }) => {
                    return (
                        <Input
                            onChangeText={field.onChange}
                            value={field.value}
                            flex={1}
                            py={Platform.select({
                                ios: 10,
                                android: 5
                            })}
                            // size="$3"
                            borderRadius={20}
                            multiline
                            placeholder='Message...'

                        />
                    )
                }}
            />
            <TouchableOpacity
                disabled={IS_EMPTY}
                onPress={form.handleSubmit(handleSend, handleError)}
                style={[
                    Platform.select({
                        android: {
                            padding: 10,
                        },
                        ios: {
                            padding: 10
                        }
                    }),
                    {
                        borderRadius: 20,
                    }
                ]}
            >
                {
                    loading ? <Spinner /> : <SendHorizontal
                        color={IS_EMPTY ? '$sideText' : '$primary'}
                        size={'$1'}
                    />
                }

            </TouchableOpacity>
        </XStack>
    )
}

export default memo(MessageEditor)