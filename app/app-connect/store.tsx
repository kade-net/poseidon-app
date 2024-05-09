import { ChevronLeft } from '@tamagui/lucide-icons'
import { BarcodeScanningResult, CameraView } from 'expo-camera'
import { useCameraPermissions } from 'expo-image-picker'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Heading, View, YStack, Text, Spinner, useTheme } from 'tamagui'
import appConnectManager from '../../lib/app-connect-manager'
import { useRouter } from 'expo-router'
import { Utils } from '../../utils'

const StoreConnectScreen = () => {


    return (
        <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} p={20} rowGap={20} >
            <YStack w="100%" rowGap={10} >
                <Text>
                    Go to <Text color={'$COAText'} >actions.poseidon.ac</Text> on your desktop to purchase Anchors.
                </Text>
                <Text>
                    From the provided actions, select <Text color={'$COAText'} >Mint Anchors</Text>
                </Text>
                <Text>
                    Select an amount of Anchors to mint and click <Text color={'$COAText'} >Mint</Text>
                </Text>

            </YStack>
            <Text>
                In App Purchases are coming soon!
            </Text>
        </YStack>
    )
}

export default StoreConnectScreen