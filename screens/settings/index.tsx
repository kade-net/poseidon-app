import { View, Text, YStack, XStack, Separator } from 'tamagui'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Anchor, ArrowRight, ChevronRight } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'

const Settings = () => {
    return (
        <YStack
            w="100%"
            h="100%"
            py={10}
        >
            <Link
                href="/settings/anchors"
                asChild
            >
                <TouchableOpacity style={{
                    width: "100%",
                }} >
                    <XStack w="100%" py={10} px={10} justifyContent='space-between' >
                        <XStack columnGap={20} >
                            <Anchor size={18} />
                            <Text>
                                Anchors
                            </Text>
                        </XStack>
                        <ChevronRight />
                    </XStack>
                    <Separator />
                </TouchableOpacity>
            </Link>
        </YStack>
    )
}

export default Settings