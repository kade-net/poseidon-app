import { View, Text, Avatar, YStack, Separator, Button } from 'tamagui'
import React from 'react'
import { Account } from '../../../__generated__/graphql'
import account from '../../../contract/modules/account'
import { useQuery } from '@apollo/client'
import { GET_FOLLOW_ACCOUNT } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Link } from 'expo-router'


interface Props {
    data: Partial<Account>
    search?: string
}

const ProfileCard = (props: Props) => {
    const { data, search } = props

    const queryData = useQuery(GET_FOLLOW_ACCOUNT, {
        variables: {
            address: data?.address!,
            viewer: delegateManager.owner!
        },
        skip: !data?.address
    })

    const handleFollowToggle = async () => {
        try {
            if (queryData?.data?.account?.viewer?.follows) {
                await account.unFollowAccount(data?.address!, search)
            } else {
                await account.followAccount(data?.address!, search)
            }
        }
        catch (e) {
            console.log("Error: ", e)
        }
    }


    return (
        <YStack w="100%" >
            <View
                flexDirection='row'
                columnGap={10}
                p={10}
            >
                <Link asChild href={{
                    pathname: '/profiles/[address]/',
                    params: {
                        address: data?.address!
                    }
                }} >

                    <View
                        h="100%"
                        w="10%"
                    >
                        <Avatar circular size={"$3"} >
                            <Avatar.Image
                                src={data?.profile?.pfp! ?? ""}
                                accessibilityLabel="Profile Picture"
                            />
                            <Avatar.Fallback
                                backgroundColor="$pink10"
                            />
                        </Avatar>
                    </View>
                </Link>
                <View w="90%" rowGap={5} >
                    <View flexDirection="row" alignItems="center" justifyContent="space-between" >
                        <View flexDirection="row" alignItems="flex-start" columnGap={10}>
                            <Link asChild href={{
                                pathname: '/profiles/[address]/',
                                params: {
                                    address: data?.address!
                                }
                            }} >
                                <View>
                                    <Text>
                                        {data?.profile?.display_name}
                                    </Text>
                                    <Text fontSize={'$1'} color={'$gray10'} >
                                        @{data?.username?.username}
                                    </Text>
                                </View>
                            </Link>

                        </View>
                        <View>
                            <Button onPress={handleFollowToggle} size={'$2'}
                                variant={queryData?.data?.account?.viewer?.follows ? "outlined" : undefined}
                            >
                                {
                                    queryData?.data?.account?.viewer?.follows ? "Following" : "Follow"
                                }
                            </Button>
                        </View>
                    </View>
                    {/* Bio */}
                    <View w="100%" >
                        <Text>
                            {data?.profile?.bio}
                        </Text>
                    </View>


                </View>
            </View>
            <Separator w="100%" />
        </YStack>
    )
}

export default ProfileCard