import { View, Text } from 'react-native'
import React from 'react'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'
import { Stack } from 'expo-router'
import CommunityImageEdit from '../../../../../../screens/tabs/communities/edit/image'

const ImageScreen = () => {
    return (
        <>
            <Stack.Screen options={{
                header(props) {
                    return <CommunitiesEditTopBar prevScreen='Community Image' {...props} />
                }
            }} />
            <CommunityImageEdit />
        </>
    )
}

export default ImageScreen