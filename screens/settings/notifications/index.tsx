import { View, Text, YStack, H3, Switch, XStack, Spinner } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { Heading3 } from '@tamagui/lucide-icons'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import notifications from '../../../lib/notifications'

interface Props {
    status: boolean
}

const schema = z.object({
    enabled: z.boolean()
})

type Schema = z.infer<typeof schema>

const Notifications = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const { status } = props
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            enabled: status
        }
    })

    useEffect(() => {
        const subscription = form.watch(async (values) => {
            console.log(`Values::`, values)
            if (values.enabled == status) return
            try {
                if (values.enabled) {
                    await notifications.enableNotifications()
                } else {
                    await notifications.disableNotifications()
                }
            }
            catch (e) {
                form.setValue('enabled', status)
                console.log(`SOmething went wrong::`, e)
            }
            finally {
                setLoading(false)
            }
        })

        return subscription.unsubscribe
    }, [form.watch])


    return (
        <YStack flex={1} p={20} backgroundColor={'$background'} >
            <YStack>
                <H3>Enable Notifications</H3>
                <Text mb={10} >Receive notifications for new posts, comments, and more</Text>
                <XStack w="100%" justifyContent='space-between' alignItems='center' >
                    <Controller
                        control={form.control}
                        name='enabled'
                        render={({ field }) => {
                            return (
                                <Switch
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={(value) => field.onChange(value)}

                                >
                                    <Switch.Thumb backgroundColor={'$button'} />
                                </Switch>
                            )
                        }}
                    />
                    {
                        loading ? <Spinner /> : null
                    }
                </XStack>
            </YStack>
        </YStack>
    )
}

export default Notifications