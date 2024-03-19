import { View, Text, YStack, Button } from 'tamagui'
import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ban, MoreHorizontal, Trash2 } from '@tamagui/lucide-icons'
import useDisclosure from '../../hooks/useDisclosure'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import delegateManager from '../../../lib/delegate-manager'
import account from '../../../contract/modules/account'
import publications from '../../../contract/modules/publications'

interface Props {
    userAddress: string
    publicationId: number
    publicationRef: string
}
const PublicationActions = (props: Props) => {
    const { userAddress, publicationId, publicationRef } = props
    const IS_MY_PUBLICATION = userAddress === delegateManager.owner
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    const handleRemoveFromFeed = async () => {
        await publications.removeFromFeed(publicationRef)
        onClose()
    }

    const handleBanUser = async () => {
        await account.muteUser(userAddress)
        onClose()
    }

    const handleDeletePublication = () => {

    }

    return (
        <>
            <TouchableOpacity onPress={onOpen} >
                <MoreHorizontal />
            </TouchableOpacity>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[30]}
                showOverlay={true}
            >
                {IS_MY_PUBLICATION && <YStack w="100%" p={20} rowGap={20} >
                    <Button
                        variant='outlined'
                        icon={<Trash2 />}
                        onPress={handleDeletePublication}
                    >
                        Delete
                    </Button>
                </YStack>}
                {!IS_MY_PUBLICATION && <YStack w="100%" p={20} rowGap={20} >
                    <Button
                        variant='outlined'
                        icon={<Trash2 />}
                        onPress={handleRemoveFromFeed}
                    >
                        Remove from feed
                    </Button>
                    <Button
                        variant='outlined'
                        icon={<Ban />}
                        onPress={handleBanUser}
                    >
                        Mute User
                    </Button>
                </YStack>}
            </BaseContentSheet>
        </>
    )
}

export default memo(PublicationActions)