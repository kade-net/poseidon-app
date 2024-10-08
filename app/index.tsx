import { Redirect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React from 'react'
import * as SecureStore from 'expo-secure-store';
import account from '../contract/modules/account';
import delegateManager from '../lib/delegate-manager';

function index() {

    const nextScreen = 
        '/onboard'

    return (
        <Redirect
            href={nextScreen}
        />
    )
}

export default index