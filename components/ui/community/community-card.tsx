import { View, Text, YStack, XStack, Avatar, Button, Separator } from 'tamagui'
import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_MEMBERSHIP } from '../../../utils/queries';
import delegateManager from '../../../lib/delegate-manager';
import communityModule from '../../../contract/modules/community';
import { Link } from 'expo-router';
import { Utils } from '../../../utils';
interface COMMUNITY {
    __typename?: "Community" | undefined;
    id: number;
    name: string;
    description: string;
    image: string;
    timestamp: any;
}
interface Props {
    community?: COMMUNITY
}
const CommunityCard = (props: Props) => {
    const { community } = props

    const membershipQuery = useQuery(GET_MEMBERSHIP, {
        variables: {
            communityName: community?.name!,
            userAddress: delegateManager.owner!
        },
        skip: !delegateManager.owner || !community?.name
    })

    const handleToggleFollow = async () => {
        try {
            console.log(membershipQuery?.data)
            if (membershipQuery?.data?.membership) {
                await communityModule.unFollow(community?.name!)
            } else {
                await communityModule.follow(community?.name!)
            }

        }
        catch (e) {
            console.log("Error: ", e)
        }
    }

    return (
        <YStack w="100%" >
            <XStack columnGap={5} w="100%" p={10} paddingHorizontal={Utils.dynamicWidth(2)}>
                <Link asChild href={{
                    pathname: '/(tabs)/feed/communities/[name]/',
                    params: {
                        name: community?.name!
                    }
                }} >

                    <Avatar circular size={"$3"} mr={5}>
                        <Avatar.Image
                            src={community?.image! ?? ""}
                            accessibilityLabel="Community Picture"
                        />
                        <Avatar.Fallback
                            backgroundColor="$pink10"
                        />
                    </Avatar>
                </Link>
                <YStack
                    flex={1}
                    rowGap={5}
                >
                    <XStack w="100%" justifyContent='space-between' >
                        <Link asChild href={{
                            pathname: '/(tabs)/feed/communities/[name]/',
                            params: {
                                name: community?.name!
                            }
                        }} >
                            <YStack>
                                <Text color={"$text"} fontWeight={"$5"} fontSize={"$sm"}>
                                    {community?.name}
                                </Text>
                                <Text fontSize={'$1'} color={'$sideText'} >
                                    /{community?.name}
                                </Text>
                            </YStack>
                        </Link>
                        {membershipQuery?.data?.membership?.type !== 0 && <Button backgroundColor={ membershipQuery?.data?.membership ? "$colourlessButton":"$button"} borderWidth={ membershipQuery?.data?.membership ? 1 : 0} borderColor={"$button"} color={membershipQuery?.data?.membership ?  "$text" : "$buttonText"} onPress={handleToggleFollow} size='$3' >
                            {
                                membershipQuery?.data?.membership ? "Following" : "Follow"
                            }
                        </Button>}
                    </XStack>
                    <Text pb={10} fontSize={"$sm"}>
                        {community?.description}
                    </Text>
                </YStack>
            </XStack>
            <Separator />
        </YStack>
    )
}

export default CommunityCard