import { View, Text } from 'react-native'
import React from 'react'
import Petra from '../../../screens/settings/petra'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../components/ui/navigation/top-bar-with-back'

const index = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header(props) {
                        return (
                            <TopBarWithBack
                                title={'Delegate Wallet'}
                                navigation={props.navigation}
                            />
                        )
                    }
                }}
            />
            <Petra />
        </>
    )
}

export default index