import '../../../global'
import { View, Text, YStack, XStack, H4, H5, Button, Separator, H6, Avatar } from 'tamagui'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, PlusSquare } from '@tamagui/lucide-icons'
import { Animated, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { useQuery } from 'react-query'
import community from '../../../contract/modules/community'
// TODO: if user has no anchors show bottom sheet leading them to buy some
const Communities = () => {
    const communitiesQuery = useQuery({
        queryKey: ['memberships'],
        queryFn: community.getCommunities
    })


    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: '100%',
                height: '100%'
            }}
        >
            <YStack w="100%" >
                <XStack py={10} w="100%" alignItems='center' justifyContent='space-between' px={20} >
                    <Text >
                        Your Communities
                    </Text>
                    <Link
                        href='/communities/create'
                        asChild
                    >
                        <TouchableOpacity>
                            <PlusSquare />
                        </TouchableOpacity>
                    </Link>
                </XStack>
            </YStack>
            <Animated.FlatList
                data={communitiesQuery.data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    width: '100%',
                }}
                renderItem={({ item }) => {
                    return (
                        <YStack w="100%" >
                            <XStack columnGap={10} w="100%" px={20} py={10}  >
                                <Avatar circular >
                                    <Avatar.Image source={{ uri: item?.community?.image }} alt="community" />
                                    <Avatar.Fallback
                                        bg="lightgray"
                                    />
                                </Avatar>
                                <YStack flex={1} rowGap={10}  >
                                    <XStack justifyContent='space-between' w="100%" >
                                        <YStack>
                                            <Text fontSize={'$5'} >
                                                {item?.community?.name}
                                            </Text>
                                            <Text fontSize={'$3'} color={'$gray10'} >
                                                /{item?.community?.name}
                                            </Text>
                                        </YStack>
                                        {
                                            item?.owns_community ?
                                                <Button borderWidth={1} borderColor={'$purple10'} variant='outlined' >
                                                    Edit
                                                </Button> :
                                                <Button borderWidth={1} borderColor={'$purple10'} variant='outlined' >
                                                    Joined
                                                </Button>
                                        }
                                    </XStack>
                                    <Text w="100%" >
                                        {
                                            item?.community?.description
                                        }
                                    </Text>
                                </YStack>
                            </XStack>
                            <Separator />
                        </YStack>
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default Communities