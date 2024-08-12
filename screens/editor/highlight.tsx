import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { Utils } from '../../utils';

// split content string by mentions, links, hashtags, tags, currencies
const HIGHLIGHT_REGEX = /(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)|(#\w+)|(^\/[a-zA-Z-]+|\s\/[a-zA-Z-]+)|(\$[a-zA-Z]+)|(\w+)/g;

const HASHTAG_REGEX = /#\w+/
const TAG_REGEX = /\/\w+/
const CURRENCY_REGEX = /\$\w+/

interface Props {
    content?: string
    mentions?: Record<string, string>
}

const Highlight = (props: Props) => {
    const { content = '', mentions = null } = props
    const parts = content?.split(HIGHLIGHT_REGEX) ?? [] // Split by mentions and links

    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && mentions && mentions[part?.replace('@', '')]) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        } else if (Utils.urlRegex.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
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

export default memo(Highlight)