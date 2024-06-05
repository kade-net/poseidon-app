import React, { useEffect, useState } from 'react'
import { TransactionActorContext } from './transaction-wrapper'
import { useGlobalSearchParams, useNavigation, usePathname, useRouter } from 'expo-router'
import petra from '../../../../lib/wallets/petra'
import { Effect, Either } from 'effect'
import { NoPrivateKey, PetraConnectionRejected, UnableToDeserializePetraResponse, UnableToGeneratePetraSharedSecret, UnableToStorePetraSharedSecret } from '../../../../utils/errors'
import { Spinner, XStack, YStack, Text, Image, H3 } from 'tamagui'
import { AlertCircle, ArrowLeft, Clipboard, Info, Wallet } from '@tamagui/lucide-icons'
import delegateManager from '../../../../lib/delegate-manager'
import BaseButton from '../../buttons/base-button'
import { FlatList, TouchableOpacity } from 'react-native'
import settings from '../../../../lib/settings'
import posti from '../../../../lib/posti'
import * as Haptics from 'expo-haptics'
import * as ExpoClipboard from 'expo-clipboard'



export function ConnectionState() {
    const currentPath = usePathname()
    const actor = TransactionActorContext.useActorRef()
    const currentState = TransactionActorContext.useSelector((state) => {
        return ({
            module_function: state.context.module_function,
            module_arguments: state.context.module_arguments,
            type_arguments: state.context.type_arguments,
            currentWallet: state.context.currentWallet
        })
    })



    useEffect(() => {
        if (currentState?.currentWallet) {
            console.log('current wallet', currentState)
            if (currentState.currentWallet === 'petra' && !petra.sharedSecret) {
                // petra.connect(`${currentPath}`)
                actor.send({
                    type: 'connect',
                    params: {
                        module_arguments: currentState.module_arguments!,
                        module_function: currentState.module_function!,
                        type_arguments: currentState.type_arguments,
                        currentWallet: currentState.currentWallet
                    }
                })
            } else {

                actor.send({
                    type: 'simulate',
                    params: {
                        module_function: currentState.module_function!, // TODO: assumption might be false
                        module_arguments: currentState.module_arguments!,
                        type_arguments: currentState.type_arguments,
                        currentWallet: currentState.currentWallet
                    }
                })
            }
        } else {
            // petra.connect(`${currentPath}`)
            actor.send({
                type: 'connect',
                params: {
                    module_arguments: currentState.module_arguments!,
                    module_function: currentState.module_function!,
                    type_arguments: currentState.type_arguments,
                    currentWallet: settings?.active?.preffered_wallet ?? null
                }
            })
        }
    }, [])

    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            justifyContent='center'
            p={20}
        >

            <Text>
                Confirming connection...
            </Text>
            <Spinner />
        </YStack>
    )

}


