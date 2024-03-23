import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useGlobalSearchParams } from 'expo-router'
import { H4, XStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import Collection from '../../../../screens/profiles/collection'
import { useQuery } from 'react-query'
import collected from '../../../../contract/modules/collected'

const index = () => {
  const params = useGlobalSearchParams()
  const collection_id = params['collection'] as string
  const address = params['address'] as string
  const collection = useQuery({
    queryKey: ['collection', collection_id],
    queryFn: () => collected.getCollection(collection_id, address),
  })


  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header(props) {
            return (
              <TouchableOpacity onPress={props.navigation.goBack} style={{ width: "100%" }} >

                <XStack p={20} py={20} columnGap={20} alignItems='center' >
                  <ArrowLeft />
                  <H4 textTransform='none' >
                    {collection?.data?.collection_name ?? 'Untitled'}
                  </H4>
                </XStack>
              </TouchableOpacity>
            )
          }
        }}
      />
      <Collection />
    </>
  )
}

export default index