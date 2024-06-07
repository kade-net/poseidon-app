import { View, Text, YStack, ScrollView, H3, H4, Select, Adapt, Sheet } from 'tamagui'
import React, { useEffect } from 'react'
import { Check, ChevronDown } from '@tamagui/lucide-icons'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import settings from '../../../lib/settings'

const preferenceSchema = z.object({
    preffered_wallet: z.string().optional()
})

type Preference = z.infer<typeof preferenceSchema>

const Preferences = () => {

    const form = useForm<Preference>({
        resolver: zodResolver(preferenceSchema),
        defaultValues: {
            preffered_wallet: settings.active?.preffered_wallet
        }
    })

    useEffect(() => {
        const subscription = form.watch((value) => {
            console.log("New Value", value)
            if (value.preffered_wallet) {
                settings.updateSettings({
                    preffered_wallet: value.preffered_wallet as any
                })
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [form.watch])

    return (
        <YStack flex={1} w="100%" h="100%" bg='$background' >
            <ScrollView flex={1} w="100%" h="100%" showsVerticalScrollIndicator={false} p={20} >
                <YStack w="100%" >
                    <H3>
                        Portal Preferences
                    </H3>
                    <YStack w="100%" rowGap={5} >
                        <H4>
                            Wallet
                        </H4>
                        <Text>
                            Which wallet would you like to use, when submitting portal transactions?
                        </Text>
                        <Controller
                            control={form.control}
                            name="preffered_wallet"
                            render={({ field }) => {
                                return (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <Select.Trigger iconAfter={<ChevronDown />} >
                                            <Select.Value placeholder="Preffered wallet" />
                                        </Select.Trigger>
                                        <Adapt when="sm" platform='touch' >
                                            <Sheet
                                                native
                                                modal
                                                dismissOnSnapToBottom
                                                snapPoints={[30]}
                                                dismissOnOverlayPress

                                            >
                                                <Sheet.Overlay />
                                                <Sheet.Frame

                                                >
                                                    <Sheet.ScrollView>
                                                        <Adapt.Contents />

                                                    </Sheet.ScrollView>
                                                </Sheet.Frame>
                                            </Sheet>
                                        </Adapt>
                                        <Select.Content>
                                            <Select.Viewport>
                                                <Select.Item index={1} value='petra' >
                                                    <Select.ItemText>
                                                        Petra
                                                    </Select.ItemText>
                                                    <Select.ItemIndicator marginLeft='auto' >
                                                        <Check size={16} />
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                                <Select.Item index={2} value='delegate' >
                                                    <Select.ItemText>
                                                        Delegate
                                                    </Select.ItemText>
                                                    <Select.ItemIndicator marginLeft='auto' >
                                                        <Check size={16} />
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                            </Select.Viewport>
                                        </Select.Content>
                                    </Select>

                                )
                            }}
                        />
                    </YStack>
                </YStack>
            </ScrollView>
        </YStack>
    )
}

export default Preferences