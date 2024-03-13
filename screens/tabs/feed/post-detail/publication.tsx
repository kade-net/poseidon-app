import { View, Text, Spinner } from 'tamagui'
import React, { memo, useCallback, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATION_COMMENTS } from '../../../../utils/queries'
import BaseContentContainer from '../../../../components/ui/feed/base-content-container'
import { FlatList } from 'react-native'
import { PublicationsQuery } from '../../../../__generated__/graphql'
import PublicationContent from './publication-content'

interface Props {
    publication_ref: string
    data: PublicationsQuery
}

const Publication = (props: Props) => {
    const [currentPage, setCurrentPage] = useState(0)
    const commentsQuery = useQuery(GET_PUBLICATION_COMMENTS, {
        variables: {
            publication_ref: props.publication_ref,
            page: 0,
            size: 20
        },
        onCompleted: console.log
    })

    const handleFetchMore = async () => {
        if ((commentsQuery.data?.publicationComments?.length ?? 0) < 20) {
            console.log("No more publications")
            return
        }
        try {
            const results = await commentsQuery.fetchMore({
                variables: {
                    page: currentPage + 1,
                    size: 20
                }
            })
            const totalPublications = commentsQuery.data?.publicationComments?.length ?? 0

            if (totalPublications <= (currentPage + 1) * 20) {
                console.log("No more publications")
                return
            }

            console.log("Fetched more")

            setCurrentPage((prev) => prev + 1)
        }
        catch (e) {
            console.log("Error fetching more", e)
        }
    }

    const handleFetchTop = async () => {
        console.log("Start reached")
        try {
            await commentsQuery.fetchMore({
                variables: {
                    page: 0,
                    size: 20
                }
            })
            setCurrentPage(0)
        }
        catch (e) {
            console.log("Error fetching more", e)
        }
    }


    const renderPublication = useCallback(({ item }: any) => {
        return (
            <BaseContentContainer
                data={item as any}
            />
        )

    }, [])

    return (
        <View flex={1} w="100%" h="100%" py={5} pl={10} >
            {
                commentsQuery?.loading ? <View
                    w="100%"
                    alignItems='center'
                    justifyContent='center'
                >
                    <Spinner />
                </View> : null
            }
            <FlatList
                ListHeaderComponent={<PublicationContent data={props.data} />}
                refreshing={commentsQuery?.loading}
                // scrollEnabled={false}
                onRefresh={handleFetchTop}
                onEndReached={handleFetchMore}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
                data={commentsQuery?.data?.publicationComments ?? []}
                maxToRenderPerBatch={20}
                initialNumToRender={20}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPublication}
            />
        </View>
    )
}

export default memo(Publication)