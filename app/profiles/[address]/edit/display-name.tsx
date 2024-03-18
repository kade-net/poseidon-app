import { View, Text } from 'tamagui'
import React from 'react'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../../components/ui/navigation/top-bar-with-back'
import DisplayName from '../../../../screens/profiles/edit/display-name'

const DisplayNameScreen = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Display Name'
                        />
                    }
                }}

            />
            <DisplayName />
        </>
    )
}

export default DisplayNameScreen