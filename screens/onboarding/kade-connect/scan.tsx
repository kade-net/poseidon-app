import { View, Text, Spinner, Heading, Button } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera/next'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import sessionManager from '../../../lib/session-manager'
import delegateManager from '../../../lib/delegate-manager'
import { useRouter } from 'expo-router'
import { ChevronLeft } from '@tamagui/lucide-icons'
import account from '../../../contract/modules/account'
import { Utils } from '../../../utils'
import UnstyledButton from '../../../components/ui/buttons/unstyled-button'
import client from '../../../data/apollo'
import { GET_MY_PROFILE } from '../../../utils/queries'
import Toast from 'react-native-toast-message'

const Scan = () => {
    const insets = useSafeAreaInsets()
    const [permission, requestPermission] = useCameraPermissions()
    const [data, setData] = useState<null | BarCodeScanningResult>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const goToProfile = () => {
        router.replace('/onboard/profile')
    }

    const goToFeed = () => {
        router.replace('/(tabs)/feed/home')
    }

    useEffect(() => {
        (async () => {
            try {
                await requestPermission()
            }
            catch (e) {
                console.log(`SOMETHING WENT WRONG:: ${e}`)
            }

        })()
    }, [])

    const handleBarCodeScanned = async (data: BarCodeScanningResult) => {
        setLoading(true)
        console.log(data)
        setData(data)
        sessionManager.startSession(data.data)
        const delegateStatus = await sessionManager.sendDelegateAddress()
        // TODO: smartly handle the delegate status
        if (delegateStatus && delegateStatus?.delegate_linked) {
            await delegateManager.setUsername(delegateStatus.username)
            await delegateManager.setOwner(delegateStatus.owner)
            await delegateManager.markAsRegistered()
            console.log("Delegate Manager Owner::", delegateManager.owner)
            const profileData = await client.query({
                query: GET_MY_PROFILE,
                variables: {
                    address: delegateManager.owner!
                }
            })
            console.log("Profile::", profileData)
            if (account.isAccountRegistered) {

                if (account.isProfileRegistered) {

                    goToFeed()
                    return
                }

                goToProfile()
            }
            account.markAsRegistered()

            if (account.isProfileRegistered) {
                const profileData = await client.query({
                    query: GET_MY_PROFILE,
                    variables: {
                        address: delegateManager.owner!
                    }
                })
                goToFeed()
                return
            }
            if (profileData.data) {
                account.markProfileAsRegistered()
                goToFeed()
                return
            }
            goToProfile()
            return
        }
        sessionManager.checkSessionStatus()
            .then(async () => {
                try {

                    await delegateManager.linkAccount(sessionManager.session)

                    const profileDataQuery = await client.query({
                        query: GET_MY_PROFILE,
                        variables: {
                            address: delegateManager.owner!
                        }
                    })

                    if (profileDataQuery.data.account?.profile) {
                        await account.markProfileAsRegistered()
                        await account.markAsRegistered()

                    }

                    if (account.isProfileRegistered) {
                        goToFeed()
                        return
                    }

                    router.push('/onboard/profile')
                }
                catch (e) {

                    console.log(`SOMETHING WENT WRONG:: ${e}`)
                    if (e instanceof Error) {
                        console.log("Error::", e.stack)
                    }
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Something went wrong'
                    })
                }
                finally {
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log(`SOMETHING WENT WRONG:: ${e}`)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong'
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const goBack = () => {
        router.replace('/onboard/signin')
    }

    return (
        <View pt={insets.top} pb={insets.bottom} flex={1}  backgroundColor={"$background"} paddingHorizontal={Utils.dynamicWidth(5)}>
            <View w="100%" >
                <UnstyledButton callback={goBack} icon={<ChevronLeft/>} label={"Back"}/>
            </View>
            <View justifyContent='center' flex={1} >
                <View w="100%" alignItems='center' rowGap={20} >
                    <View alignItems='center' rowGap={10} >
                        <Heading color={"$text"} >
                            Step 1
                        </Heading>
                        <Text textAlign='center' color={"$text"} >
                            go to <Text color={"$COAText"} >connect.poseidon.ac</Text> on your desktop browser.
                        </Text>
                    </View>
                    <View alignItems='center' rowGap={10} >
                        <Heading color={"$text"}>
                            Step 2
                        </Heading>
                        <Text textAlign='center' color={"$text"} >
                            Scan the QR Code.
                        </Text>
                        <View w={300} h={300} borderRadius={30} overflow='hidden' >
                            {(permission && permission.granted) && <CameraView
                                style={{ flex: 1 }}
                                onBarcodeScanned={data ? undefined : handleBarCodeScanned}
                            />}
                        </View>
                    </View>
                    <View alignItems='center' rowGap={10} >
                        <Heading color={"$text"}>
                            Step 3
                        </Heading>
                        <Text textAlign='center' color={"$text"}>
                            Approve connection.
                        </Text>
                    </View>
                    <View>
                        {loading && <Spinner />}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Scan