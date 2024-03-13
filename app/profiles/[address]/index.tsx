import { View, Text } from 'react-native'
import React from 'react'
import ProfileDetails from '../../../screens/profiles'
import { Stack, useGlobalSearchParams } from 'expo-router'

const index = () => {
    const params = useGlobalSearchParams()
    const userAddress = params['address'] as string ?? null
    return (
        <>
            <ProfileDetails
                address={userAddress}
            />
        </>
    )
}

export default index