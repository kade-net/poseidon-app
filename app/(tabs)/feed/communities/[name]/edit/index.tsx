import { View, Text, YStack } from 'tamagui'
import React from 'react'
import EditCommunity from '../../../../../../screens/tabs/communities/edit'
import { Stack } from 'expo-router'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'

const index = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <CommunitiesEditTopBar {...props} />
                    },
                }}
            />
            <EditCommunity />
        </>
    )
}

export default index