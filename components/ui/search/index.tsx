import { View, Text, YStack, Input } from 'tamagui'
import React, { useState } from 'react'
import Communities from './communities'
import { Community } from '../../../__generated__/graphql'

interface Props {
    onSelect?: (community: Partial<Community>) => void
}

const CommunitySearch = (props: Props) => {
    const { onSelect } = props
    const [search, setSearch] = useState("")
    return (
        <YStack w="100%" px={10} py={20} rowGap={20} >
            <Input
                value={search}
                onChangeText={setSearch}
                w="100%"
                placeholder='Search for a community..'
            />
            <Communities
                search={search}
                onSelect={onSelect}
            />
        </YStack>
    )
}

export default CommunitySearch