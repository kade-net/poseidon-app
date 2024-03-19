import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'

interface Props {
    content?: string
    tags?: string[]
}

const HighlightMentions = (props: Props) => {
    const { content = '', tags = [] } = props
    const parts = content.split(/(@\w+)/g)



    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} key={index} color={'blue'}>{part}</Text>
        }
        return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} key={index}>{part}</Text>
    })
}

export default memo(HighlightMentions)