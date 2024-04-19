import { View, Text } from 'react-native'
import React from 'react'
import Recipients from '../../../screens/settings/petra/recipients'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../components/ui/navigation/top-bar-with-back'

const recipients = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Recipients'
                        />
                    }
                }}
            />
            <Recipients />
        </>
    )
}

export default recipients