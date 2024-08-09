import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import { ArrowLeft, Dot } from '@tamagui/lucide-icons'
import { isString } from 'lodash'
import * as Haptics from 'expo-haptics'
import { zodResolver } from '@hookform/resolvers/zod'

const virtualKeyboardSchema = z.object({
    value: z.string()
})

type VKSchema = z.infer<typeof virtualKeyboardSchema>

interface NUMBER_INPUTS {
    label: string | (() => React.ReactNode)
    value: string
    updateValue: (form: UseFormReturn<VKSchema>) => void
}

const NUMBER_INPUTS: NUMBER_INPUTS[] = [
    {
        label: '1',
        value: '1',
        updateValue: (form) => form.setValue('value', form.watch('value') + '1')
    },
    {
        label: '2',
        value: '2',
        updateValue: (form) => form.setValue('value', form.watch('value') + '2')
    },
    {
        label: '3',
        value: '3',
        updateValue: (form) => form.setValue('value', form.watch('value') + '3')
    },
    {
        label: '4',
        value: '4',
        updateValue: (form) => form.setValue('value', form.watch('value') + '4')
    },
    {
        label: '5',
        value: '5',
        updateValue: (form) => form.setValue('value', form.watch('value') + '5')
    },
    {
        label: '6',
        value: '6',
        updateValue: (form) => form.setValue('value', form.watch('value') + '6')
    },
    {
        label: '7',
        value: '7',
        updateValue: (form) => form.setValue('value', form.watch('value') + '7')
    },
    {
        label: '8',
        value: '8',
        updateValue: (form) => form.setValue('value', form.watch('value') + '8')
    },
    {
        label: '9',
        value: '9',
        updateValue: (form) => form.setValue('value', form.watch('value') + '9')
    },
    {
        label: () => <XStack p={10} >
            <Dot />
        </XStack>,
        value: '.',
        updateValue: (form) => {
            const currentValue = form.watch('value')
            if (currentValue.includes('.')) return
            form.setValue('value', currentValue + '.')
        }
    },
    {
        label: '0',
        value: '0',
        updateValue: (form) => {
            const currentValue = form.watch('value')
            if (currentValue === '0') return
            form.setValue('value', currentValue + '0')
        }
    },
    {
        label: () => <XStack p={10} >
            <ArrowLeft />
        </XStack>,
        value: 'DEL',
        updateValue: (form) => {
            const currentValue = form.watch('value')
            if (currentValue.length === 0) return
            form.setValue('value', currentValue.slice(0, -1))
        }
    }
]

interface VirtualKeyboardProps {
    onChange?: (value: string) => void
    inValid?: boolean
}

const VirtualKeyboard = (props: VirtualKeyboardProps) => {
    const { onChange, inValid } = props

    const form = useForm<VKSchema>({
        resolver: zodResolver(virtualKeyboardSchema),
        defaultValues: {
            value: ''
        }
    })

    const CURRENT_VALUE = form.watch('value')

    useEffect(() => {
        const subscription = form.watch((value) => {
            onChange?.(value.value ? value.value : '')
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [form.watch])

    return (
        <YStack w="100%" flex={1} >
            <FlatList
                scrollEnabled={false}
                data={NUMBER_INPUTS}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => {
                                if (inValid && item.value !== 'DEL') {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                                    return
                                }
                                if (inValid && item.value === 'DEL') {
                                    Haptics.selectionAsync()
                                    item?.updateValue(form)
                                    return
                                }
                                if (CURRENT_VALUE?.length < 8 || item.value === 'DEL') {
                                    Haptics.selectionAsync()
                                    item?.updateValue(form)
                                } else {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                                }
                            }}
                        >
                            {
                                isString(item.label) ? <XStack p={10} alignItems='center' justifyContent='center' >
                                    <Text fontSize={32} fontWeight={'600'} >{item.label}</Text>
                                </XStack> : item.label()
                            }
                        </TouchableOpacity>
                    )
                }}
                numColumns={3}
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    gap: 10
                }}
                contentContainerStyle={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}
                keyExtractor={(item) => item.value}
            />
        </YStack>
    )
}

export default VirtualKeyboard