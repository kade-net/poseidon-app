
import React, { useCallback, useEffect, useMemo } from 'react'
import { Spinner, YStack, Text, XStack, Sheet, Label, TextArea, Accordion, Square, Image } from 'tamagui'
import BaseButton from '../../buttons/base-button'
import { AlertCircle, ArrowRight, Check, ChevronDown, ExternalLink, RotateCcw } from '@tamagui/lucide-icons'
import { useMachine } from '@xstate/react'
import { inAppTransactionsMachine } from './machine'
import { CommittedTransactionResponse, SimpleTransaction } from '@aptos-labs/ts-sdk'
import { AccountChanges } from '../../../../lib/transactions/portal-transactions'
import { TouchableOpacity } from 'react-native'
import * as Linking from 'expo-linking'
import config from '../../../../config'
import { Link, useGlobalSearchParams, usePathname, useRouter } from 'expo-router'
import { TransactionActorContext } from './transaction-wrapper'
import { ConnectingState, ConnectionState, FailedConnectionState } from './states'
import petra from '../../../../lib/wallets/petra'
import settings from '../../../../lib/settings'
import * as ExpoClipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'

const NETWORK = config.APTOS_NETWORK
const EXPLORER = `https://explorer.aptoslabs.com/txn/TXN_VERSION?network=${NETWORK}`

function Simulating() {
    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
            <Spinner />
            <Text>Simulating</Text>
        </YStack>
    )
}


function FailedSimulation() {
    const simulationError = TransactionActorContext.useSelector((state) => state.context.errorMessage)
    const actor = TransactionActorContext.useActorRef()
    const onCancel = () => {
        actor.send({
            type: 'cancel'
        })
    }
    // const { onRetry, onCancel } = props

    const onRetry = () => {
        actor.send({
            type: 'retry'
        })
    }




    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='space-between' p={20} rowGap={10} >
            <YStack w="100%" rowGap={5} >
                <Text w="100%"  >Failed Submission</Text>
                <XStack columnGap={10} w="100%" alignItems='center' >
                    <AlertCircle size={12} color={'$red10'} />
                    <Text color={'$red10'}  >{simulationError}</Text>
                </XStack>
            </YStack>
            <XStack w="100%" alignItems='center' justifyContent='space-between' columnGap={10} >

                <BaseButton
                    flex={1}
                    onPress={onCancel}
                    type='outlined'
                >
                    <Text>Cancel</Text>
                </BaseButton>
                <BaseButton
                    flex={1}
                    onPress={onRetry}
                    icon={<RotateCcw />}
                >
                    <Text>Retry</Text>
                </BaseButton>
            </XStack>
        </YStack>

    )
}

function FailedSubmission() {
    const submissionError = TransactionActorContext.useSelector((state) => state.context.errorMessage)
    const actor = TransactionActorContext.useActorRef()

    const onCancel = () => {
        actor.send({
            type: 'cancel'
        })
    }

    const onRetry = () => {
        actor.send({
            type: 'retry'
        })
    }

    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='space-between' p={20} rowGap={5} >
            <YStack w="100%" rowGap={5} >
                <Text w="100%"  >Failed Submission</Text>
                <XStack columnGap={10} w="100%" alignItems='center' >
                    <AlertCircle color={'$red10'} />
                    <Text color={'$red10'}  >{submissionError}</Text>
                </XStack>
            </YStack>
            <XStack w="100%" alignItems='center' justifyContent='space-between' columnGap={10} >

                <BaseButton
                    flex={1}
                    onPress={onCancel}
                    type='outlined'
                >
                    <Text>Cancel</Text>
                </BaseButton>
                <BaseButton
                    flex={1}
                    onPress={onRetry}
                    icon={<RotateCcw />}
                >
                    <Text>Retry</Text>
                </BaseButton>
            </XStack>
        </YStack>
    )

}

