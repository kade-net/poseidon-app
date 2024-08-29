import { View, Text } from 'react-native'
import React from 'react'
import { XStack, YStack } from 'tamagui'
import BaseButton from '../../../../components/ui/buttons/base-button'
import { ArrowUp } from '@tamagui/lucide-icons'
import useDisclosure from '../../../../components/hooks/useDisclosure'
import BaseContentSheet from '../../../../components/ui/action-sheets/base-content-sheet'
import UserSearch from './user-search'
import PayUser from '../../../pay'

const SearchAndSend = () => {
    const [currentAddress, setCurrentAddress] = React.useState('')
    const { isOpen: isSearcherOpen, onClose: onSearcherClose, onOpen: onSearcherOpen } = useDisclosure()
    const { isOpen: isSenderOpen, onClose: onSenderClose, onOpen: onSenderOpen } = useDisclosure()
    return (
        <XStack>
            <BaseButton alignItems='center' rounded='full' icon={<ArrowUp size={'$1'} />} onPress={onSearcherOpen} >
                Send
            </BaseButton>
            {isSearcherOpen && <BaseContentSheet
                open={isSearcherOpen}
                onOpenChange={() => onSearcherClose()}
                snapPoints={[60]}
                level={9}
            >
                <UserSearch
                    onSelect={(address) => {
                        setCurrentAddress(address)
                        onSearcherClose()
                        onSenderOpen()
                    }}
                />
            </BaseContentSheet>}
            {
                currentAddress && isSenderOpen && <BaseContentSheet
                    open={isSenderOpen}
                    onOpenChange={() => onSenderClose()}
                    snapPoints={[100]}
                    level={10}
                >
                    <YStack w="100%" flex={1} py={20} pt={60} >
                        <XStack w="100%" alignItems='center' justifyContent='space-between' px={20} >
                            <BaseButton onPress={onSenderClose} type='outlined' rounded='full' >
                                Close
                            </BaseButton>
                        </XStack>
                        <PayUser
                            action='pay'
                            receiver={currentAddress}
                        />
                    </YStack>
                </BaseContentSheet>
            }
        </XStack>
    )
}

export default SearchAndSend