
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
import { memo, useEffect, useState } from "react";
import localStore from "../../../lib/local-store";
import { isNull } from "lodash";
import { Link, useRouter } from "expo-router";
import PublicationReactions from "./reactions";

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





    return (
        <View w="100%" borderBottomWidth={1} borderColor={'$gray1'} flexDirection="row" columnGap={2} py={5} pb={10} >
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
                            "post-id": data.publication_ref!
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

                <View flexDirection="row" columnGap={20} w="100%" >
                    <PublicationReactions
                        initialStats={data?.stats}
                        publication_ref={data?.publication_ref as string}
                    />
                </View>
            </View>
        </View>
    )
}


export default memo(BaseContentContainer);