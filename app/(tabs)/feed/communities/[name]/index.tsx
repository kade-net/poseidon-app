import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import CommunityFeed from '../../../../../screens/tabs/communities/community-feed'

const CommunityFeedScreen = () => {
    const params = useLocalSearchParams()
    const communityName = params.name as string
    return (
        <CommunityFeed name={communityName} />
    )
}

export default CommunityFeedScreen