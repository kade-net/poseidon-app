import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'

const HIGHLIGHT_REGEX = /(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)|(#\w+)|(^\/[a-zA-Z-]+|\s\/[a-zA-Z-]+)|(\$[a-zA-Z]+)|(\w+)/g;
const HASHTAG_REGEX = /#\w+/
const TAG_REGEX = /\/\w+/
const CURRENCY_REGEX = /\$\w+/
interface Props {
    form: UseFormReturn<TPUBLICATION>
}

const HighlightMentions = (props: Props) => {
    const { form } = props
    const content = form.watch('content') ?? ""
    const tags = form.watch('tags') ?? []
    const parts = content.split(HIGHLIGHT_REGEX)



    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <Text key={index} color={'$primary'}>{part}</Text>
        } else if (Utils.urlRegex.test(part)) {
            return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} key={index} color={'$primary'}>{part}</Text>
        } else if (HASHTAG_REGEX.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        } else if (TAG_REGEX.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        } else if (CURRENCY_REGEX.test(part)) {
            return <Text fontFamily={"$body"} fontSize={18} color={'$COAText'} key={index}>{part}</Text>
        }
        return <Text key={index}>{part}</Text>
    })
}

export default HighlightMentions