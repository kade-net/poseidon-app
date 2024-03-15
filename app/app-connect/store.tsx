import { ChevronLeft } from '@tamagui/lucide-icons'
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types'
import { CameraView } from 'expo-camera/next'
import { useCameraPermissions } from 'expo-image-picker'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Heading, View, YStack, Text, Spinner } from 'tamagui'
import appConnectManager from '../../lib/app-connect-manager'
import { useRouter } from 'expo-router'

const StoreConnectScreen = () => {
    const [permission, requestPermission] = useCameraPermissions()
    const [data, setData] = React.useState<null | any>(null)
    const [loading, setLoading] = React.useState(false)
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
        setData(data)

        if (data.data) {
            setLoading(true)
            try {

                await appConnectManager.linkSession(data.data)
                router.back()
            }
            catch (e) {
                console.log("Something went wrong:: ", e)
            }
            finally {
                setLoading(false)

            }
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%"
            }}
        >

            <YStack
                flex={1}
                alignItems='center'
                justifyContent='center'
            >
                <View flex={1} >
                    <View justifyContent='center' flex={1} >
                        <View w="100%" alignItems='center' rowGap={20} >
                            <View alignItems='center' rowGap={10} >
                                <Heading >
                                    Step 1
                                </Heading>
                                <Text textAlign='center' >
                                    go to <Text color={"lightgray"} >anchors.kade.network</Text> on your desktop browser.
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
                            <View>
                                {loading && <Spinner />}
                            </View>
                        </View>
                    </View>
                </View>
            </YStack>
        </SafeAreaView>
    )
}

export default StoreConnectScreen