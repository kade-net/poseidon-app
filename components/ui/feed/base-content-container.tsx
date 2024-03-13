
import "../../../global"
import { Heart, MessageSquare, MoreHorizontal, MoreVertical, Repeat2, Reply } from "@tamagui/lucide-icons";
import { Avatar, Text, View, XStack, YStack, useTheme } from "tamagui";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { Publication, PublicationStats } from "../../../__generated__/graphql";
import { media } from "@tamagui/config";
import FeedImage from "./image";
import { TouchableOpacity } from "react-native";
import publications from "../../../contract/modules/publications";
// import localStore from "../../../lib/local-store";
import { memo, useEffect, useState } from "react";
import localStore from "../../../lib/local-store";
import { isNull } from "lodash";
import { Link, useRouter } from "expo-router";
import PublicationReactions from "./reactions";
import ContentPreviewContainer from "./content-preview-container";

dayjs.extend(relativeTime)

interface BaseContentContainerProps {
    data: Partial<Publication & {
        stats: PublicationStats
    }>,
}

function BaseContentContainer(props: BaseContentContainerProps) {
    const { data: _data } = props
    const data = _data?.type == 4 ? _data?.parent : _data
    const theme = useTheme()
    const router = useRouter()





    return (
        <YStack w="100%" borderBottomWidth={1} borderColor={'$gray1'} py={5} pb={10} >

            {
                _data?.type == 4 && <View flexDirection="row" alignItems="center" pb={10} columnGap={10} >
                    <Repeat2 size={10} />
                    <Text color="gray" fontSize={10} >
                        @{data?.creator?.username?.username} Reposted
                    </Text>
                </View>
            }
            {
                (_data?.type == 3 && _data?.parent) && <View flexDirection="row" alignItems="center" pb={10} columnGap={10} >
                    <Reply size={10} />
                    <Text color="gray" fontSize={10} >
                        Replied to @{data?.parent?.creator?.username?.username}
                    </Text>
                </View>
            }
            <View w="100%" flexDirection="row" columnGap={2}  >
                <Link
                    asChild
                    href={{
                        pathname: '/profiles/[address]/',
                        params: {
                            address: data?.creator?.address!
                        }
                    }}
                >
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
                </Link>
                <View w="90%" rowGap={20} >
                    <View flexDirection="row" alignItems="center" justifyContent="space-between" >
                        <Link
                            href={{
                                pathname: '/profiles/[address]/',
                                params: {
                                    address: data?.creator?.address!
                                }
                            }}
                            asChild
                        >
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
                        </Link>
                        <MoreHorizontal />
                    </View>
                    {
                        data?.type == 4 && <XStack w="100%" alignItems="center" columnGap={5} >
                            <Repeat2 />
                            <Text>
                                Reposted
                            </Text>
                        </XStack>
                    }
                    <Link
                        href={{
                            pathname: '/(tabs)/feed/[post-id]/',
                            params: {
                                "post-id": data?.publication_ref!
                            }
                        }}
                        style={{
                            width: '100%'
                        }}
                        asChild
                    >
                        {/* Content */}
                        <View w="100%">
                            <Text
                                mb={
                                    ((data?.content?.media?.length ?? 0) > 0) ? 20 : 0
                                }
                            >
                                {data?.content?.content} {__DEV__ ? data?.id : null}
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
                    {
                        (data?.parent && data?.type == 2) && <View w="100%" px={5} >
                            <ContentPreviewContainer data={data?.parent} />
                        </View>
                    }

                    <View flexDirection="row" columnGap={20} w="100%" >
                        <PublicationReactions
                            initialStats={data?.stats}
                            publication_ref={data?.publication_ref as string}
                        />
                    </View>
                </View>
            </View>
        </YStack>
    )
}


export default memo(BaseContentContainer);