function Simulated() {
    const path = usePathname()
    const currentState = TransactionActorContext.useSelector((state) => state.context)
    const actor = TransactionActorContext.useActorRef()

    const onCancel = () => {
        Haptics.selectionAsync()
        actor.send({
            type: 'cancel'
        })
    }

    const onSubmit = () => {
        Haptics.selectionAsync()
        actor.send({
            type: 'submit',
            params: {
                current_location: path
            }
        })
    }

    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='space-between' p={20} pb={40} >
            <Sheet.ScrollView showsVerticalScrollIndicator flex={1} w="100%" h="100%" >
            <YStack rowGap={5} >
                    <YStack columnGap={5} w="100%" >
                        <Text color={'$sideText'}  >
                        Smart Contract:
                    </Text>
                    <Text py={10} flex={1} >
                            {currentState?.module_function}
                    </Text>
                    </YStack>
                    <YStack columnGap={5} w="100%" >
                        <Text color={'$sideText'}  >
                        Balance Changes:
                    </Text>
                    <Text py={10} flex={1} color={
                            (currentState?.accountChanges?.withdrawn_amount ?? 0) > 0 ? '$green10' :
                            '$red10'
                    } >
                            {(currentState?.accountChanges?.withdrawn_amount ?? 0)?.toFixed(8)} APT
                        </Text>
                    </YStack>
                    <YStack columnGap={5} w="100%" >
                        <Text color={'$sideText'}  >
                            Network Fee:
                        </Text>
                        <Text py={10} flex={1} color={
                            (currentState?.accountChanges?.gas_used ?? 0) > 0 ? '$green10' :
                                '$red10'
                        } >
                            {(currentState?.accountChanges?.gas_used ?? 0)?.toFixed(8)} APT
                        </Text>
                    </YStack>
                    {
                        ((currentState?.accountChanges?.acquired_assets?.length ?? 0) > 0) &&
                        <YStack>
                            <Label color={'$sideText'} >
                                Acquired Assets
                            </Label>
                            <YStack columnGap={5} >
                                {
                                    currentState?.accountChanges?.acquired_assets?.map((asset, index) => {
                                        return (
                                            <YStack key={index} columnGap={5} >
                                                <Text color="$green10" >+{asset.amount} {asset.type}</Text>
                                            </YStack>
                                        )
                                    })
                                }
                            </YStack>
                        </YStack>}

                    <YStack>
                        <Label color={'$sideText'} >
                            Transaction Data
                        </Label>
                        <TextArea
                            value={JSON.stringify(currentState?.accountChanges, (k, v) => {
                                if (typeof v === 'bigint') {
                                    return v.toString()
                                }
                                return v
                            })}
                            disabled
                            w="100%"
                        // h={100}
                        />
                    </YStack>

                </YStack>
            </Sheet.ScrollView>
            <XStack w="100%" columnGap={20} pt={10}  >
                <BaseButton
                    flex={1}
                    type='outlined'
                    onPress={onCancel}
                >
                    <Text>Cancel</Text>
                </BaseButton>
                <BaseButton
                    flex={1}
                    onPress={onSubmit}
                    // iconAfter={<ArrowRight />}

                >
                    <Text>
                        Submit
                    </Text>
                </BaseButton>
            </XStack>
        </YStack>
    )
}

