import { View, Text, Input, Heading, Button, YStack, H3, XStack, Spinner } from 'tamagui'
import React, { useEffect, useState } from 'react'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import usernames from '../../../contract/modules/usernames'
import { ChevronLeft } from '@tamagui/lucide-icons'
import delegateManager from '../../../lib/delegate-manager'
import account from '../../../contract/modules/account'
import { aptos } from '../../../contract'
import { Utils } from '../../../utils'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import Toast from 'react-native-toast-message'
import posti from '../../../lib/posti'
import * as Haptics from 'expo-haptics'
import { Either } from 'effect'
import BaseButton from '../../../components/ui/buttons/base-button'

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

    const router = useRouter()

    const goToNext = () => {
        router.replace('/onboard/created-seed-phrase/')
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
                Toast.show({
                    text1: 'Username is not available',
                    text2: 'Please try another username',
                    type: 'info',
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
                Toast.show({
                    text1: 'Error claiming username',
                    text2: 'Please try again',
                    type: 'error',

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
        <View backgroundColor={"$background"} flex={1} justifyContent='space-between' px={20} pb={40} >
            <View w="100%" rowGap={20}>
                <UnstyledButton callback={goBack} icon={<ChevronLeft/>} label={"Back"}/>
                <View w="100%" rowGap={10} >
                    <H3 color={"$text"} size="$md" >
                        Pick a username
                    </H3>
                    <Controller
                        control={form.control}
                        name="username"
                        render={({ field, fieldState }) => {
                            return (
                                <YStack w="100%" rowGap={5} >

                                    <Input
                                        autoCapitalize='none'
                                        fontWeight={"$2"}
                                        fontSize={"$sm"}
                                        backgroundColor={"$colorTransparent"}
                                        placeholder='Enter username'
                                        onChangeText={(value) => {
                                            if (isAvailable) {
                                                setIsAvailable(false)
                                            }
                                            field.onChange(value)
                                        }}
                                        value={field.value}
                                        maxLength={20}
                                    />
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
                </View>
            </View>
            <XStack w="100%" >
                {
                    isAvailable ?
                        <BaseButton onPress={form.handleSubmit(claimUsernameAndCreateAccount)} flex={1} loading={claiming} loadingText='Claiming' >
                            <Text color={"$buttonText"}>

                                Claim username
                            </Text>
                        </BaseButton>
                        :
                        <BaseButton onPress={form.handleSubmit(checkUsername)} flex={1} loading={checking} loadingText='Checking'   >
                            <Text color={"$buttonText"}>
                                Check availability
                            </Text>
                        </BaseButton>

                }
            </XStack>
        </View>
    )
}

export default PickUserName