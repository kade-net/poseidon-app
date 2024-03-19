import { View, Text, YStack, Separator } from 'tamagui'
import React from 'react'
import { Link } from 'expo-router'
import SectionButton from '../../../components/ui/section-button'
import { CircleDashed, Edit3, PilcrowSquare } from '@tamagui/lucide-icons'
import delegateManager from '../../../lib/delegate-manager'

const Edit = () => {
    return (

        <YStack flex={1} w="100%" h="100%" backgroundColor={"$background"}>
            <Link asChild href={{
                pathname: '/profiles/[address]/edit/display-name',
                params: {
                    address: delegateManager.owner!
                }
            }} >
                <SectionButton
                    title="Change display name"
                    icon={<Edit3 />}
                    onPress={() => { }}
                    description='A changeable name for your profile'
                />
            </Link>
            <Separator w="100%" />

            <Link asChild href={{
                pathname: '/profiles/[address]/edit/bio',
                params: {
                    address: delegateManager.owner!
                }
            }} >
                <SectionButton
                    title="Edit bio"
                    icon={<PilcrowSquare />}
                    onPress={() => { }}
                    description='Tell people about yourself'
                />
            </Link>
            <Separator w="100%" />
            <Link asChild href={{
                pathname: '/profiles/[address]/edit/pfp',
                params: {
                    address: delegateManager.owner!
                }
            }} >
                <SectionButton
                    title="Edit Profile Picture"
                    icon={<CircleDashed />}
                    onPress={() => { }}
                    description='Make your profile recognizable'
                />
            </Link>
            <Separator w="100%" />
        </YStack>

    )
}

export default Edit