function Submitting() {

    const currentPath = usePathname()
    const globalParams = useGlobalSearchParams<{
        data: string,
        response: 'approved' | 'rejected' | 'dismissed'
    }>()

    console.log("Global Params::", globalParams)

    const actor = TransactionActorContext.useActorRef()

    const currentState = TransactionActorContext.useSelector((state) => state.context)

    useEffect(() => {
        const subscription = async () => {
            if (globalParams.data && globalParams.response) {
                if (globalParams.response === 'dismissed') {
                    actor.send({
                        type: 'fail',
                        params: {
                            errorMessage: 'User dismissed transaction'
                        }
                    })
                }
                if (globalParams.response === 'rejected') {
                    actor.send({
                        type: 'fail',
                        params: {
                            errorMessage: 'Transaction rejected'
                        }
                    })

                }

                if (globalParams.response === 'approved') {


                    const parsed = petra.parseResponseToData(globalParams.data) as CommittedTransactionResponse

                    console.log("Parsed::", parsed)

                    if (parsed.hash) {
                        actor.send({
                            type: 'transactionSuccessful',
                            params: {
                                transactionHash: parsed.hash
                            }
                        })
                    } else {

                        if ((parsed as any)?.petraPublicEncryptedKey) {
                            // Ignore
                        } else {
                            actor.send({
                                type: 'fail',
                                params: {
                                    errorMessage: 'Transaction rejected'
                                }
                            })

                        }

                    }

                }
            }
        }

        subscription()
    }, [globalParams?.data, globalParams?.response])

    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
            <Spinner />
            <Text>Submitting</Text>
        </YStack>
    )

}

interface Props {
    handleClose: (hash?: string) => void
}
function SuccessfulSubmission(props: Props) {
    const { handleClose } = props

    const actor = TransactionActorContext.useActorRef()
    const transactionHash = TransactionActorContext.useSelector((state) => state.context.transactionHash)

    const onClose = () => {

        handleClose(transactionHash ?? undefined)

    }

    const handleOpenLink = () => {


        const explorerLink = EXPLORER.replace('TXN_VERSION', transactionHash!)

        Linking.openURL(explorerLink)
    }

    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' rowGap={10} >
            <Check size={48} color={'$green10'} />
            <Text color={'$green10'} >Successful</Text>
            {/* <TouchableOpacity onPress={handleOpenLink} >
                <XStack>
                    <Text color={'$blue10'} >View on Explorer</Text>
                    <ExternalLink size={16} color='$blue10' />
                </XStack>
            </TouchableOpacity> */}
            {/* <BaseButton
                onPress={onClose}
            >
                <Text>Done</Text>
            </BaseButton> */}
        </YStack>
    )

}

interface P {
    module_arguments: string
    module_function: string
    type_arguments?: string
    onClose: (hash?: string) => void
}
const InAppTransactions = (props: P) => {
    const { module_arguments, module_function, type_arguments, onClose } = props
    const currentState = TransactionActorContext.useSelector((state) => state.value)
    const transactionHash = TransactionActorContext.useSelector((state) => state.context.transactionHash)
    const actor = TransactionActorContext.useActorRef()

    useEffect(() => {
        if (transactionHash) {
            onClose(transactionHash)
        }
    }, [transactionHash])

    useEffect(() => {
        if (module_arguments && module_function && currentState == 'closed') {
            console.log("current wallet::", settings?.active?.preffered_wallet)
            actor.send({
                type: 'connect',
                params: {
                    module_arguments,
                    module_function,
                    type_arguments: type_arguments ?? null,
                    currentWallet: settings?.active?.preffered_wallet ?? null
                }
            })


        }
    }, [module_arguments, module_function])

    useEffect(() => {
        if (currentState == 'done') {
            onClose()
        }
    }, [currentState])


    const activeView = useCallback(() => {
        if (currentState === 'connection') {
            return <ConnectionState />
        }
        if (currentState === 'failedConnection') {
            return <FailedConnectionState />
        }

        if (currentState === 'connecting') {
            return <ConnectingState />
        }

        if (currentState === 'simulating') {
            return <Simulating />
        }
        if (currentState === 'failedSimulation') {
            return <FailedSimulation />
        }
        if (currentState === 'failedSubmission') {
            return <FailedSubmission />
        }
        if (currentState === 'simulated') {
            return <Simulated />
        }
        if (currentState === 'submitting') {
            return <Submitting />
        }
        if (currentState === 'successful') {
            return <SuccessfulSubmission handleClose={onClose} />
        }
        return null

    }, [, currentState]) 



    return (
        <>
            {activeView()}
        </>
    )
}

export default InAppTransactions