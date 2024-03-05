import { View, Text } from 'react-native'
import React from 'react'
import PostDetail from '../../../../screens/tabs/feed/post-detail'
import { useGlobalSearchParams, useLocalSearchParams, useSegments } from 'expo-router'
import { isString } from 'lodash'

const PostDetailsScreen = () => {
    const params = useGlobalSearchParams()
    const id = params['post-id']
    return (
        <PostDetail
            id={isString(id) ? id : ""}
        />
    )
}

export default PostDetailsScreen