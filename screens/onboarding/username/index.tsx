import { View, Text, Input, Heading, Button, YStack, H3, XStack, Spinner, H4 } from 'tamagui'
import React, { useEffect, useState } from 'react'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import usernames from '../../../contract/modules/usernames'
import { ArrowLeft, CheckCircle, ChevronLeft, XCircle } from '@tamagui/lucide-icons'
import delegateManager from '../../../lib/delegate-manager'
import account from '../../../contract/modules/account'
import { aptos } from '../../../contract'
import { Utils } from '../../../utils'
import posti from '../../../lib/posti'
import * as Haptics from 'expo-haptics'
import { Either } from 'effect'
import BaseButton from '../../../components/ui/buttons/base-button'
import * as Burnt from 'burnt'
import { useQuery } from 'react-query'

const schema = z.object({
    username: z.string().regex(Utils.USERNAME_REGEX).min(3).max(20).trim()
})

type TSchema = z.infer<typeof schema>

const PickUserName = () => {
    const [error, setError] = useState<string | null>(null)
    const [isAvailable, setIsAvailable] = useState(false)
    const [checking, setChecking] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const insets = useSafeAreaInsets()
    const form = useForm<TSchema>({
        resolver: zodResolver(schema)
    })
    const USERNAME = form.watch('username')
    const availabilityQuery = useQuery({
        queryKey: ['username-availability', USERNAME],
        queryFn: async () => {
            return await usernames.checkUsernameAvailability(USERNAME?.toLowerCase())
        },
        enabled: USERNAME?.length > 2
    })

    const router = useRouter()

    const goToNext = () => {
        router.replace('/onboard/created-seed-phrase')
    }

    const goToProfile = () => {
        router.replace('/onboard/profile')
    }

    const goBack = () => {
        router.replace('/onboard/')
    }

    const checkUsername = async (values: TSchema) => {
        Haptics.selectionAsync()
        setChecking(true)
        console.log(`CHECKING USERNAME:: ${values.username}`)
        try {
            const available = await usernames.checkUsernameAvailability(values.username?.toLowerCase())
            console.log(`USERNAME IS AVAILABLE:: ${available}`)
            setIsAvailable(available)

            if (!available) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                Burnt.toast({
                    haptic: 'error',
                    title: 'Username error',
                    message: 'Username already claimed',
                    preset: 'error'
                })
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
        catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            posti.capture('check-username-error', {
                error: e
            })
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
        finally {
            setChecking(false)
        }
    }

    const claimUsernameAndCreateAccount = async (values: TSchema) => {
        Haptics.selectionAsync()
        const username = values.username?.toLowerCase()
        delegateManager.setUsername(username)
        setClaiming(true)
        const eitherResult = await account.setupWithSelfDelegate()

        if (Either.isEither(eitherResult)) {
            if (Either.isLeft(eitherResult)) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                posti.capture('claim-username-error', {
                    error: eitherResult.left
                })
                Burnt.toast({
                    title: 'Username Claim Failed',
                    message: 'Something went wrong',
                    preset: 'error'
                })
                console.log(`SOMETHING WENT WRONG:: `, eitherResult.left)
            }
            if (Either.isRight(eitherResult)) {
                const data = eitherResult.right
                console.log(`Transaction  Hash::`, data.hash)
                if (account.isImported) {
                    setClaiming(false)
                    goToProfile()
                    return
                } else {
                    setClaiming(false)
                    goToNext()
                    return
                }
            }
        }

        setClaiming(false)
    }


    const goToSignIn = () => {
        router.replace('/onboard/signin')
    }

    return (
        <KeyboardAvoidingView style={{
            flex: 1,
            width: '100%',
            height: '100%'
        }}
            behavior={Platform.select({
                ios: 'padding',
                android: 'height'
            })}

            keyboardVerticalOffset={Platform.select({
                ios: 60,
                android: 0
            })}
        >
            <View backgroundColor={"$background"} flex={1} justifyContent='space-between' px={20} pb={40} >
                <XStack w="100%" alignItems='center' >
                    <TouchableOpacity onPress={goBack} style={{ width: '100%' }} >
                        <ArrowLeft />
                    </TouchableOpacity>
                </XStack>
                <YStack w="100%" alignItems='center' justifyContent='center' rowGap={10} flex={1} >
                    <Controller
                        control={form.control}
                        name="username"
                        render={({ field, fieldState }) => {
                            return (
                                <YStack w="100%" rowGap={20} alignItems='center' justifyContent='center' >
                                    <H4>
                                        Choose your username
                                    </H4>
                                    <Input
                                        autoFocus
                                        w="100%"
                                        autoCapitalize='none'
                                        placeholder='Enter a unique username'
                                        onChangeText={(value) => {
                                            if (isAvailable) {
                                                setIsAvailable(false)
                                            }
                                            field.onChange(value)
                                        }}
                                        value={field.value}
                                        maxLength={20}
                                        // fontSize={24}
                                        borderRadius={100}
                                        textAlign='center'
                                        backgroundColor={'$colorTransparent'}
                                        borderColor={'$border'}

                                    />
                                    {
                                        (USERNAME?.length ?? 0) > 2 &&
                                        <XStack w="100%" alignItems='center' justifyContent='center' columnGap={10} >
                                            {
                                                availabilityQuery.isLoading ? <Spinner size='small' /> : availabilityQuery?.data ? <CheckCircle size={14} color={'$green10'} /> : <XCircle size={14} color={'$red10'} />
                                            }
                                            {
                                                availabilityQuery.isLoading ? <Text>Checking...</Text> : availabilityQuery?.data ? <Text color={"$green10"}>Username available</Text> : <Text color={"$red10"}>Username already claimed</Text>
                                            }
                                        </XStack>
                                    }
                                    {
                                        fieldState.invalid && <Text fontSize={"$xxs"} color={"$red10"}>
                                            Please make sure your username is between 3 and 20 characters long and contains no special characters except for underscore, and has no spaces.
                                        </Text>
                                    }
                                </YStack>
                            )

                        }}
                    />
                    <XStack>
                        <Text>
                            Already Claimed Username?
                        </Text>
                        <TouchableOpacity onPress={goToSignIn}>
                            <Text color={"$primary"}>{" "}Sign in instead</Text>
                        </TouchableOpacity>
                    </XStack>
                </YStack>
                <XStack w="100%" >

                    <BaseButton
                        type={
                            (USERNAME?.length ?? 0) > 2 && availabilityQuery?.data ? 'primary' : 'outlined'
                        }
                        disabled={availabilityQuery?.isLoading || !availabilityQuery?.data} rounded='full' onPress={form.handleSubmit(claimUsernameAndCreateAccount)} flex={1} loading={claiming} loadingText='Claiming' >
                        <Text>

                            Claim username
                        </Text>
                    </BaseButton>



                </XStack>
            </View>
        </KeyboardAvoidingView>
    )
}

export default PickUserName