import { Redirect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React from 'react'
import * as SecureStore from 'expo-secure-store';
import account from '../contract/modules/account';
import delegateManager from '../lib/delegate-manager';

function index() {

    const nextScreen =
        account.isProfileRegistered ? '/(tabs)/feed/home' :
            account.isAccountRegistered ? '/onboard/profile' :
                delegateManager.isDeligateRegistered ? '/onboard/profile' :
                    '/onboard'

    console.log("Next Screen :: ", nextScreen)
    return (
        <Redirect
            href={nextScreen as any}
        />
    )
}

export default index