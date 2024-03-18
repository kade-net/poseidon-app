import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../../components/ui/navigation/top-bar-with-back'
import Pfp from '../../../../screens/profiles/edit/pfp'

const PfpScreen = () => {
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
            <Pfp />
        </>
    )
}

export default PfpScreen