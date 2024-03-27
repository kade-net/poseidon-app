import { View, Text, Input, Heading, Button, YStack, H3, XStack, Spinner } from 'tamagui'
import React, { useEffect, useState } from 'react'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native'
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
        setChecking(true)
        console.log(`CHECKING USERNAME:: ${values.username}`)
        try {
            const available = await usernames.checkUsernameAvailability(values.username)
            console.log(`USERNAME IS AVAILABLE:: ${available}`)
            setIsAvailable(available)

            if (!available) {
                Toast.show({
                    text1: 'Username is not available',
                    text2: 'Please try another username',
                    type: 'info',
                })
            }
        }
        catch (e) {
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
        finally {
            setChecking(false)
        }
    }

    const claimUsernameAndCreateAccount = async (values: TSchema) => {
        const username = values.username
        delegateManager.setUsername(username)
        setClaiming(true)
        try {
            const txn = await account.setupWithSelfDelegate()
            console.log(`ACCOUNT SETUP TXN:: ${txn}`)
            const hash = txn.hash

            const resp = await aptos.transaction.waitForTransaction({
                transactionHash: hash
            })

            console.log(`ACCOUNT SETUP RESPONSE:: ${resp}`)

            if (resp.success) {
                await account.markAsRegistered()
                if (account.isImported) {
                    setClaiming(false)
                    goToProfile()
                    return
                }
                setClaiming(false)
                goToNext()
                return
            }
            console.log(`ACCOUNT SETUP FAILED:: ${resp}`)
        }
        catch (e) {
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
        finally {
            setClaiming(false)
        }

    }


    return (
        <View pt={insets.top} backgroundColor={"$background"} flex={1} justifyContent='space-between' px={Utils.dynamicWidth(5)} pb={insets.bottom}>
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
                </View>
            </View>
            <Button disabled={claiming || checking} backgroundColor={"$button"} color={"$buttonText"} onPress={form.handleSubmit(isAvailable ? claimUsernameAndCreateAccount : checkUsername)} marginBottom={Utils.dynamicHeight(5)}>
                {
                    isAvailable ? <View>
                        {claiming ? <XStack columnGap={10} >
                            <Spinner />
                            <Text fontSize={"$sm"} >Claiming...</Text>
                        </XStack> : <Text fontSize={"$sm"} >Claim username</Text>}
                    </View> : <View>
                            {checking ? <XStack columnGap={10} >
                                <Spinner />
                                <Text fontSize={"$sm"} >Checking...</Text>
                            </XStack> : <Text fontSize={"$sm"} >Check availability</Text>}
                    </View>
                }
            </Button>
        </View>
    )
}

export default PickUserName