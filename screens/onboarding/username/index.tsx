import { View, Text, Input, Heading, Button } from 'tamagui'
import React from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const schema = z.object({
    username: z.string().min(3).max(20)
})

type TSchema = z.infer<typeof schema>

const PickUserName = () => {
    const insets = useSafeAreaInsets()
    const form = useForm<TSchema>({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    const goToNext = () => {
        router.push('/onboard/profile')
    }

    return (

        <View pt={insets.top} pb={insets.bottom} flex={1} justifyContent='space-between' px={20} >
            <View w="100%" rowGap={10} >
                <Heading color="white" size='$8' >
                    Pick a username
                </Heading>
                <Input
                    placeholder='Enter username'
                />
            </View>
            <Button onPress={goToNext} >
                Claim Username
            </Button>
        </View>
    )
}

export default PickUserName