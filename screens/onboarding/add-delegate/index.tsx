import { View, Text, Heading, TextArea, Button } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const AddDelegate = () => {
    const insets = useSafeAreaInsets()

    const router = useRouter()

    const goToNext = () => {
        router.push('/onboard/fund-delegate')
    }

    return (
        <View pt={insets.top} pb={insets.bottom} px={20} flex={1} justifyContent='space-between' >
            <View w="100%" rowGap={20} >
                <Heading size="$8" >
                    Add a Delegate
                </Heading>

                <TextArea
                    placeholder='Your delegate recovery phrase'
                    fontSize={16}
                    value={"apple banana cat dog elephant frog goat horse iguana jellyfish kangaroo lion monkey"}
                />
                <Text>
                    This is the recovery phrase for this device. Be sure to keep it safe and secure.
                    Your delegate can send posts and messages on your behalf.
                </Text>
            </View>
            <Button onPress={goToNext} >
                Add Delegate
            </Button>

        </View>
    )
}

export default AddDelegate