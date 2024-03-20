import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WelcomeScreen from '../../screens/onboarding/welcome'
import account from '../../contract/modules/account'
import delegateManager from '../../lib/delegate-manager'
import { Redirect } from 'expo-router'

const Welcome = () => {
    const nextScreen =
        account.isProfileRegistered ? '/(tabs)/feed/home' :
            account.isAccountRegistered ? '/onboard/profile' :
                delegateManager.isDeligateRegistered ? '/onboard/profile' :
                    undefined

    if (nextScreen) return <Redirect href={nextScreen} />
    return (
        <WelcomeScreen />
    )
}

export default Welcome
