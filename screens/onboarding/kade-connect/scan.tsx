import { View, Text, Spinner, Heading } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera/next'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import sessionManager from '../../../lib/session-manager'
import delegateManager from '../../../lib/delegate-manager'
import { useRouter } from 'expo-router'

const Scan = () => {
    const insets = useSafeAreaInsets()
    const [permission, requestPermission] = useCameraPermissions()
    const [data, setData] = useState<null | BarCodeScanningResult>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
        await sessionManager.sendDelegateAddress()
        sessionManager.checkSessionStatus()
            .then(async () => {
                try {

                    await delegateManager.linkAccount(sessionManager.session)
                    // TODO: check if the profile already exists and if it does go directly to the user's home feed
                    router.push('/onboard/profile')
                }
                catch (e) {
                    console.log(`SOMETHING WENT WRONG:: ${e}`)
                }
                finally {
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log(`SOMETHING WENT WRONG:: ${e}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <View pt={insets.top} pb={insets.bottom} justifyContent='center' flex={1} >
            <View w="100%" alignItems='center' rowGap={20} >
                <View alignItems='center' rowGap={10} >
                    <Heading >
                        Step 1
                    </Heading>
                    <Text textAlign='center' >
                        go to <Text color={"lightgray"} >connect.kade.network</Text> on your desktop browser.
                    </Text>
                </View>
                <View alignItems='center' rowGap={10} >
                    <Heading >
                        Step 2
                    </Heading>
                    <Text textAlign='center' >
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
                    <Heading >
                        Step 3
                    </Heading>
                    <Text textAlign='center' >
                        Approve connection.
                    </Text>
                </View>
                <View>
                    {loading && <Spinner />}
                </View>
            </View>
        </View>
    )
}

export default Scan