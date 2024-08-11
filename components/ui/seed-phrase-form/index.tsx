import { View, Text, KeyboardAvoidingView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, YStack } from 'tamagui'

interface FieldDef {
    name: `${number}`,
    placeholder: string
}

const fields: Array<FieldDef> = [
    {
        name: '1',
        placeholder: '1.'
    },
    {
        name: '2',
        placeholder: '2.'
    },
    {
        name: "3",
        placeholder: '3.'
    },
    {
        name: '4',
        placeholder: '4.'
    },
    {
        name: '5',
        placeholder: '5.'
    },
    {
        name: '6',
        placeholder: '6.'
    },
    {
        name: '7',
        placeholder: '7.'
    },
    {
        name: '8',
        placeholder: '8.'
    },
    {
        name: '9',
        placeholder: '9.'
    },
    {
        name: '10',
        placeholder: '10.'
    },
    {
        name: '11',
        placeholder: '11.'
    },
    {
        name: '12',
        placeholder: '12.'
    }
]

interface Props {
    onChange?: (value: Array<string>) => void
}

const SeedPhraseForm = (props: Props) => {
    const { onChange } = props

    const form = useForm<Record<`${number}`, string>>({
        resolver: zodResolver(
            z.object(Object.fromEntries(fields?.map((field) => [field.name, z.string()])))
        )
    })

    useEffect(() => {
        const subscription = form.watch((values) => {
            const finalValues: Array<string> = fields.map((field) => {
                const phrase = values?.[field.name]
                return phrase ?? ''
            })?.filter(v => v.length > 1)

            onChange?.(finalValues)
        })

        return () => subscription.unsubscribe()
    }, [form.watch])

    return (
        <YStack
            style={{
                flex: 1,
                width: '100%',
                height: '100%'
            }}
        >
            <FlatList
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    columnGap: 10
                }}
                contentContainerStyle={{
                    columnGap: 10,
                    rowGap: 10
                }}
                data={fields}
                numColumns={2}
                renderItem={({ item, index }) => {
                    return (
                        <Controller
                            control={form.control}
                            name={item.name}
                            render={({ field }) => {
                                return (
                                    <Input
                                        flex={1}
                                        backgroundColor={'$colorTransparent'}
                                        borderColor={'$border'}
                                        borderRadius={100}
                                        onChangeText={(text) => {
                                            if (text?.trim()?.includes(" ")) {

                                                const values = text?.trim().split(" ")

                                                values.map((v, vId) => {
                                                    const vName = index + vId + 1

                                                    if (vId == 0) {
                                                        field.onChange(v)
                                                    } else {
                                                        form.setValue(`${vName}`, v)
                                                    }
                                                })
                                            } else {
                                                field.onChange(text)
                                            } // a b c d
                                        }}
                                        value={field.value}
                                        placeholder={item.placeholder}
                                    />
                                )
                            }}
                        />
                    )
                }}
            />
        </YStack>
    )
}

export default SeedPhraseForm