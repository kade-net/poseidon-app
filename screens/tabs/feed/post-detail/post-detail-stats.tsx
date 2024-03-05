import { View, Text, useTheme, Separator } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { PublicationStats } from '../../../../__generated__/graphql'
import localStore from '../../../../lib/local-store'
import { isNull } from 'lodash'
import { TouchableOpacity } from 'react-native'
import { Heart, MessageSquare, Repeat, Repeat2 } from '@tamagui/lucide-icons'
import publications from '../../../../contract/modules/publications'

interface Props {
    stats: PublicationStats | null
    publication_id?: number
}

const PostDetailStats = (props: Props) => {
    const stats = props.stats
    const publication_id = props.publication_id
    const theme = useTheme()
    const [localStats, setLocalStats] = useState<{
        liked: boolean,
        on_save_likes: number,
        reposted_or_quoted: boolean,
        on_save_reposts_and_quotes: number,
        commented: boolean,
        on_save_comments: number
    } | null>(null)

    useEffect(() => {
        (async () => {
            if (stats && publication_id) {
                const liked = await localStore.isPublicationLiked(publication_id)
                const reposted = await localStore.isPublicationReposted(publication_id)
                const comment = await localStore.isPublicationCommented(publication_id)
                console.log("Setting data", liked, reposted, comment)
                setLocalStats((prev) => {
                    return {
                        ...prev,
                        liked: !isNull(liked),
                        on_save_likes: (liked?.reaction_count ?? 0) > stats.reactions ? liked?.reaction_count ?? 0 : stats.reactions,
                        reposted_or_quoted: !isNull(reposted),
                        on_save_reposts_and_quotes: (reposted?.repost_count ?? 0) > stats.reposts ? reposted?.repost_count ?? 0 : stats.reposts,
                        commented: false,
                        on_save_comments: 0
                    }
                })
            }

        })()
    }, [stats])


    const handleLike = async () => {
        if (localStats?.liked) {
            await localStore.removeLikedPublications(publication_id!)
            setLocalStats((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    liked: false,
                    on_save_likes: (prev?.on_save_likes ?? 0) - 1
                }
            })
            // TODO: Remove like from the blockchain
        } else {
            await localStore.addLikedPublications(publication_id!, (stats?.reactions ?? 0) + 1)
            setLocalStats((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    liked: true,
                    on_save_likes: prev.on_save_likes + 1
                }
            })

            const txn = await publications.createReaction(1, publication_id!, 1)
            console.log("Txn", txn)
        }
    }

    const handleRepost = async () => {
        if (localStats?.reposted_or_quoted) {
            await localStore.removeRepostedPublications(publication_id!)
            setLocalStats((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    reposted_or_quoted: false,
                    on_save_reposts_and_quotes: (prev?.on_save_reposts_and_quotes ?? 0) - 1
                }
            })
            // TODO: Remove repost from the blockchain
        } else {
            await localStore.addRepostedPublications(publication_id!, (stats?.reposts ?? 0) + 1)
            setLocalStats((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    reposted_or_quoted: true,
                    on_save_reposts_and_quotes: prev.on_save_reposts_and_quotes + 1
                }
            })

            const txn = await publications.createRepost(publication_id!, 1)
            console.log("Txn", txn)
        }
    }


    return (
        <View w="100%" py={5} rowGap={10} >
            <View w="100%" columnGap={10} flexDirection='row' >

                <View flexDirection='row' alignItems='center' columnGap={2} >
                    <Text
                        fontWeight={"600"}
                    >
                        {localStats?.on_save_comments ?? 0}
                    </Text>
                    <Text color="$gray10" >
                        Comments
                    </Text>
                </View>
                <View flexDirection='row' alignItems='center' columnGap={2} >
                    <Text
                        fontWeight={"600"}
                    >
                        {localStats?.on_save_reposts_and_quotes ?? 0}
                    </Text>
                    <Text color="$gray10" >
                        Reposts
                    </Text>
                </View>
                <View flexDirection='row' alignItems='center' columnGap={2} >
                    <Text
                        fontWeight={"600"}
                    >
                        {localStats?.on_save_likes ?? 0}
                    </Text>
                    <Text color="$gray10" >
                        Likes
                    </Text>
                </View>

            </View>
            <Separator />
            <View
                w="100%"
                flexDirection='row'
                alignItems='center'
                py={5}
                columnGap={40}
            >
                <TouchableOpacity>
                    <MessageSquare color={'$gray10'} size={'$1'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleRepost}
                >
                    <Repeat2 color={localStats?.reposted_or_quoted ? '$pink10' : '$gray10'} size={'$1'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleLike}
                >
                    <Heart
                        color={'$gray10'} size={'$1'}
                        fill={localStats?.liked ? theme.pink10.val : 'none'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PostDetailStats