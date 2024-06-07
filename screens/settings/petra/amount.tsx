import React from 'react'
import { Button, H1, Input, Separator, Text, XStack, YStack } from 'tamagui'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from 'react-query'
import { aptos } from '../../../contract'
import delegateManager from '../../../lib/delegate-manager'
import { isNumber } from 'lodash'

const schema = z.object({
    amount: z.string().refine((value) => {
        const IS_NUMBER = !isNaN(parseFloat(value))
        return IS_NUMBER
    }).transform((value) => {
        let v = 0;
        try {
            v = parseFloat(value)
        } catch (e) {
            v = 0
        }
        return v
    })
})


type TSCHEMA = z.infer<typeof schema>

const Amount = () => {
    const router = useRouter()
    const IS_SELF_DELEGATE = delegateManager.owner! == delegateManager.account?.address().toString()
    const balanceQuery = useQuery({
        queryFn: async () => {
            const value = await aptos.getAccountAPTAmount({
                accountAddress: IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!
            })


            if (value && isNumber(value)) {
                return value / 10 ** 8
            }
            return 0
        },
        queryKey: 'wallet-balance',
        refetchInterval: 10000
    })
    const params = useLocalSearchParams()
    const RECIPIENT_ADDRESS = params['recipient'] as string

    const form = useForm<TSCHEMA>({
        resolver: zodResolver(schema)
    })


    const CURRENT_VALUE = form.watch('amount') ?? 0


    const SEND_DISABLED = CURRENT_VALUE == 0 || CURRENT_VALUE < 0 || CURRENT_VALUE > (balanceQuery.data ?? 0) || !RECIPIENT_ADDRESS || CURRENT_VALUE == (balanceQuery.data ?? 0)

    const handleConfirm = () => {
        if (SEND_DISABLED) return
        // @ts-ignore expo route types suck
        router.push(`/settings/wallet/confirm?amount=${CURRENT_VALUE}&recipient=${RECIPIENT_ADDRESS}`)
    }

    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            backgroundColor={'$background'}
        >
            <YStack
                w="100%"
            >

                <YStack
                    alignItems='center'
                    justifyContent='center'
                    p={20}
                >
                    <Controller
                        control={form.control}
                        name="amount"
                        render={({ field }) => {
                            return (
                                <XStack alignItems='center' columnGap={5} >
                                    <Input
                                        borderWidth={0}
                                        backgroundColor={'$background'}
                                        style={{
                                            backgroundColor: 'transparent',
                                        }}
                                        placeholder='0'
                                        fontSize={24}
                                        size={'$8'}
                                        autoFocus
                                        onChangeText={(value) => {
                                            if (value.includes('.')) {
                                                if (value.split('.').length > 2) {
                                                    return
                                                }
                                            }
                                            field.onChange(value)
                                        }}
                                        // @ts-ignore
                                        value={field.value}
                                        keyboardType='number-pad'
                                    />
                                    <H1>
                                        APT
                                    </H1>
                                </XStack>

                            )
                        }}
                    />

                </YStack>
                <XStack w="100%" alignItems='center' justifyContent='center' p={10} >
                    <Text color={'$green10'} >
                        Balance: {balanceQuery.data} APT
                    </Text>
                </XStack>
            </YStack>
            <Separator />
            <YStack
                flex={1}
                w={"100%"}
                alignItems='center'
                justifyContent='flex-end'
                p={20}
            >
                <Button
                    backgroundColor={
                        SEND_DISABLED ? '$background' : '$primary'}
                    w="100%"
                    disabled={
                        SEND_DISABLED
                    }
                    onPress={handleConfirm}

                >
                    Send
                </Button>
            </YStack>
        </YStack>
    )
}

export default Amount