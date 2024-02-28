import { Redirect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React from 'react'
import * as SecureStore from 'expo-secure-store';

function index() {
    const deligateStatus = SecureStore.getItem('deligate')

    const nextScreen = deligateStatus == 'registered' ? '/onboard/profile' : '/onboard' as const

    return (
        <Redirect
            href={nextScreen as any}
        />
    )
}

export default index