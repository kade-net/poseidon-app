import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { H3, YStack } from 'tamagui'
import * as LocalAuthentication from 'expo-local-authentication'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import Loading from '../../components/ui/feedback/loading'
import BaseButton from '../../components/ui/buttons/base-button'


const Authenticate = () => {
    const params = useGlobalSearchParams<{
        next: string
    }>()
    const router = useRouter()
    const [authenticating, setAuthenticating] = React.useState(false)

    useEffect(() => {
        authenticate()
    }, [])

    const authenticate = async () => {

        setAuthenticating(true)
        const authResult = await LocalAuthentication.authenticateAsync()
        if (authResult.success) {
            // proceed to the next screen
            if (params?.next) {
                router.push(params.next as any)
            }
        } else {
            setAuthenticating(false)
        }
    }

    if (authenticating) {
        return <Loading
            backgroundColor={'$background'}
            loadingText='Authenticating...'
        />
    }
    return (
        <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' backgroundColor={'$background'} >
            <YStack>
                <H3>
                    Authenticate 🔑
                </H3>
                <Text>
                    Please authenticate to proceed
                </Text>
                <BaseButton
                    onPress={authenticate}
                    loading={authenticating}
                >
                    Authenticate
                </BaseButton>
            </YStack>
        </YStack>
    )
}

export default Authenticate