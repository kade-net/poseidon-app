import React from 'react'
import { Avatar, XStack, YStack, Text, Button } from 'tamagui'
import { Community } from '../../../__generated__/graphql';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface Props {
    data: {
        owns_community: boolean;
        community: Partial<Community>;
        id: string;
        user_address: string;
        type: 0 | 1 | 2;
        community_id: string;
    }
}

const UserMembership = (props: Props) => {
    const { data } = props
    return (
        <Link
            asChild
            href={{
                pathname: '/(tabs)/feed/communities/[name]/',
                params: {
                    name: data?.community?.name! // Safe to assume this is always defined
                }
            }}
        >
            <TouchableOpacity style={{
                width: '100%',
            }}>
                <YStack w="100%" >
                    <XStack columnGap={10} w="100%" px={20} py={10}  >
                        <Avatar circular >
                            <Avatar.Image source={{ uri: data?.community?.image }} alt="community" />
                            <Avatar.Fallback
                                bg="lightgray"
                            />
                        </Avatar>
                        <YStack flex={1} rowGap={10}  >
                            <XStack justifyContent='space-between' w="100%" >
                                <YStack>
                                    <Text fontSize={'$5'} >
                                        {data?.community?.name}
                                    </Text>
                                    <Text fontSize={'$3'} color={'$gray10'} >
                                        /{data?.community?.name}
                                    </Text>
                                </YStack>
                                {
                                    data?.owns_community ?
                                        <Text color={'gold'} >owner</Text> :
                                        <Text
                                            color={
                                                data?.type === 2 ? 'rgb(127,88,153)' : data?.type === 1 ? 'rgb(253,33,85)' : 'gray'
                                            }
                                        >
                                            {
                                                data?.type === 2 ? 'member' : data?.type === 1 ? 'host' : ''
                                            }
                                        </Text>
                                }
                            </XStack>
                            <Text w="100%" >
                                {
                                    data?.community?.description
                                }
                            </Text>
                        </YStack>
                    </XStack>
                </YStack>
            </TouchableOpacity>
        </Link>
    )
}

export default UserMembership