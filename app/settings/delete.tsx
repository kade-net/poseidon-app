import { View, Text } from 'tamagui'
import React from 'react'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../components/ui/navigation/top-bar-with-back'
import Delete from '../../screens/settings/delete'

const DeleteScreen = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Delete Account'

                        />
                    },
                    headerShown: true
                }}
            />
            <Delete />
        </>
    )
}

export default DeleteScreen