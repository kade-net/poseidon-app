import { View, Text } from 'react-native'
import React from 'react'
import CollectionOwners from '../../../../screens/profiles/collection/owners'
import { Stack, useGlobalSearchParams } from 'expo-router'
import { useQuery } from 'react-query'
import collected from '../../../../contract/modules/collected'
import TopBarWithBack from '../../../../components/ui/navigation/top-bar-with-back'

const OwnersScreen = () => {
    const params = useGlobalSearchParams()
    const collection_id = params['collection'] as string
    const address = params['address'] as string

    const collection = useQuery({
        queryKey: ['collection', collection_id],
        queryFn: () => collected.getCollection(collection_id, address),
    })

    console.log('collection::', collection_id)

    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return (
                            <TopBarWithBack
                                navigation={props.navigation}
                                title={collection?.data?.collection_name ?? 'Untitled'}
                            />
                        )
                    },
                    headerShown: true
                }}
            />
            <CollectionOwners
                address={address}
                collection_id={collection_id}
            />
        </>
    )
}

export default OwnersScreen