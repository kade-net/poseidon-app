import { View, Text, YStack, Separator } from 'tamagui'
import React from 'react'
import SectionButton from '../../../../components/ui/section-button'
import { CircleDashed, Edit3, PilcrowSquare, UserRoundPlus } from '@tamagui/lucide-icons'
import { Link, useGlobalSearchParams } from 'expo-router'

const EditCommunity = () => {
    const params = useGlobalSearchParams()
    const communityName = params?.['name'] as string
    return (
        <YStack backgroundColor={'$background'} w="100%" flex={1} py={20}  >
            <Link asChild href={{
                pathname: '/(tabs)/feed/communities/[name]/edit/displayname',
                params: {
                    name: communityName
                }
            }} >
                <SectionButton
                    title="Change display name"
                    icon={<Edit3 />}
                    description='A friendly title for your followers'
                    onPress={() => { }}
                />
            </Link>
            <Separator w="100%" />
            <Link asChild href={{
                pathname: '/(tabs)/feed/communities/[name]/edit/description',
                params: {
                    name: communityName
                }
            }} >
                <SectionButton
                    title="Edit description"
                    icon={<PilcrowSquare />}
                    description='Tell people why they should join'
                    onPress={() => { }}
                />
            </Link>
            <Separator w="100%" />
            <Link asChild href={{
                pathname: '/(tabs)/feed/communities/[name]/edit/image-edit',
                params: {
                    name: communityName
                }
            }} >
                <SectionButton
                    title="Change Image"
                    icon={<CircleDashed />}
                    description='Make your channel recognizable'
                    onPress={() => { }}
                />
            </Link>
            <Separator w="100%" />
            <Link asChild href={{
                pathname: '/(tabs)/feed/communities/[name]/edit/hosts-edit',
                params: {
                    name: communityName
                }
            }}  >

                <SectionButton
                    title="Manage Hosts"
                    icon={<UserRoundPlus />}
                    description='Manage who can moderate your channel'
                    onPress={() => { }}
                />
            </Link>
            <Separator w="100%" />
        </YStack>
    )
}

export default EditCommunity