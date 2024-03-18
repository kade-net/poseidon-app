import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'
import Description from '../../../../../../screens/tabs/communities/edit/description'

const DescriptionScreen = () => {
    return (
        <>
            <Stack.Screen options={{
                header(props) {
                    return <CommunitiesEditTopBar prevScreen='Description' {...props} />
                }
            }} />
            <Description />
        </>
    )
}

export default DescriptionScreen