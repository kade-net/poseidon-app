
import React, { useCallback, useEffect } from 'react'
import { Spinner, YStack, Text, XStack } from 'tamagui'
import BaseButton from '../../buttons/base-button'
import { Check, ExternalLink, Link, RotateCcw } from '@tamagui/lucide-icons'
import { useMachine } from '@xstate/react'
import { inAppTransactionsMachine } from './machine'
import { SimpleTransaction } from '@aptos-labs/ts-sdk'
import { AccountChanges } from '../../../../lib/transactions/portal-transactions'
import { TouchableOpacity } from 'react-native'
import * as Linking from 'expo-linking'
import config from '../../../../config'

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


function FailedSimulation(props: { simulationError: string, onRetry: () => void }) {
    const { simulationError, onRetry } = props
    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
            <Text>Failed Simulation</Text>
            <Text>{simulationError}</Text>
            <BaseButton
                icon={<RotateCcw />}
                onPress={onRetry}
            >
                <Text>Retry</Text>
            </BaseButton>
        </YStack>

    )
}

function FailedSubmission(props: { submissionError: string, onRetry: () => void }) {
    const { submissionError, onRetry } = props
    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
            <Text>Failed Submission</Text>
            <Text>{submissionError}</Text>
            <BaseButton
                onPress={onRetry}
                icon={<RotateCcw />}
            >
                <Text>Retry</Text>
            </BaseButton>
        </YStack>
    )

}

function Simulated(props: {
    transaction: SimpleTransaction | null,
    changes: AccountChanges | null,
    onSubmit: () => void
    onCancel: () => void
    module_function: string | null
}) {
    const { transaction, changes, onSubmit, onCancel, module_function } = props

    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='space-between' p={20} pb={40} >
            <YStack rowGap={5} >
                <XStack columnGap={5} w="100%" >
                    <Text backgroundColor={'$baseBackround'} py={10} px={10} >
                        Smart Contract:
                    </Text>
                    <Text py={10} flex={1} >
                        {module_function}
                    </Text>
                </XStack>
                <XStack columnGap={5} w="100%" >
                    <Text backgroundColor={'$baseBackround'} py={10} px={10} >
                        Balance Changes:
                    </Text>
                    <Text py={10} flex={1} color={
                        (changes?.total_amount ?? 0) > 0 ? '$green10' :
                            '$red10'
                    } >
                        {changes?.total_amount} APT
                    </Text>
                </XStack>
            </YStack>
            <XStack w="100%" columnGap={20}  >
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
                >
                    <Text>Confirm</Text>
                </BaseButton>
            </XStack>
        </YStack>
    )
}

function Submitting() {
    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' >
            <Spinner />
            <Text>Submitting</Text>
        </YStack>
    )

}

function SuccessfulSubmission(props: { onClose: () => void, transactionHash: string | null }) {

    const handleOpenLink = useCallback(() => {
        if (!props.transactionHash) return
        Linking.openURL(EXPLORER.replace('TXN_VERSION', props.transactionHash))
    }, [])

    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' rowGap={10} >
            <Check size={48} color={'$green10'} />
            <Text color={'$green10'} >Successful</Text>
            <TouchableOpacity onPress={handleOpenLink} >
                <XStack>
                    <Text color={'$blue10'} >View on Explorer</Text>
                    <ExternalLink size={16} color='$blue10' />
                </XStack>
            </TouchableOpacity>
            <BaseButton
                onPress={props.onClose}
            >
                <Text>Done</Text>
            </BaseButton>
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
    const [snapshot, send] = useMachine(inAppTransactionsMachine)

    console.log("Snapshot::\n", snapshot.context, "\n")

    useEffect(() => {
        if (module_arguments && module_function && snapshot.matches('closed')) {
            // console.log("Sending::", module_arguments, module_function)
            send({
                type: 'simulate',
                params: {
                    module_arguments,
                    module_function,
                    type_arguments: type_arguments ?? null
                }
            })
        }
    }, [module_arguments, module_function])

    const handleRetry = useCallback(() => {
        send({
            type: 'retry'
        })
    }, [])

    const handleCancelSubmit = useCallback(() => {
        send({
            type: "cancel"
        })

        handleClose()
    }, [])

    const handleSubmit = useCallback(() => {
        send({
            type: 'submit'
        })
    }, [])

    const handleClose = () => {
        onClose(snapshot.context.transactionHash ?? "")
    }

    if (snapshot.matches('simulating')) {
        return <Simulating />
    }

    if (snapshot.matches('failedSimulation')) {
        return <FailedSimulation simulationError={snapshot.context.errorMessage ?? ""} onRetry={handleRetry} />
    }

    if (snapshot.matches('failedSubmission')) {
        return <FailedSubmission submissionError={snapshot.context.errorMessage ?? ""} onRetry={handleRetry} />
    }

    if (snapshot.matches('simulated')) {
        return <Simulated module_function={snapshot.context.module_function} transaction={snapshot.context.simpleTransaction} changes={snapshot.context.accountChanges} onCancel={handleCancelSubmit} onSubmit={handleSubmit} />
    }

    if (snapshot.matches('submitting')) {
        return <Submitting />
    }

    if (snapshot.matches('successful')) {
        return <SuccessfulSubmission transactionHash={snapshot.context.transactionHash} onClose={handleClose} />
    }



    return null
}

export default InAppTransactions