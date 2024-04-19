import { View, Text, YStack, XStack, H2, H4, Button, Spinner } from 'tamagui'
import React, { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AptosIcon from '../../../assets/svgs/aptos-icon'
import { Alert, useColorScheme } from 'react-native'
import { ArrowDown } from '@tamagui/lucide-icons'
import RecipientButton from './recipient-button'
import wallet from '../../../lib/wallets/wallet'
import Toast from 'react-native-toast-message'

const Confirm = () => {
    const params = useLocalSearchParams()
    const router = useRouter()
    const RECIPIENT = params['recipient'] as string
    const AMOUNT = params['amount'] as string
    const [loading, setLoading] = useState(false)

    const scheme = useColorScheme()
    const CONVERTED_AMOUNT = useMemo(() => {
        try {
            const amt = parseFloat(AMOUNT)
            if (Number.isNaN(amt)) return 0
            return amt
        }
        catch (e) {
            return 0
        }
    }, [, AMOUNT])


    const handleCancel = () => {
        Alert.alert("Cancel", "Canceling a transaction will abort progress, and return you to the wallet home screen.", [
            {
                text: "Yes, cancel transaction",
                onPress: () => {
                    // TODO: Will look for a better way
                    router.back()
                    router.back()
                    router.back()
                }
            },
            {
                text: "No, stay here",
                onPress: () => {

                }
            }
        ])
    }

    const handleConfirm = async () => {
        setLoading(true)
        try {
            const status = await wallet.sendApt({
                amount: CONVERTED_AMOUNT,
                recipient: RECIPIENT
            })

            if (status.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Transaction commited successfully'
                })

                // TODO: Will look for a better way
                router.back()
                router.back()
                router.back()
            }

        }
        catch (e) {
            console.log("Error sending transaction::", e)
            Toast.show({
                type: 'error',
                text1: "Error",
                text2: 'An error occurred while sending the transaction'
            })
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            backgroundColor={'$background'}
            p={20}
            justifyContent='space-between'
        >

            <YStack w="100%" p={5} borderWidth={1} borderColor={'$border'} borderRadius={5}  >
                <XStack w="100%" alignItems='center' justifyContent='space-between' >
                    <XStack columnGap={10} alignItems='center' >
                        <AptosIcon
                            size={48}
                            color={
                                scheme == 'dark' ? 'white' : 'black'
                            }
                        />

                        <H4>
                            Aptos Coin
                        </H4>
                    </XStack>
                    <Text fontSize={'$6'} >
                        {CONVERTED_AMOUNT} APT
                    </Text>
                </XStack>
                <XStack w="100%" px={10} py={10} >
                    <ArrowDown />
                </XStack>
                <RecipientButton
                    data={{
                        address: RECIPIENT,
                        is_address_only: true,
                        disabled: true
                    }}
                />
            </YStack>
            <XStack w="100%" alignItems='center' justifyContent='space-between' columnGap={10} >
                <Button disabled={loading} onPress={handleCancel} flex={1}  >
                    Cancel
                </Button>
                <Button disabled={loading} onPress={handleConfirm} flex={1} backgroundColor={'$primary'} >
                    {
                        loading ? <XStack alignItems='center' columnGap={10} >
                            <Spinner />
                            <Text>
                                Sending
                            </Text>
                        </XStack> : "Confirm"
                    }
                </Button>
            </XStack>

        </YStack>
    )
}

export default Confirm