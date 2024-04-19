import { View, Text } from 'react-native'
import React from 'react'
import Confirm from '../../../screens/settings/petra/confirm'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../components/ui/navigation/top-bar-with-back'

const confirm = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header(props) {
                        return <TopBarWithBack
                            title='Confirm'
                            navigation={props.navigation}

                        />
                    }
                }}
            />
            <Confirm />
        </>
    )
}

export default confirm