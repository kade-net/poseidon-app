import { View, Text, Heading, Input, TextArea, Button } from 'tamagui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Plus } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

const Profile = () => {
    const insets = useSafeAreaInsets()

    const router = useRouter()

    const goToNext = () => {
        router.push('/onboard/add-delegate')
    }

    return (
        <View
            pt={insets.top}
            pb={insets.bottom}
            flex={1}
            justifyContent='space-between'
            px={20}
        >
            <View>
                <Heading size="$8" >
                    Create Profile
                </Heading>
                <View py={30} alignItems='center' justifyContent='center' w="100%" >
                    <TouchableOpacity style={{
                        padding: 50,
                        borderWidth: 1,
                        borderColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 100
                    }} >
                        <Plus color="white" />
                    </TouchableOpacity>
                </View>
                <View w="100%" rowGap={10} >
                    <Input
                        placeholder='Display Name'
                    />
                    <TextArea
                        placeholder='Tell us about yourself'

                    />
                </View>
            </View>

            <Button onPress={goToNext} >
                Save Profile
            </Button>

        </View>
    )
}

export default Profile