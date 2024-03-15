import { View, Text, XStack, Avatar } from 'tamagui'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ChevronUp, Home } from '@tamagui/lucide-icons'
import useDisclosure from '../../hooks/useDisclosure'
import BaseContentSheet from './base-content-sheet'
import CommunitySearch from '../search'
import { Community } from '../../../__generated__/graphql'

interface Props {
    onCommunitySelect?: (value: Partial<Community>) => void
    defaultCommunity?: Partial<Community>
}

const ChooseCommunityBottomSheet = (props: Props) => {
    const { onCommunitySelect, defaultCommunity } = props
    const [community, setCommunity] = useState<Partial<Community> | null>(defaultCommunity ?? {
        name: "home"
    })
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    const handleCommunityChange = (community: Partial<Community>) => {
        setCommunity(community)
        onCommunitySelect?.(community)
        onClose()
    }

    return (
        <View>
            <TouchableOpacity onPress={!defaultCommunity ? onToggle : undefined} >
                <XStack alignItems='center' columnGap={5} borderRadius={5} borderWidth={1} borderColor={"$blue10"} px={5} py={2} >
                    {
                        community?.name == "home" ? // TODO: 
                            <Home size={16} /> :
                            <Avatar circular size={"$1.5"} >
                                <Avatar.Image
                                    src={community?.image}
                                />
                                <Avatar.Fallback
                                    bg="$pink10"
                                />
                            </Avatar>
                    }
                    {!defaultCommunity && <ChevronUp
                        fontSize={10}
                    />}
                </XStack>
            </TouchableOpacity>
            <BaseContentSheet
                open={isOpen}
                snapPoints={[50]}
                onOpenChange={onToggle}
                level={2}
            >
                <CommunitySearch
                    onSelect={handleCommunityChange}
                />
            </BaseContentSheet>
        </View>
    )
}

export default ChooseCommunityBottomSheet