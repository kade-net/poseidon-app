import { View, Text, YStack } from 'tamagui'
import React from 'react'
import EditCommunity from '../../../../../../screens/tabs/communities/edit'
import { Stack } from 'expo-router'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'
import TopBarWithBack from '../../../../../../components/ui/navigation/top-bar-with-back'

const index = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Edit Community'
                        />
                    },
                }}
            />
            <EditCommunity />
        </>
    )
}

export default index