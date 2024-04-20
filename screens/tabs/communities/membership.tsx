import React from 'react'
import { Avatar, XStack, YStack, Text, Button } from 'tamagui'
import { Community } from '../../../__generated__/graphql';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Utils } from '../../../utils';
import delegateManager from '../../../lib/delegate-manager';

interface Props {
    data: Partial<Community>
}

const UserMembership = (props: Props) => {
    const { data } = props
    const hosts_address = data?.hosts?.map(host => host.address)
    const IS_HOST = hosts_address?.includes(delegateManager.owner!)
    const IS_OWNER = data?.creator?.address == delegateManager.owner
    const IS_MEMBER = !IS_HOST && !IS_OWNER
    return (
        <Link
            asChild
            href={{
                pathname: '/(tabs)/feed/communities/[name]/',
                params: {
                    name: data?.name! // Safe to assume this is always defined
                }
            }}
        >
            {/* <TouchableOpacity style={{
                width: '100%',
            }}> */}
                <YStack w="100%" >
                    <XStack columnGap={10} w="100%" px={10} py={10}  >
                        <Avatar circular >
                        <Avatar.Image source={{ uri: data?.image ?? Utils.diceImage(data?.name ?? 'community') }} alt="community" />
                            <Avatar.Fallback
                                bg="lightgray"
                            />
                        </Avatar>
                        <YStack flex={1} rowGap={10}  >
                            <XStack justifyContent='space-between' w="100%" >
                                <YStack>
                                    <Text fontWeight={"$5"} fontSize={"$sm"}>
                                    {data?.name}
                                    </Text>
                                    <Text fontSize={'$xs'} color={'$sideText'} >
                                    /{data?.name}
                                    </Text>
                                </YStack>
                                {
                                data?.creator?.address == delegateManager.owner ?
                                        <Text color={'rgb(253,33,85)'} >owner</Text> :
                                        <Text
                                            color={
                                            IS_MEMBER ? 'rgb(127,88,153)' : IS_HOST ? 'rgb(253,33,85)' : 'gray'
                                            }
                                        >
                                            {
                                            IS_MEMBER ? 'member' : IS_HOST ? 'host' : ''
                                            }
                                        </Text>
                                }
                            </XStack>
                            <Text w="100%" fontSize={"$sm"} >
                                {
                                data?.description
                                }
                            </Text>
                        </YStack>
                    </XStack>
                </YStack>
            {/* </TouchableOpacity> */}
        </Link>
    )
}

export default UserMembership