export function ConnectingState() {
    const [currentCard, setCurrentCard] = useState<"choose" | "petra" | "in_app">("choose")
    const currentPath = usePathname()
    const globalParams = useGlobalSearchParams<{
        data: string
        response: 'approved' | 'rejected' | 'dismissed'
    }>()
    const actor = TransactionActorContext.useActorRef()




    const currentState = TransactionActorContext.useSelector((state) => {
        return ({
            module_function: state.context.module_function,
            module_arguments: state.context.module_arguments,
            type_arguments: state.context.type_arguments,
            currentWallet: state.context.currentWallet
        })
    })

    useEffect(() => {
        const subscription = async () => {
            if (globalParams.data && globalParams.response) {
                if (globalParams.response === 'dismissed') {
                    actor.send({
                        type: 'fail',
                        params: {
                            errorMessage: "You have dismissed the connection request"
                        }
                    })
                    return
                }
                const task = petra.generateSharedSecret({
                    data: globalParams.data,
                    response: globalParams.response
                }).pipe(Effect.runSync)

                await Either.match(task, {
                    onLeft(left) {
                        actor.send({
                            type: 'fail',
                            params: {
                                errorMessage: left._tag === 'NoPrivateKey' ? "No private key found, try closing and reopening the app" :
                                    left._tag == 'PetraConnectionRejected' ? "Connection rejected" :
                                        left._tag == 'UnableToDeserializePetraResponse' ? "Something went wrong, try again" :
                                            left._tag == 'UnableToGeneratePetraSharedSecret' ? "Unable to generate shared secret" :
                                                left._tag == 'UnableToStorePetraSharedSecret' ? "Something went wrong please try again  " : "Something went wrong"
                            }
                        })
                    },
                    async onRight(right) {
                        console.log("right", right)
                        await settings.updateSettings({
                            preffered_wallet: 'petra'
                        })
                        actor.send({
                            type: 'connectionSucceded',
                            params: {
                                module_function: currentState.module_function!, // TODO: assumption might be false
                                module_arguments: currentState.module_arguments!,
                                type_arguments: currentState.type_arguments,
                                currentWallet: 'petra'
                            }
                        })
                    },
                })
            }
        }

        subscription()

    }, [globalParams.data, globalParams.response])


    useEffect(() => {
        const subscription = async () => {
            try {
                console.log('current state', currentState)
                if (currentState.currentWallet) {
                    if (currentState.currentWallet === 'petra' && !petra.sharedSecret) {
                        petra.connect(`${currentPath}`)
                    } else {
                        actor.send({
                            type: 'connectionSucceded',
                            params: {
                                module_function: currentState.module_function!, // TODO: assumption might be false
                                module_arguments: currentState.module_arguments!,
                                type_arguments: currentState.type_arguments,
                                currentWallet: 'petra'
                            }
                        })
                    }
                }
                else {
                    setCurrentCard("choose")
                }
            }
            catch (e) {
                actor.send({
                    type: 'fail',
                    params: {
                        errorMessage: "Something went wrong while connecting to Petra"
                    }
                })
            }
        }

        subscription()
    }, [])

    const handlePetraConnect = async () => {
        try {
            Haptics.selectionAsync()
            await petra.connect(`${currentPath}`)
        }
        catch (e) {
            console.log('Something went wrong while connecting to petra', e)
            posti.capture('petra-connection-error', {
                error: e
            })
        }
    }

    const handleInAppConnect = async () => {
        setCurrentCard('in_app')

    }

    const handleConfirmInApp = async () => {
        try {
            Haptics.selectionAsync()
            await settings.updateSettings({
                ...(settings?.active ?? null),
                preffered_wallet: 'delegate'
            })

            actor.send({
                type: 'connectionSucceded',
                params: {
                    module_function: currentState.module_function!, // TODO: assumption might be false
                    module_arguments: currentState.module_arguments!,
                    type_arguments: currentState.type_arguments,
                    currentWallet: 'delegate'
                }
            })
        }
        catch (e) {
            console.log('Something went wrong while connecting to in app wallet', e)
            posti.capture('in-app-connection-error', {
                error: e
            })
        }
    }

    const copyAddress = async () => {
        try {
            Haptics.selectionAsync()
            if (!delegateManager.account?.address()) throw new Error('No address found')
            await ExpoClipboard.setStringAsync(delegateManager.account?.address()?.toString())
        }
        catch (e) {
            console.log('Something went wrong while copying address', e)
            posti.capture('copy-address-error', {
                error: e
            })
        }
    }

    const goBack = () => {
        setCurrentCard('choose')
    }


    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            p={20}
        >

            {currentCard == 'choose' &&
                <YStack rowGap={20} w="100%" h="100%" flex={1} >
                    <YStack rowGap={10} w="100%" >
                        <H3>
                            Choose a wallet
                        </H3>
                        <XStack
                            columnGap={5}
                            w="100%"
                        >
                            <Info color={'$primary'} size={'$1'} />
                            <Text fontSize={'$1'} flex={1} >
                                Your preffered wallet will be used to complete this, and future transactions. (you can change this later in settings)
                            </Text>
                        </XStack>
                    </YStack>
                    <YStack rowGap={10} >
                        <BaseButton onPress={handleInAppConnect} w="100%" icon={<Wallet />} >
                            <Text>
                                In App Wallet
                            </Text>
                        </BaseButton>
                        <BaseButton onPress={handlePetraConnect} type='outlined' >
                            <XStack columnGap={10} >
                                <Image
                                    source={require('../../../../assets/petra_logo.png')}
                                    style={{
                                        width: 15,
                                        height: 20
                                    }}
                                />
                                <Text>
                                    Link Petra
                                </Text>
                            </XStack>
                        </BaseButton>
                    </YStack>
                </YStack>}
            {
                currentCard == 'in_app' && <YStack flex={1} w="100%" h="100%" rowGap={10} >
                    <YStack w="100%" rowGap={10} >
                        <TouchableOpacity onPress={goBack} style={{ width: '100%' }} >
                            <XStack w="100%" columnGap={10} alignItems='center' >
                                <ArrowLeft />
                                <H3>
                                    In App Wallet
                                </H3>
                            </XStack>
                        </TouchableOpacity>
                        <Text>
                            This transaction may require APT to complete. You can fund your account by sending APT to the address below.
                        </Text>
                        <Text>
                            Before funding your account, please remember to  backup  your seed phrase and private key.

                        </Text>
                        <Text>
                            In case you lose access to your device, you will need these to recover your account, and funds.
                        </Text>
                        <XStack w="100%" columnGap={20} >
                            <BaseButton onPress={copyAddress} icon={<Clipboard />} type='outlined' flex={1} >
                                <Text>
                                    Copy Address
                                </Text>
                            </BaseButton>
                        </XStack>
                    </YStack>
                    <YStack flex={1} justifyContent='flex-end' >
                        <BaseButton onPress={handleConfirmInApp} >
                            <Text>
                                Done
                            </Text>
                        </BaseButton>
                    </YStack>
                </YStack>
            }


        </YStack>
    )
}


export function FailedConnectionState() {
    const actor = TransactionActorContext.useActorRef()
    const currentState = TransactionActorContext.useSelector((state) => {
        return ({
            errorMessage: state.context.errorMessage,
            module_function: state.context.module_function,
            module_arguments: state.context.module_arguments,
            type_arguments: state.context.type_arguments
        })
    })

    const handleCancel = () => {

    }

    const handleRetry = () => {
        actor.send({
            type: 'retry',
        })
    }

    return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            justifyContent='space-between'
            p={20}
        >
            <YStack flex={1} w="100%" >
                <XStack w="100%" columnGap={10} alignItems='center'  >
                    <AlertCircle color={'$sideText'} />
                    <H3 color={'$sideText'} >
                        Connection Failed
                    </H3>
                </XStack>

                <XStack rowGap={10} w="100%" >
                    <Text >
                        Something went wrong while connecting to your wallet. Please try again.
                    </Text>
                </XStack>
            </YStack>
            <XStack w="100%" alignItems='center' justifyContent='space-between' columnGap={10} >
                <BaseButton onPress={handleCancel} type="outlined" flex={1} >
                    Cancel
                </BaseButton>
                <BaseButton onPress={handleRetry} flex={1} >
                    Retry
                </BaseButton>
            </XStack>
        </YStack>
    )
}