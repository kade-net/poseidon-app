import { View, Text, XStack, YStack, Spinner, Separator } from 'tamagui'
import React, { useState } from 'react'
import { useFocusEffect } from 'expo-router'
import * as Updates from 'expo-updates'
import posti from '../../../../lib/posti'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'
import { TouchableOpacity } from 'react-native'
import { LayoutGrid } from '@tamagui/lucide-icons'

const PullDownButton = () => {
    const [loading, setLoading] = useState(false)
    const [updatesReady, setUpdatesReady] = useState(false)

    useFocusEffect(() => {
        (async () => {
            try {
                const update = await Updates.checkForUpdateAsync();

                if (update.isAvailable) {
                    setUpdatesReady(true)
                } else {
                    setUpdatesReady(false)
                }
            }
            catch (e) {
                posti.capture('error fetching update', {
                    error: e ?? 'Unable to trigger update fetch',
                })
            }
        })();
    })

    const fetchUpdatate = async () => {
        Haptics.selectionAsync()
        setLoading(true)
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error fetching update',
                text2: 'Unable to trigger update fetch',
            })
            posti.capture('error fetching update', {
                error: e ?? 'Unable to trigger update fetch',
            })
        }
        finally {
            setLoading(false)
        }
    }

    if (updatesReady) {
        return (
            <TouchableOpacity disabled={loading} onPress={fetchUpdatate}  >
                <YStack w="100%" >
                    <XStack
                        w="100%"
                        alignItems='center'
                        justifyContent='center'
                        p={5}
                        columnGap={20}
                    >
                        {loading ? <Spinner /> : <>
                            <LayoutGrid size={'$1'} color={'$primary'} />
                            <Text
                                color={'$primary'}
                            >
                                New update available, press to update
                            </Text>
                        </>}
                    </XStack>
                    <Separator />
                </YStack>
            </TouchableOpacity>
        )
    }

    return (
        <XStack
            w="100%"
            alignItems='center'
            justifyContent='center'

        >
            <Text>
                Pull down to refresh
            </Text>
        </XStack>
    )
}

export default PullDownButton