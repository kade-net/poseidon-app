import { View, Text } from 'tamagui'
import React from 'react'
import { useGlobalSearchParams, useLocalSearchParams, useRouter, useSegments } from 'expo-router'

const Connect = () => {
    const router = useRouter()
    const local = useLocalSearchParams()
    const global = useGlobalSearchParams()

    console.log("LOCAL ::", local)
    console.log("GLOBAL ::", global)

    return (
        <View flex={1} alignItems='center' justifyContent='center' >
            <Text>Connectinf</Text>
        </View>
    )
}

export default Connect