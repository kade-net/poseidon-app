import { View, Text, Button, Heading, TextArea } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import account from '../../../contract/modules/account'
import delegateManager from '../../../lib/delegate-manager'
import usernames from '../../../contract/modules/usernames'

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

    const form = useForm<TSchema>({
        resolver: zodResolver(schema)
    })

    const goBack = () => {
        router.back()
    }

    const goToUsername = () => { // IF USER DOESN'T HAVE A USERNAME YET
        router.push('/onboard/username')
    }

    const goToProfile = () => {
        router.push('/onboard/profile')
    }

    const goToFeed = () => {
        router.push('/(tabs)/feed/home')
    }

    const handleSubmit = async (values: TSchema) => {
        const seedPhrase = values.seedPhrase

        try {
            await delegateManager.fromMnemonic(seedPhrase)
            console.log(delegateManager.owner)

            await account.markAsImported()

            try {
                const username = await usernames.getUsername()

                if (!username) {
                    goToUsername()
                    return
                }

                delegateManager.setUsername(username)

                const userAccount = await account.getAccount()

                if (!userAccount) {
                    try {
                        await account.setupWithSelfDelegate()
                    }
                    catch (e) {
                        console.log(`SOMETHING WENT WRONG:: ${e}`)
                    }
                    return
                }

                await account.markAsRegistered()

                if (account.isProfileRegistered) {
                    goToFeed()
                    return
                }

                goToProfile()
                return


            }
            catch (e) {
                console.log(`SOMETHING WENT WRONG:: ${e}`)
            }
        }
        catch (e) {
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
    }

    return (
        <View pt={insets.top} pb={insets.bottom} flex={1} >
            <View w="100%" columnGap={20} >
                <Button
                    icon={<ChevronLeft />}
                    w={100}
                    onPress={goBack}
                >
                    Back
                </Button>

            </View>
            <View
                flex={1}
                alignItems='center'
                justifyContent='space-between'
            >
                <View w="100%" rowGap={10} >
                    <Heading>
                        Seed Phrase
                    </Heading>
                    <Controller
                        control={form.control}
                        name="seedPhrase"
                        render={({ field }) => {
                            return (
                                <TextArea
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    numberOfLines={20}
                                    height={100}
                                    w={'100%'}
                                    placeholder='Enter your seed phrase here...'
                                />
                            )
                        }}
                    />
                </View>
                <Button onPress={form.handleSubmit(handleSubmit)} w="100%" >
                    Done
                </Button>
            </View>
        </View>
    )
}

export default SeedPhrase