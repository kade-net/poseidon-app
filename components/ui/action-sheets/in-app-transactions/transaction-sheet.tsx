import { View, Text, YStack, H3, XStack } from 'tamagui'
import React, {useEffect, useMemo} from 'react'
import BaseContentSheet from '../base-content-sheet'
import InAppTransactions from '.'
import TransactionWrapper from './transaction-wrapper'
import settings from '../../../../lib/settings'
import { Info, Wallet } from '@tamagui/lucide-icons'
import BaseButton from '../../buttons/base-button'
import {Platform} from "react-native";
import {FullWindowOverlay} from "react-native-screens";

interface Props {
    isOpen: boolean
    onOpen: () => void
    onClose: (hash?: string) => void
    onToggle: () => void
    module_arguments: string
    module_function: string
    type_arguments?: string
    wallet?: 'preffered' | 'delegate'
}

const TransactionSheet = (props: Props) => {
    const { isOpen, onOpen, onClose, onToggle, module_arguments, module_function, type_arguments, wallet } = props
    const [update_preffered_wallet, setUpdatePrefferedWallet] = React.useState(false)

    const containerComponent = useMemo(() => (props: any) => (
        Platform.OS === 'ios' ? (
            <FullWindowOverlay>
                <YStack flex={1} pe='box-none' >
                    {props.children}
                </YStack>
            </FullWindowOverlay>
        ) : props.children
    ), [])

    useEffect(() => {
        if (wallet == 'delegate' && settings?.active?.preffered_wallet !== 'delegate') {
            setUpdatePrefferedWallet(true)
        }
    }, [wallet])
    const handleSetPrefferedWallet = () => {
        settings.updateSettings({
            preffered_wallet: 'delegate'
        })
        setUpdatePrefferedWallet(false)
    }

    return (
        <BaseContentSheet
            open={isOpen}
            onOpenChange={onToggle}
            snapPoints={[50]}
            level={10}
            containerComponent={containerComponent}
        >
            {update_preffered_wallet ? <YStack w="100%" h="100%" p={20} pb={40} rowGap={5} justifyContent='space-between' >
                <YStack w="100%" rowGap={5} >
                    <XStack columnGap={10} >
                        <Wallet color={'$COAText'} />
                        <H3>
                            Update Wallet
                        </H3>
                    </XStack>
                    <Text>
                        This portal, requires you to update your wallet settings to use the in app wallet.
                    </Text>


                </YStack>
                <XStack w="100%" columnGap={10} >
                    <BaseButton onPress={handleSetPrefferedWallet} flex={1} >
                        <Text>
                            Use In App Wallet
                        </Text>
                    </BaseButton>
                    <BaseButton onPress={() => onClose()} flex={1} type="outlined" >
                        <Text>
                            Cancel
                        </Text>
                    </BaseButton>
                </XStack>
            </YStack> :
                <TransactionWrapper>
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
                </TransactionWrapper>}
        </BaseContentSheet>
    )
}

export default TransactionSheet