import { View, Text, Heading, Avatar, Separator, ScrollView, YStack } from 'tamagui'
import React, { memo, useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { ArrowLeft, Dot, MoreHorizontal } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import FeedImage from '../../../../components/ui/feed/image'
import { PublicationQuery } from '../../../../__generated__/graphql'
import Reactions from '../../../../components/ui/feed/reactions'
import PublicationStats from '../../../../components/ui/feed/publication-stats'
import PublicationComments from './publication'
import Publication from './publication'
dayjs.extend(relativeTime)

interface Props {
    data: PublicationQuery
}

const PostDetail = (props: Props) => {
    const { data } = props

    return (
        <YStack h="100%" w="100%" flex={1} backgroundColor={"$background"} >
            <Publication
                data={data}
                publication_ref={data.publication?.publication_ref!}
            />
        </YStack>
    )
}

export default memo(PostDetail)