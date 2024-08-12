import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail } from '@tamagui/lucide-icons'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { Input, Text, useTheme, XStack, YStack } from 'tamagui'
import { z } from 'zod'
import BaseButton from '../../../components/ui/buttons/base-button'
import { useRouter } from 'expo-router'
import { Clerk } from '@clerk/clerk-js'
import * as Haptics from 'expo-haptics'
import * as Burnt from 'burnt'
import { convergenceClient } from '../../../data/apollo'
import { ADD_EMAIL } from '../../../lib/convergence-client/queries'
import OtpCodeForm from './otp-code-form'
import { SceneProps } from '../../profiles/tabs/common'
import OtpForm from './otp-form'
import EmailForm from './email-form'
import { TabView } from 'react-native-tab-view'
import { verificationFormContext } from './context'

const clerk = new Clerk(__DEV__ ? 'pk_test_bGVuaWVudC1wYXJyb3QtNDkuY2xlcmsuYWNjb3VudHMuZGV2JA' : ''); // TODO: add prod public key

const schema = z.object({
    email: z.string().email(),
    code: z.string().length(6).optional()
})

type P = z.infer<typeof schema>

const Email = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [tabRoutes] = useState([
        {
            key: 'email',
            title: 'Email',
        },
        {
            key: 'code',
            title: 'Code',
        }
    ])
    const router = useRouter()
    const theme = useTheme()

    const goBack = () => {
        router.replace('/onboard')
    }

    const [codeSent, setCodeSent] = React.useState(false)
    const [sendingCode, setSendingCode] = React.useState(false)
    const verifyingCode = React.useState(false)
    const form = useForm<P>({
        resolver: zodResolver(schema)
    })


    const renderScene = useCallback((props: SceneProps) => {
        const { route } = props
        switch (route.key) {
            case 'email':
                return <EmailForm {...props} />
            case 'code':
                return <OtpForm {...props} />
            default:
                return null
        }
    }, [currentIndex])

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: theme.background.val
            }}
            behavior={Platform.select({
                ios: 'padding',
                android: 'height'
            })}
            keyboardVerticalOffset={Platform.select({
                ios: 60,
                android: 0
            })}
        >
            <verificationFormContext.Provider value={{ form, codeSent, goBack }}>
                <TabView
                    navigationState={{ index: currentIndex, routes: tabRoutes }}
                    renderScene={renderScene}
                    onIndexChange={setCurrentIndex}
                    renderTabBar={() => null}

                />
            </verificationFormContext.Provider>
        </KeyboardAvoidingView>
    )
}

export default Email