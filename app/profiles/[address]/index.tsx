import { View, Text } from 'react-native'
import React from 'react'
import ProfileDetails from '../../../screens/profiles'
import {Stack, useGlobalSearchParams, useLocalSearchParams} from 'expo-router'

const index = () => {
    const params = useLocalSearchParams()
    const userAddress = params['address'] as string ?? ''
    return (
        <>
            <ProfileDetails
                address={userAddress}
            />
        </>
    )
}

export default index