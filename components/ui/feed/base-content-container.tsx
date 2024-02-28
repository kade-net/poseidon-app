import { Heart, MessageSquare, MoreHorizontal, MoreVertical, Repeat2 } from "@tamagui/lucide-icons";
import { Avatar, Text, View } from "tamagui";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface BaseContentContainerProps {
    data: Entities.Content
}

function BaseContentContainer(props: BaseContentContainerProps) {
    const { data: { profile, payload, timestamp, stats } } = props
    return (
        <View flexDirection="row" columnGap={2} py={5} pb={10} >
            <View h="100%" w="10%" >
                <Avatar circular size={"$3"} >
                    <Avatar.Image
                        src={profile?.avatar}
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
                                {profile?.displayName}
                            </Text>
                            <Text fontSize={'$1'} color={'$gray10'} >
                                @{profile?.username}
                            </Text>
                        </View>
                        <Text color={'$gray10'} >
                            {dayjs(timestamp).fromNow()}
                        </Text>
                    </View>
                    <MoreHorizontal />
                </View>
                {/* Content */}
                <View w="100%" >
                    <Text>
                        {payload.content}
                    </Text>
                </View>

                <View flexDirection="row" columnGap={20} w="100%" >
                    <View flexDirection="row" columnGap={10} >
                        <MessageSquare color={'$gray10'} size={'$1'} />
                        <Text color={'$gray10'} >
                            {stats.comments}
                        </Text>
                    </View>

                    <View flexDirection="row" columnGap={10} >
                        <Repeat2 color={'$gray10'} size={'$1'} />
                        <Text color={'$gray10'} >
                            {stats.reposts}
                        </Text>
                    </View>

                    <View flexDirection="row" columnGap={10} >
                        <Heart color={'$gray10'} size={'$1'} />
                        <Text color={'$gray10'} >
                            {stats.likes}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


export default BaseContentContainer;