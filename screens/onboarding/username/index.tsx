import { View, Text, Input, Heading, Button } from 'tamagui'
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

const schema = z.object({
    username: z.string().min(3).max(20)
})

type TSchema = z.infer<typeof schema>

const PickUserName = () => {
    const [isAvailable, setIsAvailable] = useState(false)
    const [checking, setChecking] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const insets = useSafeAreaInsets()
    const form = useForm<TSchema>({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    const goToNext = () => {
        router.push('/onboard/created-seed-phrase/')
    }

    const goToProfile = () => {
        router.push('/onboard/profile')
    }

    const goBack = () => {
        router.back()
    }

    const checkUsername = async (values: TSchema) => {
        setChecking(true)
        console.log(`CHECKING USERNAME:: ${values.username}`)
        try {
            const available = await usernames.checkUsernameAvailability(values.username)
            console.log(`USERNAME IS AVAILABLE:: ${available}`)
            setIsAvailable(available)

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
                    <Heading color={"$text"} size="$lg" >
                        Pick a username
                    </Heading>
                    <Controller
                        control={form.control}
                        name="username"
                        render={({ field }) => {
                            return (
                                <Input
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
                            )

                        }}
                    />
                </View>
            </View>
            <Button backgroundColor={"$button"} color={"$buttonText"} onPress={form.handleSubmit(isAvailable ? claimUsernameAndCreateAccount : checkUsername)} marginBottom={Utils.dynamicHeight(5)}>
                {
                    isAvailable ? <View>
                        {claiming ? <Text>Claiming...</Text> : <Text>Claim username</Text>}
                    </View> : <View>
                        {checking ? <Text>Checking...</Text> : <Text>Check availability</Text>}
                    </View>
                }
            </Button>
        </View>
    )
}

export default PickUserName