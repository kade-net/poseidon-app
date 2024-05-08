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
import client, { convergenceClient } from '../../../data/apollo'
import { GET_MY_PROFILE } from '../../../utils/queries'
import Toast from 'react-native-toast-message'
import { useQuery } from '@apollo/client'
import { GET_CONNECTION, UPDATE_CONNECTION } from '../../../lib/convergence-client/queries'
import { isString } from 'lodash'

const Scan = () => {
    const [data, setData] = useState<null | BarCodeScanningResult>(null)
    const [initialized, setInitialized] = useState(false)
    const connectionQuery = useQuery(GET_CONNECTION, {
        variables: {
            connection_id: data?.data!
        },
        skip: !(isString(data?.data) && (data?.data?.length ?? 0) > 5),
        client: convergenceClient,
        pollInterval: 5000,
        notifyOnNetworkStatusChange: true,
        onCompleted: async (_data) => {
            console.log("Data::", _data)
            const registered = delegateManager.isDeligateRegistered
            console.log("Registered::", registered)
            if (_data.connection && !_data.connection.is_intent_created && !registered) {

                try {

                    if (!initialized) {
                        await convergenceClient.mutate({
                            mutation: UPDATE_CONNECTION,
                            variables: {
                                input: {
                                    connection_id: data?.data!,
                                    delegate_address: delegateManager.account?.address().toString()!
                                }
                            }
                        })

                        setInitialized(true)
                    }

                }
                catch (e) {
                    console.log(`SOMETHING WENT WRONG:: ${e}`)
                    // TODO: capture with posti and silently fail
                }

            }

            if (_data.connection && _data.connection.is_intent_created && !registered) {
                const account = await delegateManager.linkAccount(_data?.connection, data?.data!)

                if (!account) {
                    goToProfile()
                }
                else {
                    goToFeed()
                }
            }

            if (_data.connection && _data.connection.is_intent_created && registered) {

                const accountQuery = await client.query({
                    query: GET_MY_PROFILE,
                    fetchPolicy: 'network-only',
                    variables: {
                        address: _data.connection.user_address
                    }
                })

                if (accountQuery?.data?.account?.profile?.pfp) {
                    goToFeed()
                }
                else {
                    goToProfile()
                }
            }


        },
        onError(error) {
            console.log("Error::", error)
        },

    })

    const insets = useSafeAreaInsets()
    const [permission, requestPermission] = useCameraPermissions()
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
        console.log("Bar code scanned::", data)
        setData(data)
    }

    const goBack = () => {
        router.replace('/onboard/signin')
    }

    if (connectionQuery)

    return (
        <View flex={1} backgroundColor={"$background"} paddingHorizontal={20}>
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
                            go to <Text color={"$COAText"} >actions.poseidon.ac</Text> on your desktop browser.
                            Select the <Text color={"$yellow10"} >"Connect Device"</Text> action.
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
                        {(initialized || connectionQuery.loading) && <Spinner />}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Scan