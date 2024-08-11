import { View, Text, Image, Platform } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import AptosIcon from '../../assets/svgs/aptos-icon'
import { Adapt, H3, H5, Select, Sheet, XStack, YStack } from 'tamagui'
import BaseContentSheet from '../../components/ui/action-sheets/base-content-sheet'
import { Check, ChevronDown } from '@tamagui/lucide-icons'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { currencies } from '../../lib/currencies'
import { FullWindowOverlay } from 'react-native-screens'


const currencySchema = z.object({
    currency: z.string(),
})

type CSchema = z.infer<typeof currencySchema>

interface Props {
    onChange?: (value: string) => void
    value?: string
}

const SelectCurrency = (props: Props) => {
    const { onChange, value } = props

    const form = useForm<CSchema>({
        resolver: zodResolver(currencySchema),
        defaultValues: {
            currency: value
        }
    })
    const containerComponent = useMemo(() => (props: any) => (
        Platform.OS === 'ios' ? (
            <FullWindowOverlay>
                <YStack flex={1} pe='box-none' >
                    {props.children}
                </YStack>
            </FullWindowOverlay>
        ) : props.children
    ), [])

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (values?.currency) {
                onChange?.(values.currency)
            }
        })

        return () => subscription.unsubscribe()
    }, [form.watch])

    return (
        <YStack  >
            <Controller
                control={form.control}
                name='currency'
                render={({ field }) => {
                    return (
                        <Select onValueChange={field.onChange} value={field.value} >
                            <Select.Trigger
                                // unstyled
                                size={'$2'}
                                backgroundColor={'$lightButton'}
                                px={10}
                                py={5}
                                borderRadius={8}
                                w={100}
                                style={{
                                    margin: 0,
                                    // height: 10
                                }}
                                iconAfter={<ChevronDown />}
                            >
                                <Select.Value placeholder='Select' />
                            </Select.Trigger>
                            <Adapt>
                                <Sheet
                                    modal
                                    dismissOnSnapToBottom
                                    animationConfig={{
                                        type: 'spring',
                                        damping: 20,
                                        mass: 1.2,
                                        stiffness: 250,
                                    }}
                                    snapPoints={[20]}
                                    dismissOnOverlayPress
                                    containerComponent={containerComponent}
                                >
                                    <Sheet.Frame>
                                        <Sheet.ScrollView py={10} >
                                            <Adapt.Contents />
                                        </Sheet.ScrollView>
                                    </Sheet.Frame>
                                    <Sheet.Overlay
                                        animation="lazy"
                                        enterStyle={{ opacity: 0 }}
                                        exitStyle={{ opacity: 0 }}
                                    />
                                </Sheet>
                            </Adapt>
                            <Select.Content>
                                <Select.Viewport>
                                    {
                                        currencies?.map((currency, i) => {
                                            return (
                                                <Select.Item key={currency.name} value={currency.name} index={i} >
                                                    <XStack alignItems='center' columnGap={5} >
                                                        <currency.icon />
                                                        <Select.ItemText >{currency.name}</Select.ItemText>
                                                    </XStack>
                                                    <Select.ItemIndicator marginLeft='auto' >
                                                        <Check size={16} />
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                            )
                                        })
                                    }
                                </Select.Viewport>
                            </Select.Content>
                        </Select>

                    )
                }}
            />
        </YStack>
    )
}

export default SelectCurrency