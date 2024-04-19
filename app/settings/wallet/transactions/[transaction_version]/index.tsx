import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import TopBarWithBack from '../../../../../components/ui/navigation/top-bar-with-back'
import Transaction from '../../../../../screens/settings/petra/transaction'

const index = () => {
    const params = useLocalSearchParams()
    const transaction_version = params['transaction_version'] as string
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title='Transaction Details'
                        />
                    }
                }}
            />
            <Transaction transaction_version={transaction_version} />
        </>
    )
}

export default index