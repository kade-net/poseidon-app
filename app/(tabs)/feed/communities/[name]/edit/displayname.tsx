import React from 'react'
import { YStack } from 'tamagui'
import DisplayName from '../../../../../../screens/tabs/communities/edit/display-name'
import { Stack } from 'expo-router'
import CommunitiesEditTopBar from '../../../../../../screens/tabs/communities/edit/top-bar'

const DisplayNameScreen = () => {
    return (
        <>
            <Stack.Screen options={{
                header(props) {
                    return <CommunitiesEditTopBar prevScreen='Display Name' {...props} />
                }
            }} />
            <DisplayName />
        </>
    )
}

export default DisplayNameScreen