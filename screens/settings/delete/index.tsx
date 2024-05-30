import { View, Text, YStack, H3 } from 'tamagui'
import React from 'react'
import BaseButton from '../../../components/ui/buttons/base-button'
import * as Haptics from 'expo-haptics'
import { Alert } from 'react-native'
import { useMutation } from '@apollo/client'
import { DELETE_ACCOUNT } from '../../../lib/convergence-client/queries'
import delegateManager from '../../../lib/delegate-manager'
import { convergenceClient } from '../../../data/apollo'
import Toast from 'react-native-toast-message'
import account from '../../../contract/modules/account'
import localStore from '../../../lib/local-store'
import notifications from '../../../lib/notifications'
import { useNavigation } from 'expo-router'

const Delete = () => {
    const navigation = useNavigation()
    const [deleteAccount, mutationResults] = useMutation(DELETE_ACCOUNT, {
        variables: {
            input: {
                user_address: delegateManager.owner!
            }
        },
        client: convergenceClient
    })

    const handleDelete = async () => {
        Haptics.selectionAsync()
        Alert.alert(
            "Are you sure you want to delete your account?",
            "This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete", onPress: async () => {
                        try {
                            await deleteAccount()

                            await account.nuke()//💥
                            await delegateManager.nuke() //💥
                            await localStore.nuke() //💥
                            await notifications.nukeNotifications() //💥

                            navigation.reset({
                                index: 0,
                                // @ts-expect-error - TS doesn't know about the `routes` property
                                routes: [{ name: 'onboard', path: '/' }]
                            })

                            Toast.show({
                                type: 'success',
                                text1: 'Account deleted successfully',
                            })
                        }
                        catch (e) {
                            console.log("Error deleting account", e)
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                            Toast.show({
                                type: 'error',
                                text1: 'Error deleting account, please try again later',
                            })
                        }
                    }
                }
            ]
        )
    }
    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' p={20} backgroundColor={'$background'} rowGap={20} >
            <YStack w="100%" rowGap={10} >
                <H3>
                    Delete your Poseidon Account
                </H3>
                <Text>
                    Deleting your account will remove all your data from Poseidon.
                </Text>
                <Text  >
                    Deletions are permanent and cannot be undone.
                </Text>
            </YStack>
            <BaseButton loading={mutationResults.loading} w="100%" backgroundColor={'$red10'} onPress={handleDelete} >
                <Text>
                    Delete Account
                </Text>
            </BaseButton>
        </YStack>
    )
}

export default Delete