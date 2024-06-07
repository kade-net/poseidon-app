import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'

interface Props {
    form: UseFormReturn<TPUBLICATION>
}

const HighlightMentions = (props: Props) => {
    const { form } = props
    const content = form.watch('content') ?? ""
    const tags = form.watch('tags') ?? []
    const parts = content.split(/(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)/g)



    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <Text key={index} color={'$primary'}>{part}</Text>
        } else if (Utils.urlRegex.test(part)) {
            return <Text fontFamily={"$body"} fontSize={"$sm"} lineHeight={"$sm"} key={index} color={'$primary'}>{part}</Text>
        }
        return <Text key={index}>{part}</Text>
    })
}

export default HighlightMentions