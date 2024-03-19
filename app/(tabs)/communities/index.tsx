import { TouchableOpacity } from 'react-native'
import React from 'react'
import Communities from '../../../screens/tabs/communities'
import { Link, Stack, useRouter } from 'expo-router'
import { Separator, XStack, YStack, Text, Button } from 'tamagui'
import { PlusSquare } from '@tamagui/lucide-icons'
import BaseContentSheet from '../../../components/ui/action-sheets/base-content-sheet'
import useDisclosure from '../../../components/hooks/useDisclosure'
import anchors from '../../../contract/modules/anchors'

const CommunitiesScreen = () => {
    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
    const router = useRouter()
    const handleCreateCommunity = async () => {
        const currentBalance = await anchors.getBalance()
        if (currentBalance < 2500) {
            onOpen()
        } else {
            onClose()
            router.push(`/communities/create`)
        }
    }
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return (
                            <YStack w="100%" >
                                <XStack py={20} w="100%" alignItems='center' justifyContent='space-between' px={20} >
                                    <Text >
                                        Your Communities
                                    </Text>
                                    <TouchableOpacity onPress={handleCreateCommunity} >
                                        <PlusSquare />
                                    </TouchableOpacity>
                                </XStack>
                                <Separator />
                            </YStack>
                        )
                    },
                }}
            />
            <Communities />
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[30]}
                showOverlay
            >
                <YStack w="100%" p={20} rowGap={20}  >
                    <Text fontSize={"$md"} >
                        You need at least 2,500 ANCHORS to create a community.
                    </Text>
                    <Link
                        href='/settings/anchors'
                        asChild
                        onPress={onClose}
                    >
                        <Button
                            backgroundColor={"$button"}
                            color={"$buttonText"}
                            fontSize={"$md"}

                        >
                            Get Anchors
                        </Button>
                    </Link>
                </YStack>
            </BaseContentSheet>
        </>
    )
}

export default CommunitiesScreen