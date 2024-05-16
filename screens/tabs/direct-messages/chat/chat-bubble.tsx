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
            mb={2}
        >

            <YStack w="80%" borderRadius={10} rowGap={10} overflow='hidden' p={5} bg={
                data?.isMine ? '$primary' : '$incomingChatBubble'
            } >
                <Text flex={1} w="100%" color={data.isMine?'#FEF9F3':'$text'}>
                    {data.content}
                </Text>
                <XStack w="100%" justifyContent='flex-end' columnGap={5} >
                    <Text color={data.isMine?'white':'$text'} fontSize={"$xxs"}>
                        {dayjs(data.timestamp).format('HH:mm').toString()}
                    </Text>
                </XStack>
            </YStack>
        </XStack>
    )
}

export default ChatBubble