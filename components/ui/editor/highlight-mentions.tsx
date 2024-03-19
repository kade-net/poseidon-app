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
    const parts = content.split(/(@\w+)/g)



    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && tags?.includes(part.replace('@', ''))) {
            return <Text key={index} color={'blue'}>{part}</Text>
        }
        return <Text key={index}>{part}</Text>
    })
}

export default HighlightMentions