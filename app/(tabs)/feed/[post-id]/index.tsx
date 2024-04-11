import { View, Text, Spinner } from 'tamagui'
import React from 'react'
import PostDetail from '../../../../screens/tabs/feed/post-detail'
import { useGlobalSearchParams, useLocalSearchParams, useSegments } from 'expo-router'
import { isString } from 'lodash'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATION } from '../../../../utils/queries'

const PostDetailsScreen = () => {
    const params = useGlobalSearchParams()
    const ref = params['post-id'] as string
    const publicationQuery = useQuery(GET_PUBLICATION, {
        variables: {
            postRef: ref
        }
    })


    return (
        <View
            flex={1}
            w="100%"
            h="100%"
            backgroundColor={"$background"}
        >
            {
                publicationQuery?.loading ? <View
                    w="100%"
                    alignItems='center'
                    justifyContent='center'
                >
                    <Spinner />
                </View> :
                    <>
                        {publicationQuery.data && <PostDetail
                            data={publicationQuery.data}
                        />}
                    </>
            }
        </View>
    )
}

export default PostDetailsScreen