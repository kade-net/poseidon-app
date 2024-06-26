
import "../../../global"
import { Dot, Heart, MessageSquare, MoreHorizontal, MoreVertical, Repeat2, Reply } from "@tamagui/lucide-icons";
import { Avatar, Text, View, XStack, YStack, useTheme } from "tamagui";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { Publication, PublicationStats } from "../../../__generated__/graphql";
import FeedImage from "./image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "expo-router";
import PublicationReactions from "./reactions";
import ContentPreviewContainer from "./content-preview-container";
import { Utils } from "../../../utils";
import HighlightMentions from "./highlight-mentions";
import PublicationAction from "./publication-action";
import LinkResolver from "./link-resolver";
import { getMutedUsers, getRemovedFromFeed } from "../../../contract/modules/store-getters";
import ErrorBoundary from "../../helpers/error-boundary";

dayjs.extend(relativeTime)

interface BaseContentContainerProps {
    data: Partial<Publication & {
        stats: PublicationStats
    }>, 
    inCommunityFeed?: boolean
}

const extractLinks = (content: string) => {
    const regex = /(?:^|\s)(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/g
    return content.match(regex)

}

function BaseContentContainer(props: BaseContentContainerProps) {
    const { data: _data, inCommunityFeed } = props
    const data = _data?.type == 4 ? _data?.parent : _data
    const [hide, setHide] = useState(false)
    const triggerHide = useCallback(() => {
        setHide(true)
    }, [])

    const contentLinks = useMemo(() => {
        return extractLinks(data?.content?.content ?? "") ?? []

    }, [, data?.content?.content])

    const DATE_VALUE = useMemo(() => {
        return dayjs(data?.timestamp).fromNow()
            ?.replace(" hours ago", "h")
            ?.replace(" hour ago", "h")
            ?.replace(" minutes ago", "m")
            ?.replace(" minute ago", "m")
            ?.replace(" days ago", "d")
            ?.replace(" day ago", "d")
            ?.replace(" months ago", "mo")
            ?.replace(" month ago", "mo")
            ?.replace(" years ago", "y")
            ?.replace(" year ago", "y")
            ?.replace("anh", '1h')
            ?.replace("am", '1m')
            ?.replace("ad", '1d')
    }, [data?.timestamp])

    if (hide) return null
    if (getMutedUsers()?.includes(data?.creator?.id!)) return null
    if (getRemovedFromFeed()?.includes(data?.publication_ref!)) return null

    const HAS_LONG_USERNAME = (data?.creator?.username?.username.length ?? 0) > 16
    const HAS_LONG_DISPLAY_NAME = (data?.creator?.profile?.display_name?.length ?? 0) > 16

    return (
        <YStack w="100%" borderBottomWidth={0.5} borderColor={'$borderColor'} py={10} px={20} pb={10} >
            {
                _data?.type == 4 &&
                <Link
                    href={{
                        pathname: '/(tabs)/feed/[post-id]/',
                        params: {
                            "post-id": data?.publication_ref!
                        }
                    }}
                >
                    <View flexDirection="row" alignItems="center" pb={10} columnGap={10} >
                        <Repeat2 size={"$1"} />
                        <Text color="gray" fontSize={"$xxs"} >
                            @{data?.creator?.username?.username} Reposted
                        </Text>
                    </View>
                    </Link>
            }
            {
                (_data?.type == 3 && _data?.parent) &&
                <Link asChild href={{
                    pathname: '/(tabs)/feed/[post-id]/',
                    params: {
                        "post-id": data?.parent?.publication_ref!
                    }
                }} >
                    <View flexDirection="row" alignItems="center" pb={10} columnGap={10} >
                        <Reply size={10} />
                        <Text color="gray" fontSize={10} >
                            Replied to @{data?.parent?.creator?.username?.username}
                        </Text>
                    </View>
                    </Link>
            }


            <View w="100%" rowGap={10} >
                <XStack columnGap={10} >
                    <Link
                        asChild
                        href={{
                            pathname: '/profiles/[address]/',
                            params: {
                                address: data?.creator?.address!
                            }
                        }}
                    >
                        <Avatar circular size={'$4'} >
                            <Avatar.Image
                                src={
                                    Utils.parseAvatarImage(data?.creator?.address ?? '1', data?.creator?.profile?.pfp as string)
                                }
                                accessibilityLabel="Profile Picture"
                            />
                            <Avatar.Fallback
                                backgroundColor="$pink10"
                            />
                        </Avatar>
                    </Link>
                    <View flex={1} flexDirection="row" alignItems="flex-start" justifyContent="space-between" >
                        <Link
                            href={{
                                pathname: '/profiles/[address]/',
                                params: {
                                    address: data?.creator?.address!
                                }
                            }}
                            asChild
                        >

                            <YStack >
                                <Text fontSize={"$xs"} fontWeight={"$5"}>
                                        {
                                            HAS_LONG_DISPLAY_NAME ?
                                                `${data?.creator?.profile?.display_name?.slice(0, 10)}...` :
                                                data?.creator?.profile?.display_name
                                        }
                                    </Text>
                                <Text color={'$sideText'} fontSize={"$xs"}>
                                        @{
                                            HAS_LONG_USERNAME ?
                                                `${data?.creator?.username?.username.slice(0, 10)}...` :
                                                data?.creator?.username?.username
                                    }
                                </Text>
                            </YStack>

                        </Link>
                        {/* <MoreHorizontal /> */}
                        <XStack alignItems="center" >
                            <Text color={'$sideText'} >
                                {DATE_VALUE}
                            </Text>
                            <PublicationAction
                                publicationId={data?.id ?? 0}
                                publicationRef={data?.publication_ref ?? ""}
                                userAddress={data?.creator?.address ?? ""}
                                userId={data?.creator?.id ?? 0} // OPtimistically making the assumption a value will always be present
                                triggerHide={triggerHide}
                                publication_type={data?.type ?? 1}
                            />
                        </XStack>
                    </View>
                </XStack>
                    {
                        data?.type == 4 && <XStack w="100%" alignItems="center" columnGap={5} >
                            <Repeat2/>
                            <Text fontFamily={"$heading"}>
                                Reposted
                            </Text>
                        </XStack>
                    }
                    {!inCommunityFeed && <XStack w="100%" >
                        {data?.community &&
                            <Link asChild href={{
                                pathname: '/(tabs)/feed/communities/[name]/',
                                params: {
                                    "name": data?.community?.name
                                }
                            }} >
                                <XStack alignItems="center" columnGap={10} borderRadius={5} px={4} py={2} backgroundColor={'$portalBackground'} >
                                    <Avatar circular size={"$1"} >
                                        <Avatar.Image src={data?.community?.image} />
                                        <Avatar.Fallback bg="$pink10" />
                                    </Avatar>
                                    <Text fontSize={12} >
                                        {data?.community?.name}
                                    </Text>
                                </XStack>
                            </Link>

                        }
                    </XStack>}
                    <Link
                        href={{
                            pathname: '/(tabs)/feed/[post-id]/',
                            params: {
                                "post-id": data?.publication_ref!
                            }
                    }}
                        asChild
                    >
                        {/* Content */}
                        <View w="100%" flex={1} >
                        <YStack w="100%"
                            paddingBottom={10}
                            >

                                <Text color={"$text"}>
                                    <HighlightMentions
                                        content={`${data?.content?.content} ${__DEV__ ? data?.id : ''}`}
                                        tags={data?.content?.tags}
                                        mentions={data?.content?.mentions}
                                    />
                                </Text>
                                {
                                    contentLinks?.map((link, i) => {
                                        return (
                                            <LinkResolver
                                                link={link}
                                                key={i}
                                                publication_ref={data?.publication_ref ?? ''}
                                                kid={data?.id ?? 0}
                                            />
                                        )
                                    })
                            }
                            </YStack>
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
                    {
                        (data?.parent && data?.type == 2) && <View w="100%" px={5} >
                            <ContentPreviewContainer data={data?.parent} />
                        </View>
                    }


                    <View flexDirection="row" columnGap={20} w="100%" >
                        <PublicationReactions
                            initialStats={data?.stats}
                            publication_ref={data?.publication_ref as string}
                            // @ts-expect-error - ignoring for now  // TODO: fix me
                            publication={data}
                        />
                    </View>
                </View>

        </YStack>
    )
}


export default memo(BaseContentContainer);