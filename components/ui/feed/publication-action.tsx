import { View, Text, YStack, Button, Spinner } from 'tamagui'
import React, { memo, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { Ban, MoreHorizontal, MoreVertical, Trash2 } from '@tamagui/lucide-icons'
import useDisclosure from '../../hooks/useDisclosure'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import delegateManager from '../../../lib/delegate-manager'
import publications from '../../../contract/modules/publications'
import { Utils } from '../../../utils'
import selfModeration from '../../../lib/self-moderation'
import BaseButton from '../buttons/base-button'
import PayButton from '../../../screens/pay/pay-button'
import TipIcon from '../../../assets/svgs/tip-icon'
import PayUser from '../../../screens/pay'
import { useRouter } from 'expo-router'

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
    const { isOpen: tipOpen, onOpen: openTip, onClose: closeTip } = useDisclosure()
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

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
        Alert.alert("Delete Post", "Are you sure you want to delete this publication?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: async () => {
                    console.log("Deleting post")
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
            }
        ])
    }

    return (
        <>
            <TouchableOpacity onPress={onOpen} style={{ padding: 10 }} >
                <MoreVertical size={14} color={'$sideText'} />
            </TouchableOpacity>
            {isOpen && <BaseContentSheet
                open={isOpen}
                onOpenChange={onClose}
                snapPoints={[30]}
                showOverlay={true}
            >
                {IS_MY_PUBLICATION && <YStack flex={1} backgroundColor={'$background'} w="100%" p={20} rowGap={20} >
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
                {!IS_MY_PUBLICATION && <YStack backgroundColor={'$background'} flex={1} p={20} w="100%" rowGap={10} alignItems='flex-start'>
                    <BaseButton
                        type='text'
                        rounded='full'
                        icon={<TipIcon />}
                        onPress={() => {
                            onClose()
                            router.push(`/wallet?address=${userAddress}&action=tip`)
                        }}
                        w={"100%"}
                    >
                        Tip Creator
                    </BaseButton>
                    <BaseButton
                        type='text'
                        rounded='full'
                        icon={<Trash2 />}
                        onPress={handleRemoveFromFeed}
                        w={"100%"}
                    >
                        Remove from feed
                    </BaseButton>
                    <BaseButton
                        type='text'
                        rounded='full'
                        icon={<Ban />}
                        onPress={handleBanUser}
                        w={"100%"}

                    >
                        Mute User
                    </BaseButton>
                </YStack>}
            </BaseContentSheet>}
        </>
    )
}

export default memo(PublicationActions)