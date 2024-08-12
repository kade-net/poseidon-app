import { View, Text } from 'react-native'
import React from 'react'
import useDisclosure from '../../components/hooks/useDisclosure'
import BaseContentSheet from '../../components/ui/action-sheets/base-content-sheet'
import PayUser from '.'
import { XStack, YStack } from 'tamagui'
import BaseButton from '../../components/ui/buttons/base-button'

interface ButtonProps {
    onPress: () => void
}
interface Props {
    button: (props: ButtonProps) => React.ReactNode
    reciever: string
    amount?: number
    currency: 'APT' | 'GUI'
    action: 'pay' | 'tip'
}

const PayButton = (props: Props) => {
    const { button: CustomButton, action, reciever, amount, currency } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <CustomButton
                onPress={() => onOpen()}
            />
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onClose}
                level={10}
                showOverlay={false}
                snapPoints={[100]}
            >
                <YStack w="100%" flex={1} py={20} pt={60} >
                    <XStack w="100%" alignItems='center' justifyContent='space-between' px={20} >
                        <BaseButton onPress={onClose} type='outlined' rounded='full' >
                            Close
                        </BaseButton>
                    </XStack>
                    <PayUser
                        action={action}
                        amount={amount}
                        currency={currency}
                        receiver={reciever}
                    />
                </YStack>
            </BaseContentSheet>
        </>
    )
}

export default PayButton