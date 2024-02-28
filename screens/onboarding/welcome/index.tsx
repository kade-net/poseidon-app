import { Link, router, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, View } from 'tamagui'
import petra from '../../../lib/wallets/petra'
import delegateManager from '../../../lib/delegate-manager'


const WelcomeScreen = () => {
    const insets = useSafeAreaInsets()
    const rounter = useRouter()
    useEffect(() => {
        (async () => {
            await delegateManager.init()
        })()
    }, [])
    const goToNext = async () => {
        router.push('/onboard/kade-connect/scan')
        // try {
        //     await petra.connect()
        // }
        // catch (e) {
        //     console.log(`SOMETHING WENT WRONG:: ${e}`)
        // }
        // await petra.connect()
    }
    return (
        <View w="100%" pb={insets.bottom} alignItems='center' justifyContent='space-between' flex={1} px={20} >
            <View h="80%" w="100%" alignItems='center' justifyContent='center' >
                <View w="$1" h="$1" bg="$red10" transform={[
                    {
                        translateY: 50
                    }
                ]} >

                </View>
            </View>


            <Button w="100%" onPress={goToNext}  >
                Get Started
            </Button>

        </View >
    )
}

export default WelcomeScreen
