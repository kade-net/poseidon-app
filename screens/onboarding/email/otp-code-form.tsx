import { View, Text, FlatList, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, XStack } from 'tamagui'

const fields = Array.from({ length: 6 }, (_, i) => `${i + 1}`)

interface Props {
    onChangeText?: (value: string) => void
}
const OtpCodeForm = (props: Props) => {
    const { onChangeText } = props
    const form = useForm({
        resolver: zodResolver(
            z.object(Object.fromEntries(
                fields.map(field => [field, z.string()])
            ))
        )
    })

    useEffect(() => {
        const subscription = form.watch((value) => {
            const code = Object.values(value).join('')?.replaceAll('undefined', '')
            onChangeText?.(code?.length > 6 ? code?.slice(0, 6) : code)
        })

        return () => subscription.unsubscribe()
    }, [form.watch])

    return (
        <XStack flex={1} alignItems='center' justifyContent='center' >
            <XStack columnGap={5} >
                {
                    fields.map((item, index) => {
                        return (
                            <Controller
                                key={index}
                                control={form.control}
                                name={item}
                                render={({ field }) => {
                                    return (
                                        <Input
                                            p={Platform.select({
                                                ios: 15,
                                                android: 10
                                            })}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            ref={field.ref}
                                            backgroundColor={'$colorTransparent'}
                                            // maxLength={1}
                                            value={field.value}
                                            onChangeText={(value) => {
                                                if (value?.trim().length > 1 && item !== '6') {

                                                    const split = value?.trim().split('')

                                                    split.forEach((val, index) => {
                                                        if (index > 5) {
                                                            return
                                                        }
                                                        const fieldName = `${index + parseInt(item)}`
                                                        form.setValue(fieldName, val)
                                                    })
                                                }
                                                else {
                                                    if (value?.trim().length > 1) {
                                                        return
                                                    }
                                                    form.setValue(item, value)
                                                    if (item === '6') {
                                                        if (value?.trim().length == 0) {
                                                            form.setFocus(`${parseInt(item) - 1}`, {

                                                            })
                                                        }
                                                        return
                                                    }
                                                    if (value?.trim().length > 0) {
                                                        form.setFocus(`${parseInt(item) + 1}`, {

                                                        })
                                                    } else {
                                                        if (item !== '1') {
                                                            form.setFocus(`${parseInt(item) - 1}`, {

                                                            })
                                                        }
                                                    }

                                                }
                                            }}
                                        />
                                    )
                                }}
                            />
                        )

                    })
                }

            </XStack>
        </XStack>
    )
}

export default OtpCodeForm