import "../../../global"
import { Heart, MessageSquare, MoreHorizontal, MoreVertical, Repeat2 } from "@tamagui/lucide-icons";
import { Avatar, Text, View, useTheme } from "tamagui";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { Publication, PublicationStats } from "../../../__generated__/graphql";
import { media } from "@tamagui/config";
import FeedImage from "./image";
import { TouchableOpacity } from "react-native";
import publications from "../../../contract/modules/publications";
// import localStore from "../../../lib/local-store";
import { useEffect, useState } from "react";
import localStore from "../../../lib/local-store";
import { isNull } from "lodash";
import { Link, useRouter } from "expo-router";

dayjs.extend(relativeTime)

interface BaseContentContainerProps {
    data: Partial<Publication & {
        stats: PublicationStats
    }>,
}

function BaseContentContainer(props: BaseContentContainerProps) {
    const { data } = props
    const theme = useTheme()
    const router = useRouter()
    const [localStats, setLocalStats] = useState<{
        liked: boolean,
        on_save_likes: number,
        reposted_or_quoted: boolean,
        on_save_reposts_and_quotes: number,
        commented: boolean,
        on_save_comments: number
    }>({
        liked: false,
        on_save_likes: data.stats?.reactions ?? 0,
        reposted_or_quoted: false,
        on_save_reposts_and_quotes: (data.stats?.reposts ?? 0) + (data.stats?.quotes ?? 0),
        commented: false,
        on_save_comments: data.stats?.comments ?? 0
    })


    useEffect(() => {
        (async () => {

            const p_id = data.id

            if (p_id) {
                const incomingStats = {
                    likes: data.stats?.reactions ?? 0,
                    reposts: data.stats?.reposts ?? 0,
                    quotes: data.stats?.quotes ?? 0,
                    comments: data.stats?.comments ?? 0
                }
                const isLiked = await localStore.isPublicationLiked(p_id)
                const isReposted = await localStore.isPublicationReposted(p_id)
                const isQuoted = await localStore.isPublicationQuoted(p_id)
                const isCommented = await localStore.isPublicationCommented(p_id)
                setLocalStats((prev) => {
                    return {
                        ...prev,
                        reposted_or_quoted: !isNull(isReposted),
                        liked: !isNull(isLiked),
                        on_save_likes: isNull(isLiked) ? incomingStats.likes : isLiked.reaction_count > incomingStats.likes ? isLiked.reaction_count : incomingStats.likes,
                        commented: isCommented,
                        on_save_reposts_and_quotes: isNull(isReposted) ? incomingStats.reposts + incomingStats.quotes : isReposted.repost_count > (incomingStats.reposts + incomingStats.quotes) ? isReposted.repost_count : incomingStats.reposts + incomingStats.quotes,
                    }
                })

            }

        })()
    }, [data.id])


    const handleReact = async () => {
        try {
            if (data.id) {
                if (localStats.liked) {
                    // const txn = await publications.removeReaction(data.id) // TODO: actually remove the reaction
                    localStore.removeLikedPublications(data.id)
                    setLocalStats({
                        ...localStats,
                        liked: !localStats.liked,
                        on_save_likes: localStats.on_save_likes - 1
                    })
                    return
                }
                localStore.addLikedPublications(data.id, data.stats?.reactions ?? 0)
                setLocalStats({
                    ...localStats,
                    liked: !localStats.liked,
                    on_save_likes: localStats.liked ? localStats.on_save_likes - 1 : localStats.on_save_likes + 1
                })
                const txn = await publications.createReaction(1, data.id, 1)
                // TODO: if the transaction fails, remove the like
            }
        }
        catch (e) {
            console.log("Something went wrong", e)
        }
    }

    const handleRepost = async () => {
        try {
            if (data.id) {
                if (localStats.reposted_or_quoted) {
                    localStore.removeRepostedPublications(data.id)
                    setLocalStats({
                        ...localStats,
                        reposted_or_quoted: !localStats.reposted_or_quoted,
                        on_save_reposts_and_quotes: localStats.on_save_reposts_and_quotes - 1
                    })
                    // TODO: add easy way to remove reposts
                    return
                }
                // TODO: add support for quotes
                localStore.addRepostedPublications(data.id, data.stats?.reposts ?? 0)
                setLocalStats({
                    ...localStats,
                    reposted_or_quoted: !localStats.reposted_or_quoted,
                    on_save_reposts_and_quotes: localStats.reposted_or_quoted ? localStats.on_save_reposts_and_quotes - 1 : localStats.on_save_reposts_and_quotes + 1
                })
                const txn = await publications.createRepost(data.id, 1)
                // TODO: if the transaction fails, remove the repost
            }
        }
        catch (e) {
            console.log("Something went wrong", e)
        }
    }


    return (
        <View flexDirection="row" columnGap={2} py={5} pb={10} >
            <View h="100%" w="10%" >
                <Avatar circular size={"$3"} >
                    <Avatar.Image
                        src={data?.creator?.profile?.pfp as string ?? null}
                        accessibilityLabel="Profile Picture"
                    />
                    <Avatar.Fallback
                        backgroundColor="$pink10"
                    />
                </Avatar>
            </View>
            <View w="90%" rowGap={20} >

                <View flexDirection="row" alignItems="center" justifyContent="space-between" >
                    <View flexDirection="row" alignItems="flex-start" columnGap={10}>
                        <View>
                            <Text>
                                {data?.creator?.profile?.display_name}
                            </Text>
                            <Text fontSize={'$1'} color={'$gray10'} >
                                @{data?.creator?.username?.username}
                            </Text>
                        </View>
                        <Text color={'$gray10'} >
                            {dayjs(data?.timestamp).fromNow()}
                        </Text>
                    </View>
                    <MoreHorizontal />
                </View>
                <Link
                    href={{
                        pathname: '/(tabs)/feed/[post-id]/',
                        params: {
                            "post-id": data.id!
                        }
                    }}
                >
                {/* Content */}
                    <View w="100%">
                        <Text
                            mb={
                                ((data?.content?.media?.length ?? 0) > 0) ? 20 : 0
                            }
                        >
                            {data?.content?.content}
                    </Text>
                        <View flexDirection="row" flexWrap="wrap" w="100%" columnGap={10} rowGap={10} >
                            {
                                data?.content?.media?.filter((media: Entities.Media) => media?.type?.includes("image"))?.map((media: Entities.Media) => {
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
                </Link>

                <View flexDirection="row" columnGap={20} w="100%" >
                    <TouchableOpacity >
                        <View flexDirection="row" columnGap={10} >
                            <MessageSquare color={'$gray10'} size={'$1'} />
                            <Text color={'$gray10'} >
                                {data?.stats?.comments}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleRepost}
                    >
                        <View flexDirection="row" columnGap={10} >
                            <Repeat2 color={localStats.reposted_or_quoted ? '$pink10' : '$gray10'} size={'$1'} />
                            <Text color={
                                localStats.reposted_or_quoted ? theme.pink10.val : '$gray10'
                            } >
                                {localStats.on_save_reposts_and_quotes}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleReact}
                    >
                        <View flexDirection="row" columnGap={10} >
                            <Heart
                                color={'$gray10'} size={'$1'}
                                fill={localStats.liked ? theme.pink10.val : 'none'}
                            />
                            <Text color={
                                localStats.liked ? theme.pink10.val : '$gray10'
                            } >
                                {localStats.on_save_likes}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


export default BaseContentContainer;