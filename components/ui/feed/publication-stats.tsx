import { View, Text, useTheme, Button, Spinner } from 'tamagui'
import React, { memo, useTransition } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Heart, MessageSquare, MessageSquarePlus, Repeat } from '@tamagui/lucide-icons'
import { PublicationStats as TPublicationStats } from '../../../__generated__/graphql'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, GET_PUBLICATION_INTERACTIONS_BY_VIEWER, GET_PUBLICATION_STATS } from '../../../utils/queries'
import client from '../../../data/apollo'
import delegateManager from '../../../lib/delegate-manager'
import publications from '../../../contract/modules/publications'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import useDisclosure from '../../hooks/useDisclosure'
import PublicationEditor from '../editor/publication-editor'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
    initialStats?: TPublicationStats,
    publication_ref?: string
}

const PublicationStats = (props: Props) => {
    const { initialStats, publication_ref } = props
    const theme = useTheme()
    const publicationStatsQuery = useQuery(GET_PUBLICATION_STATS, {
        variables: {
            publication_ref: publication_ref!
        },
        skip: !publication_ref,
        fetchPolicy: 'cache-and-network'
    })





    return (
        <View
            flexDirection='row'
            alignItems='center'
            w="full"
            columnGap={10}
        >
            <View flexDirection='row' columnGap={10} >
                <Text fontWeight={"600"} color={'$sideText'}>
                    {
                        publicationStatsQuery?.data?.publicationStats?.reposts ?? initialStats?.reposts ?? 0
                    }
                </Text>
                <Text color={'$sideText'} >
                    Reposts
                </Text>
            </View>

            <View flexDirection='row' columnGap={10} >
                <Text fontWeight={"600"} color={'$sideText'}>
                    {
                        publicationStatsQuery?.data?.publicationStats?.quotes ?? initialStats?.quotes ?? 0
                    }
                </Text>
                <Text color={'$sideText'} >
                    Quotes
                </Text>
            </View>


            <View flexDirection='row' columnGap={10} >
                <Text fontWeight={"600"}  color={'$sideText'}>
                    {
                        publicationStatsQuery?.data?.publicationStats?.comments ?? initialStats?.comments ?? 0
                    }
                </Text>
                <Text color={'$sideText'} >
                    Comments
                </Text>

            </View>


            <View flexDirection='row' columnGap={10} >
                <Text fontWeight={"600"} color={'$sideText'}>
                    {
                        publicationStatsQuery?.data?.publicationStats?.reactions ?? initialStats?.reactions ?? 0
                    }
                </Text>
                <Text color={'$sideText'} >
                    Likes
                </Text>
            </View>




        </View>
    )
}

export default memo(PublicationStats)

