import { View } from 'react-native'
import React from 'react'
import { H3, Text, useTheme, YStack } from 'tamagui'
import NotificationIcon from '../../assets/svgs/notification-icon'
import BaseButton from '../../components/ui/buttons/base-button'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import * as Burnt from 'burnt'
import posti from '../../lib/posti'
import notifications from '../../lib/notifications'

const Notification = () => {
    const [loading, setLoading] = React.useState(false)
    const theme = useTheme()
    const router = useRouter()
    const goToNext = () => {
        router.replace('/(tabs)/feed/home')
    }


    const handleAddToken = async () => {
        Haptics.selectionAsync()
        setLoading(true)
        try {
            await notifications.enableNotifications()
            goToNext()
        }
        catch (e) {
            Burnt.toast({
                title: 'Uh oh',
                message: `Something went wrong, let's skip this for now`,
                preset: 'error'
            })

            console.log(`SOMETHING WENT WRONG:: ${e}`)
            posti.capture('add-token-error', {
                error: e
            })
            goToNext()
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <YStack flex={1} w="100%" h="100%" bg="$background" p={20} alignItems='center' >
            <YStack alignItems='center' justifyContent='center' flex={1} w="100%" rowGap={20} >
                <NotificationIcon size={56} color={theme.primary.val} />
                <H3>
                    Turn on notifications
                </H3>
                <Text>
                    Stay in the loop 😎
                </Text>
            </YStack>
            <YStack w="100%" rowGap={5} >
                <BaseButton onPress={goToNext} type='text' rounded='full' >
                    Not now
                </BaseButton>
                <BaseButton loading={loading} onPress={handleAddToken} rounded='full' >
                    Turn on notifications
                </BaseButton>
            </YStack>
        </YStack>
    )
}

export default Notification