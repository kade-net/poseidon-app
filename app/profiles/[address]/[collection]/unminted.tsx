import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useGlobalSearchParams } from 'expo-router'
import TopBarWithBack from '../../../../components/ui/navigation/top-bar-with-back'
import { useQuery } from 'react-query'
import collected from '../../../../contract/modules/collected'
import Unminted from '../../../../screens/profiles/collection/unminted'

const UnmintedScreen = () => {
    const params = useGlobalSearchParams()
    const collection_id = params['collection'] as string
    const address = params['address'] as string

    const collection = useQuery({
        queryKey: ['collection', collection_id],
        queryFn: () => collected.getCollection(collection_id, address)
    })

    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return (
                            <TopBarWithBack
                                navigation={props.navigation}
                                title={
                                    collection?.data?.collection_name ?? 'Unminted'
                                }
                            />
                        )
                    },
                    headerShown: true
                }}
            />
            <Unminted />
        </>
    )
}

export default UnmintedScreen