import { View, Text, Spinner } from 'tamagui'
import React, { memo, useCallback, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATION_COMMENTS } from '../../../../utils/queries'
import BaseContentContainer from '../../../../components/ui/feed/base-content-container'
import { FlatList } from 'react-native'
import { PublicationsQuery, SortOrder } from '../../../../__generated__/graphql'
import PublicationContent from './publication-content'
import { isEmpty } from 'lodash'
import account from '../../../../contract/modules/account'
import publications from '../../../../contract/modules/publications'

interface Props {
    publication_ref: string
    data: PublicationsQuery
}

const Publication = (props: Props) => {
    const commentsQuery = useQuery(GET_PUBLICATION_COMMENTS, {
        variables: {
            publication_ref: props.publication_ref,
            page: 0,
            size: 20,
            sort: SortOrder.Asc,
            muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
            hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
        },
        fetchPolicy: "cache-and-network"
    })

    const handleFetchMore = async () => {
        const currentPage = Math.floor(((commentsQuery.data?.publicationComments?.length ?? 0) / 20)) - 1
        if ((commentsQuery.data?.publicationComments?.length ?? 0) < 20) {
            console.log("No more publications")
            return
        }
        try {
            const results = await commentsQuery.fetchMore({
                variables: {
                    page: currentPage + 1,
                    size: 20,
                    publication_ref: props.publication_ref,
                    muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
                    hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
                }
            })
            const totalPublications = commentsQuery.data?.publicationComments?.length ?? 0

            if (totalPublications <= (currentPage + 1) * 20) {
                console.log("No more publications")
                return
            }

            console.log("Fetched more")
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
                    size: 20,
                    publication_ref: props.publication_ref,
                    sort: SortOrder.Asc,
                    // muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
                    // hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
                }
            })
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
        <View flex={1} w="100%" h="100%" py={5} pl={10} backgroundColor={'$background'} >
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
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderPublication}
            />
        </View>
    )
}

export default memo(Publication)