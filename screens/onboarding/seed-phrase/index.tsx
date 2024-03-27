import { View, Text, Button, Heading, TextArea, XStack, Spinner } from 'tamagui'
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
import { Utils } from '../../../utils'
import client from '../../../data/apollo'
import { GET_MY_PROFILE } from '../../../utils/queries'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import Toast from 'react-native-toast-message'

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
        const seedPhrase = values.seedPhrase
        setLoading(true)
        try {
            await delegateManager.fromMnemonic(seedPhrase)
            console.log(delegateManager.owner)

            await account.markAsImported()

            try {
                const username = await usernames.getUsername()

                if (!username) {
                    setLoading(false)
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
                    finally {
                        setLoading(false)
                    }
                    return
                }

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
                    setLoading(false)
                    goToFeed()
                    return
                }   
                setLoading(false)
                goToProfile()
                return


            }
            catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Unable to get username',
                    text2: 'Failed to get username'
                })
                setLoading(false)
                console.log(`SOMETHING WENT WRONG:: ${e}`)
            }
        }
        catch (e) {
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

    return (
        <View pt={insets.top} px={Utils.dynamicWidth(5)} pb={insets.bottom} flex={1} backgroundColor={"$background"}>
            <View w="100%" columnGap={20} >
                <UnstyledButton callback={goBack} icon={<ChevronLeft/>} label={"Back"}/>
            </View>
            <View
                flex={1}
                alignItems='center'
                justifyContent='space-between'
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
                                <TextArea
                                    backgroundColor={"$colorTransparent"}
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    numberOfLines={20}
                                    fontWeight={"$2"}
                                    fontSize={"$sm"}
                                    height={100}
                                    w={'100%'}
                                    placeholder='Enter your seed phrase here...'
                                />
                            )
                        }}
                    />
                </View>
                <Button disabled={loading} onPress={form.handleSubmit(handleSubmit)} w="100%" backgroundColor={"$button"} color="$buttonText" marginBottom={Utils.dynamicHeight(5)}>
                    {
                        loading ? <XStack columnGap={20} >
                            <Spinner />
                            <Text>Veryfying...</Text>
                        </XStack> : "Done"
                    }
                </Button>
            </View>
        </View>
    )
}

export default SeedPhrase