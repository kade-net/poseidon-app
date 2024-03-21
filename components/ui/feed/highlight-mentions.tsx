import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'

interface Props {
    content?: string
    tags?: string[]
}

const isLink = (text: string) => {
    return Utils.urlRegex.test(text)
}

const HighlightMentions = (props: Props) => {
    const { content = '', tags = [] } = props
    const parts = content?.split(/(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)/g) ?? [] // Split by mentions and links

    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} key={index} color={"$COAText"}>{part}</Text>
        } else if (Utils.urlRegex.test(part)) {
            return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} key={index} color={'$COAText'}>{part}</Text>
        }
        return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} fontWeight={"$3"} color={'$text'} key={index}>{part}</Text>
    })
}

export default memo(HighlightMentions)