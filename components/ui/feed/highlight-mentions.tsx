import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'
import { Link } from 'expo-router'

// split content string by mentions, links, hashtags, tags, currencies
const HIGHLIGHT_REGEX = /(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)|(#\w+)|(^\/[a-zA-Z-]+|\s\/[a-zA-Z-]+)|(\$[a-zA-Z]+)|(\w+)/g;

const HASHTAG_REGEX = /#\w+/
const TAG_REGEX = /\/\w+/
const CURRENCY_REGEX = /\$\w+/

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
    const parts = content?.split(HIGHLIGHT_REGEX) ?? [] // Split by mentions and links

    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <MemoedMention
                key={index}
                username={part}
                mentions={mentions}
            />
        } else if (Utils.urlRegex.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} lineHeight={12} key={index} color={'$COAText'}></Text>
        } else if (HASHTAG_REGEX.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        } else if (TAG_REGEX.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        } else if (CURRENCY_REGEX.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        }
        return <Text fontFamily={"$body"} fontSize={18} color={'$text'} key={index}>{part}</Text>
    })
}

export default memo(HighlightMentions)