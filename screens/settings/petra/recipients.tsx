import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Input, Text, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import RecipientSearchResults from './recipient-search-results'

const schema = z.object({
    addressOrUsername: z.string()
})

type TSCHEMA = z.infer<typeof schema>

const Recipients = () => {
    const form = useForm<TSCHEMA>({
        resolver: zodResolver(schema)
    })

    const SEARCH_TERM = form.watch('addressOrUsername')



    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            backgroundColor={'$background'}
            py={20}
        >
            <XStack columnGap={10} px={20} alignItems='center' >
                <Text
                    fontSize={'$6'}
                >
                    To:
                </Text>
                <Controller
                    control={form.control}
                    name='addressOrUsername'
                    render={({ field }) => {
                        return <Input
                            autoFocus
                            autoCapitalize='none'
                            flex={1} {...field} onChangeText={field.onChange} placeholder='Username or Address' />
                    }}
                />

            </XStack>
            <YStack
                flex={1}
                w="100%"
                h="100%"
            >
                <RecipientSearchResults
                    search={SEARCH_TERM}
                />

            </YStack>
        </YStack>
    )
}

export default Recipients