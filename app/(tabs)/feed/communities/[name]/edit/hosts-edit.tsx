import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'
import HostsEdit from '../../../../../../screens/tabs/communities/edit/hosts'

const HostsScreen = () => {
    return (
        <>
            <Stack.Screen options={{
                header(props) {
                    return <CommunitiesEditTopBar prevScreen='Hosts' {...props} />
                }
            }} />
            <HostsEdit />
        </>
    )
}

export default HostsScreen