import { View, Text, Heading, Button } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const FundDelegate = () => {
    const insets = useSafeAreaInsets()

    const router = useRouter()

    const goToNext = () => {
        router.push('/(tabs)/feed/home')
    }

    return (
        <View flex={1} pt={insets.top} pb={insets.bottom} px={20} justifyContent='space-between' >
            <View rowGap={20} >
                <Heading size="$8" >
                    Fund Delegate
                </Heading>
                <Text>
                    Your delegate needs a small amount of APT to get started.
                    This will be used to pay for gas fees when submitting posts and messages on your behalf.
                </Text>
            </View>
            <View w="100%" rowGap={20} >
                <Button>
                    <Text>
                        Fund
                    </Text>
                    <Text>
                        0.1 APT
                    </Text>
                </Button>
                <Button onPress={goToNext} >
                    Skip
                </Button>
            </View>
        </View>
    )
}

export default FundDelegate