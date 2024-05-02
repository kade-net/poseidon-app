import { View, Text, YStack, XStack } from 'tamagui'
import React from 'react'
import { MESSAGE } from '../../../../contract/modules/hermes/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


interface Props {
    data: MESSAGE
}


const ChatBubble = (props: Props) => {
    const { data } = props
    return (
        <XStack w="100%"
            justifyContent={
                data?.isMine ? 'flex-end' : 'flex-start'
            }
            px={5}
            py={5}
        >

            <YStack w="80%" borderRadius={10} overflow='hidden' p={5} bg={
                data?.isMine ? '$primary' : '$baseBackround'
            } >
                <Text flex={1} w="100%" >
                    {data.content}
                </Text>
                <XStack w="100%" justifyContent='flex-end' columnGap={5} >
                    <Text>
                        {dayjs(data.timestamp).fromNow()}
                    </Text>
                </XStack>
            </YStack>
        </XStack>
    )
}

export default ChatBubble