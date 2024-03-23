import { View, Text } from 'react-native'
import React from 'react'
import Followers from '../../../screens/profiles/followers'
import { useGlobalSearchParams } from 'expo-router'

const FollowersScreen = () => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string ?? null
    return (
        <Followers address={address} />
    )
}

export default FollowersScreen