import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalSearchParams } from 'expo-router'
import Following from '../../../screens/profiles/following'

const FollowingScreen = () => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string ?? null
    return (
        <Following
            address={address}
        />
    )
}

export default FollowingScreen