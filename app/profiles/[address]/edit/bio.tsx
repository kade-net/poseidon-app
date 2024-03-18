import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import TopBarWithBack from '../../../../components/ui/navigation/top-bar-with-back'
import Bio from '../../../../screens/profiles/edit/bio'

const BioScreen = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Bio'
                        />
                    }
                }}

            />
            <Bio />
        </>
    )
}

export default BioScreen