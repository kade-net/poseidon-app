import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'
import { Link } from 'expo-router'

interface Props {
    content?: string
    tags?: string[]
    mentions?: Record<string, string>
}

const isLink = (text: string) => {
    return Utils.urlRegex.test(text)
}

interface MentionProps { username: string, mentions?: Record<string, string> }

function Mention(props: MentionProps) {
    const mentions = props.mentions
    const user_address = mentions?.[props.username?.replace("@", '')]

    if (!user_address) return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} color={"$COAText"}>{props.username}</Text>

    return (
        <Link
            href={{
                pathname: '/profiles/[address]/',
                params: {
                    address: user_address
                }
            }}
            asChild
        >
            <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} color={"$COAText"}>{props.username}</Text>
        </Link>
    )

}

export const MemoedMention = memo(Mention)

const HighlightMentions = (props: Props) => {
    const { content = '', tags = [], mentions } = props
    const parts = content?.split(/(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)/g) ?? [] // Split by mentions and links

    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <MemoedMention
                key={index}
                username={part}
                mentions={mentions}
            />
        } else if (Utils.urlRegex.test(part)) {
            return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} key={index} color={'$COAText'}></Text>
        }
        return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} color={'$text'} key={index}>{part}</Text>
    })
}

export default memo(HighlightMentions)