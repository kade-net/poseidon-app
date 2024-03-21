import { View, Text, YStack, Button, Spinner } from 'tamagui'
import React, { memo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ban, MoreHorizontal, Trash2 } from '@tamagui/lucide-icons'
import useDisclosure from '../../hooks/useDisclosure'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import delegateManager from '../../../lib/delegate-manager'
import publications from '../../../contract/modules/publications'
import selfModeration from '../../../lib/self-moderation'

interface Props {
    userAddress: string
    publicationId: number
    publicationRef: string
    userId: number
    publication_type: number
    triggerHide?: () => void
}
const PublicationActions = (props: Props) => {
    const { userAddress, publicationId, publicationRef, userId, triggerHide, publication_type } = props
    const IS_MY_PUBLICATION = userAddress === delegateManager.owner
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const [deleting, setDeleting] = useState(false)

    const handleRemoveFromFeed = async () => {
        await selfModeration.removeFromFeed(publicationRef)
        onClose()
        triggerHide && triggerHide()
    }

    const handleBanUser = async () => {
        await selfModeration.muteUser(userId, userAddress)
        onClose()
        triggerHide && triggerHide()
    }

    const handleDeletePublication = async () => {
        setDeleting(true)
        try {
            triggerHide && triggerHide()
            await publications.removePublicationWithRef(publicationRef, publication_type as any)
            setDeleting(false)
            onClose()
        }
        catch (e) {
            console.error("Error deleting publication", e)
            setDeleting(false)
        }
        finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={onOpen} >
                <MoreHorizontal />
            </TouchableOpacity>
            {isOpen && <BaseContentSheet
                open={isOpen}
                onOpenChange={onClose}
                snapPoints={[30]}
                showOverlay={true}
            >
                {IS_MY_PUBLICATION && <YStack w="100%" p={20} rowGap={20} >
                    <Button
                        variant='outlined'
                        icon={deleting ? <Spinner /> : <Trash2 />}
                        onPress={handleDeletePublication}
                    >
                        {
                            deleting ? 'Deleting...' : 'Delete'
                        }
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
            </BaseContentSheet>}
        </>
    )
}

export default memo(PublicationActions)