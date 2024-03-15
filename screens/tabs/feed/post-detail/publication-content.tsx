import { View, Text, YStack, Heading, Avatar, Separator } from 'tamagui'
import React, { memo } from 'react'
import { PublicationQuery } from '../../../../__generated__/graphql'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { ArrowLeft, Dot, MoreHorizontal } from '@tamagui/lucide-icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import FeedImage from '../../../../components/ui/feed/image'
import PublicationStats from '../../../../components/ui/feed/publication-stats'
import Reactions from '../../../../components/ui/feed/reactions'
import { Utils } from '../../../../utils'
dayjs.extend(relativeTime)

interface Props {
    data: PublicationQuery
}
const PublicationContent = (props: Props) => {
    const { data } = props

    const router = useRouter()

    const goBack = () => {
        router.back()
    }
    return (
        <YStack w="100%" >

            <View w="100%" flexDirection='row' alignItems='center' columnGap={50} mb={20} >
                <TouchableOpacity onPress={goBack} >
                    <ArrowLeft />
                </TouchableOpacity>
                <Heading
                    size={"$md"}
                >
                    Conversation
                </Heading>
            </View>
            <View w="100%">

                <View w="100%" flexDirection='row' justifyContent='space-between'  px={Utils.dynamicWidth(3)}>
                    <View
                        flexDirection='row'
                        columnGap={10}
                    >
                        <Avatar circular  >
                            <Avatar.Image
                                accessibilityLabel='Profile Picture'
                                src={data?.publication?.creator?.profile?.pfp as string}
                            />
                            <Avatar.Fallback
                                backgroundColor={'$pink10'}
                            />
                        </Avatar>
                        <View>
                            <Text fontFamily={"$heading"} fontWeight={"$4"} fontSize={"$sm"}  color={"$text"}>
                                {data?.publication?.creator?.profile?.display_name}
                            </Text>
                            <View flexDirection='row' alignItems='center' columnGap={1} >

                                <Text  color={"$sideText"} fontFamily={"$heading"} fontSize={"$sm"} >
                                    @{data?.publication?.creator?.username?.username}
                                </Text>
                                <Dot
                                    color={'$sideText'}
                                />
                                <Text color={"$sideText"} >
                                    {
                                        dayjs(data?.publication?.timestamp).fromNow()
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <MoreHorizontal />
                    </TouchableOpacity>
                </View>
                <View w="100%" py={10}  px={Utils.dynamicWidth(3)}>
                    <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"}
                        mb={
                            ((data?.publication?.content?.media?.length ?? 0) > 0) ? 20 : 0
                        }
                    >
                        {data?.publication?.content?.content}
                    </Text>
                    <View flexDirection="row" flexWrap="wrap" w="100%" columnGap={10} rowGap={10} >
                        {
                            data?.publication?.content?.media?.filter((media: Entities.Media) => media?.type?.includes("image"))?.map((media: Entities.Media) => {
                                return (
                                    <FeedImage
                                        image={media?.url}
                                        key={media?.url}
                                    />
                                )
                            })
                        }
                    </View>
                </View>

                <View rowGap={10}>

                    <Separator />
                    <PublicationStats
                        initialStats={data.publication?.stats ? {
                            ...data.publication.stats,
                            ref: data.publication.publication_ref!
                        } : undefined}
                        publication_ref={data.publication?.publication_ref!}
                    />
                    <Separator  width={Utils.dynamicWidth(100)}/>
                    <Reactions
                        showNumbers={false}
                        initialStats={data.publication?.stats ? {
                            ...data.publication.stats,
                            ref: data.publication.publication_ref!
                        } : undefined}
                        publication_ref={data.publication?.publication_ref!}
                    />
                    <Separator />
                </View>
            </View>
        </YStack>
    )
}

export default memo(PublicationContent)