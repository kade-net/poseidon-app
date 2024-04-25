import { Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import { COMMUNITY_QUERY, GET_MEMBERSHIP } from '../../../../../utils/queries'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, XStack, YStack, View, Text, Separator, Button } from 'tamagui'
import useDisclosure from '../../../../../components/hooks/useDisclosure'
import { ArrowLeft, ChevronDown, ChevronUp, Edit3, Users } from '@tamagui/lucide-icons'
import delegateManager from '../../../../../lib/delegate-manager'
import community from '../../../../../contract/modules/community'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const DROPDOWN_HEIGHT = SCREEN_HEIGHT - 50

const _layout = () => {
    const params = useLocalSearchParams()
    const communityName = params.name as string

    const communityQuery = useQuery(COMMUNITY_QUERY, {
        variables: {
            name: communityName
        },
        skip: !communityName
    })

    const membershipQuery = useQuery(GET_MEMBERSHIP, {
        variables: {
            communityName,
            userAddress: delegateManager.owner!
        },
        skip: !delegateManager.owner || !communityName
    })

    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    const handleFollowToggle = async () => {
        try {
            if (membershipQuery?.data?.membership) {
                await community.unFollow(communityName)
            } else {
                await community.follow(communityName)
            }

        }
        catch (e) {
            console.log("Error: ", e)
        }
    }


    return (

        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    header(props) {
                        return (
                            <YStack w="100%" pos="relative" backgroundColor={"$background"}>
                                <XStack w="100%" py={10} alignItems='center' columnGap={10} px={10} >

                                    <TouchableOpacity onPress={props.navigation.goBack} >
                                        <ArrowLeft />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onToggle} >
                                        <XStack columnGap={10} alignItems='center' >
                                            <Avatar circular size={"$2"} >
                                                <Avatar.Image source={{ uri: communityQuery.data?.community?.image }} alt="community" />
                                                <Avatar.Fallback bg="lightgray" />
                                            </Avatar>
                                            <Text mr={20}  color={"$text"}>
                                                /{communityQuery.data?.community?.name}
                                            </Text>
                                            {
                                                isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                            }
                                        </XStack>
                                    </TouchableOpacity>
                                </XStack>
                                <Separator />
                                {isOpen && <YStack pos="absolute" top={48} flex={1} height={DROPDOWN_HEIGHT} w="100%" zIndex={5} elevation={4} >
                                    <YStack w="100%" px={10} py={20} bg="$background" >
                                        <XStack columnGap={10} w="100%" >
                                            <XStack  >
                                                <Avatar circular size={"$5"} >
                                                    <Avatar.Image source={{ uri: communityQuery.data?.community?.image }} alt="community" />
                                                    <Avatar.Fallback bg="lightgray" />
                                                </Avatar>
                                            </XStack>
                                            <YStack>
                                                <Text fontSize={'$5'} >
                                                    {communityQuery.data?.community?.display_name ?? communityQuery?.data?.community?.name}
                                                </Text>
                                                <Text fontSize={'$3'} color={'$sideText'} >
                                                    /{communityQuery.data?.community?.name}
                                                </Text>
                                            </YStack>
                                        </XStack>
                                        <Text w="100%" py={20} color={"$text"} fontFamily={"$body"} fontSize={"$sm"}>
                                            {
                                                communityQuery.data?.community?.description
                                            }
                                        </Text>
                                        <XStack alignItems='center' columnGap={20} w="100%" >

                                            {
                                                membershipQuery.data?.membership?.type == 0 ? <Link asChild href={{
                                                    pathname: '/(tabs)/feed/communities/[name]/edit/',
                                                    params: {
                                                        name: communityQuery.data?.community?.name!
                                                    }
                                                }} >
                                                    <Button backgroundColor={"$button"} color={"$buttonText"} iconAfter={<Edit3 />} flex={1} >
                                                        Edit
                                                    </Button>
                                                </Link> :
                                                    membershipQuery.data?.membership ? <Button backgroundColor={"$colourlessButton"} borderWidth={1} borderColor={"$button"}  color={membershipQuery.data?.membership ? "$text" : "$buttonText"} onPress={handleFollowToggle} flex={1} >
                                                        Following
                                                    </Button> :
                                                        <Button backgroundColor={"$button"} color={"$buttonText"} onPress={handleFollowToggle} flex={1} >
                                                            Follow
                                                        </Button>
                                            }
                                        </XStack>
                                        <XStack py={10} alignItems='center' columnGap={10} >
                                            <Users color={'$sideText'} size={"$xxs"} />
                                            <Text color={'$sideText'} fontSize={"$xxs"} >
                                                {communityQuery.data?.community?.stats?.members} Members
                                            </Text>
                                        </XStack>
                                    </YStack>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            backgroundColor: 'black',
                                            opacity: 0.8,
                                        }}
                                    >

                                    </TouchableOpacity>
                                </YStack>}
                            </YStack>
                        )
                    }
                }}
            />
            <Stack.Screen name="edit" options={{
                headerShown: false
            }} />
        </Stack>
    )
}

export default _layout