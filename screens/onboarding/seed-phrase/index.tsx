import { View, Text, Button, Heading, TextArea, XStack, Spinner } from 'tamagui'
import React, { useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Check, ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import account from '../../../contract/modules/account'
import delegateManager from '../../../lib/delegate-manager'
import usernames from '../../../contract/modules/usernames'
import { Utils } from '../../../utils'
import client, { hermesClient } from '../../../data/apollo'
import { GET_MY_PROFILE } from '../../../utils/queries'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import Toast from 'react-native-toast-message'
import { aptos } from '../../../contract'
import * as Haptics from 'expo-haptics'
import { Effect, Either } from 'effect'
import BaseButton from '../../../components/ui/buttons/base-button'
import { getPhoneBook } from '../../../lib/hermes-client/queries'
import hermes from '../../../contract/modules/hermes'
import posti from '../../../lib/posti'
import { Keyboard, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

// The seed phrase will be a list of 12 words each separated by a space
const schema = z.object({
    seedPhrase: z.string().refine((value) => {
        const words = value.split(' ')
        return words.length === 12
    })
})

type TSchema = z.infer<typeof schema>

const SeedPhrase = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [focused, setFocused] = React.useState(false)
    const textAreaRef = useRef<TextInput>(null)

    const handleBlur = () => {
        setFocused(false)
        textAreaRef.current?.blur()
    }

    const form = useForm<TSchema>({
        resolver: zodResolver(schema)
    })

    const goBack = () => {
        router.replace('/onboard/signin')
    }

    const goToUsername = () => { // IF USER DOESN'T HAVE A USERNAME YET
        router.replace('/onboard/username')
    }

    const goToProfile = () => {
        router.replace('/onboard/profile')
    }

    const goToFeed = () => {
        router.replace('/(tabs)/feed/home')
    }

    const handleSubmit = async (values: TSchema) => {
        Haptics.selectionAsync()
        const seedPhrase = values.seedPhrase
        setLoading(true)
        try {
            await delegateManager.fromMnemonic(seedPhrase)
            console.log(delegateManager.owner)

            await account.markAsImported()

            try { 

                const profile = await client.query({
                    query: GET_MY_PROFILE,
                    variables: {
                        address: delegateManager.owner!
                    }
                })

                if (profile.data.account) {
                    await account.markProfileAsRegistered()
                }

                await account.markAsRegistered()

                if (account.isProfileRegistered) {
                    const canDelegate = await account.canDelegate()
                    if (canDelegate) {
                        setLoading(false)
                        goToFeed()
                        return
                    }
                }

                const username = await usernames.getUsername()

                if (!username) {
                    setLoading(false)
                    goToUsername()
                    return
                }

                delegateManager.setUsername(username)

                const userAccount = await account.getAccount()


                if (!userAccount && !username) {
                    goToUsername()
                    setLoading(false)
                    return
                }

                if (!userAccount && username) {
                    delegateManager.setUsername(username)
                    const resultEither = await account.setupWithSelfDelegate()
                    Either.match(resultEither, {
                        onLeft(left) {
                            console.log('Delegate failed to setup', left)
                            posti.capture("Delegate failed to setup", {
                                left,
                                delegate: delegateManager.account?.address().toString(),
                                owner: delegateManager.owner
                            })
                            throw left
                        },
                        onRight: async (right) => {
                            console.log('Delegate setup')
                            if (account.isProfileRegistered) {
                                goToFeed()
                                return
                            }
                            setLoading(false)
                            goToProfile()
                        },
                    })
                    return 
                }







                const registerDelegateEither = await account.registerAsSelfDelegate()

                await Either.match(registerDelegateEither, {
                    onLeft(left) {
                        console.log('Delegate failed to register', left)
                        posti.capture("Delegate failed to register", {
                            left,
                            delegate: delegateManager.account?.address().toString(),
                            owner: delegateManager.owner
                        })
                        Toast.show({
                            type: 'error',
                            text1: 'Uh oh!',
                            text2: 'Failed to setup account, please try again.'
                        })
                    },
                    onRight: async (right) => {
                        console.log('Delegate registered')
                        if (account.isProfileRegistered) {
                            goToFeed()
                            return
                        }
                        setLoading(false)
                        goToProfile()
                    },
                })


                return


            }
            catch (e) {
                posti.capture("Failed to complete setup", {
                    error: e
                })
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                Toast.show({
                    type: 'error',
                    text1: 'Unable to complete setup',
                    text2: 'Please try again later.'
                })
                setLoading(false)
                console.log(`SOMETHING WENT WRONG:: ${e}`)
            }
        }
        catch (e) {
            posti.capture("Failed to verify seed phrase", {
                error: e
            })
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            console.log(`SOMETHING WENT WRONG:: ${e}`)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to verify seed phrase'
            })
        }
        finally {
            setLoading(false)
        }
    }

    const handleError = (error: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        console.log(`SOMETHING WENT WRONG:: ${error}`)
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Please enter a valid seed phrase.'
        })

    }

    return (
        <View px={20} flex={1} pb={20} backgroundColor={"$background"}>
            <View w="100%" columnGap={20} >
                <UnstyledButton callback={goBack} icon={<ChevronLeft/>} label={"Back"}/>
            </View>
            <View
                alignItems='center'
                justifyContent='space-between'
                flex={1}
                w="100%"
            >
                <View w="100%" rowGap={10} >
                    <Heading color={"$text"}>
                        Seed Phrase
                    </Heading>
                    <Controller
                        control={form.control}
                        name="seedPhrase"
                        render={({ field }) => {
                            return (
                                <>
                                <TextArea
                                        ref={textAreaRef}
                                    backgroundColor={"$colorTransparent"}
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    numberOfLines={20}
                                    fontWeight={"$2"}
                                    fontSize={"$sm"}
                                    height={100}
                                    w={'100%'}
                                        onFocus={() => setFocused(true)}
                                    placeholder='Enter your seed phrase here...'
                                        blurOnSubmit
                                        onSubmitEditing={Keyboard.dismiss}
                                />
                                    {
                                        Platform.OS === 'ios' && focused && (

                                            <XStack w="100%" >
                                                <BaseButton
                                                    width={100}
                                                    size={"$2"}
                                                    onPress={handleBlur}
                                                    borderRadius={20}
                                                    icon={<Check />}
                                                >
                                                    <Text>
                                                        Done
                                                    </Text>
                                                </BaseButton>
                                            </XStack>
                                        )
                                    }
                                </>
                            )
                        }}
                    />
                </View>
                <KeyboardAvoidingView style={{
                    width: '100%',

                }} >
                    <BaseButton
                        loading={loading}
                        onPress={form.handleSubmit(handleSubmit, handleError)}
                        w="100%"
                    >
                        <Text>
                            Continue
                        </Text>
                    </BaseButton>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

export default SeedPhrase