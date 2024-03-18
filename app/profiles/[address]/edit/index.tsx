import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../../components/ui/navigation/top-bar-with-back'
import Edit from '../../../../screens/profiles/edit'

const index = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Edit Profile'
                        />
                    }
                }}

            />
            <Edit />
        </>
    )
}

export default index