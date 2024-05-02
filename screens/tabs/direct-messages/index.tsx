import { View, Text, Heading, YStack } from 'tamagui'
import React, { useState } from 'react'
import DMTabs from './tabs'
import BaseContentSheet from '../../../components/ui/action-sheets/base-content-sheet'
import useDisclosure from '../../../components/hooks/useDisclosure'
import BaseButton from '../../../components/ui/buttons/base-button'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import hermes from '../../../contract/modules/hermes'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'
import { useQuery } from '@apollo/client'
import { getPhoneBook } from '../../../lib/hermes-client/queries'
import delegateManager from '../../../lib/delegate-manager'
import Loading from '../../../components/ui/feedback/loading'
import { GetPhoneBookQuery, PhoneBook } from '../../../lib/hermes-client/__generated__/graphql'
import { hermesClient } from '../../../data/apollo'

interface Props {
    phonebook: PhoneBook | null
}

const _DirectMessages = (props: Props) => {
    const { phonebook } = props
    console.log("Data::", phonebook)
    const [registering, setRegistering] = useState(false)
    const { isOpen, onClose, onOpen } = useDisclosure({
        defaultIsOpen: false
    })

    useFocusEffect(() => {
        onOpen()
    })

    const router = useRouter()

    const handleBack = () => {
        router.back()
        onClose()
    }

    const handleRegister = async () => {
        await Haptics.selectionAsync()
        setRegistering(true)
        const status = await hermes.registerInbox()
        if (status.error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            console.log("Something went wrong::", status.error)
            // TODO: Handle based on the current error message
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please try again later'
            })
        }
        else {
            console.log("Success::", status.data)
        }
        setRegistering(false)
    }

    return (
        <YStack flex={1} h="100%" w="100%" >
            <DMTabs />
            {!phonebook && <BaseContentSheet
                snapPoints={[30]}
                showOverlay
                dismissOnOverlayPress={false}
                onOpenChange={() => { }}
                open={isOpen}
            >
                <YStack p={20} flex={1} w="100%" h="100%" rowGap={10} >
                    <Text>
                        You need to enable direct messaging to chat with other users.
                    </Text>
                    <BaseButton
                        icon={<ArrowLeft />}
                        type="outlined"
                        onPress={handleBack}
                    >
                        <Text>
                            Back
                        </Text>
                    </BaseButton>
                    <BaseButton loading={registering} onPress={handleRegister} >
                        <Text>
                            Enable
                        </Text>
                    </BaseButton>
                </YStack>
            </BaseContentSheet>}
        </YStack>
    )
}

const DirectMessages = () => {
    const phonebook = useQuery(getPhoneBook, {
        variables: {
            address: delegateManager.owner!
        },
        client: hermesClient
    })

    if (phonebook.loading) return <Loading
        backgroundColor={'$background'}
        flex={1}
        w="100%"
        h="100%"
    />

    return <_DirectMessages
        phonebook={phonebook?.data?.phoneBook ?? null}
    />

}

export default DirectMessages