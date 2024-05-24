import { View, Text, YStack } from 'tamagui'
import React from 'react'
import BaseContentSheet from '../base-content-sheet'
import InAppTransactions from '.'

interface Props {
    isOpen: boolean
    onOpen: () => void
    onClose: (hash?: string) => void
    onToggle: () => void
    module_arguments: string
    module_function: string
    type_arguments?: string
}

const TransactionSheet = (props: Props) => {
    const { isOpen, onOpen, onClose, onToggle, module_arguments, module_function, type_arguments } = props
    // return null
    return (
        <BaseContentSheet
            open={isOpen}
            onOpenChange={onToggle}
            snapPoints={[30]}
        >
            <YStack flex={1} w="100%" h="100%" >
                <InAppTransactions
                    module_arguments={module_arguments}
                    module_function={module_function}
                    type_arguments={type_arguments}
                    onClose={(hash) => {
                        onClose(hash)
                    }}
                />
            </YStack>
        </BaseContentSheet>
    )
}

export default TransactionSheet