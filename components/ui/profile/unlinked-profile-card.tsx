import { View, Text, Avatar, YStack, Separator, Button, Spinner } from 'tamagui'
import React from 'react'
import { Account } from '../../../__generated__/graphql'
import account from '../../../contract/modules/account'
import { useQuery } from '@apollo/client'
import { GET_FOLLOW_ACCOUNT } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Utils } from '../../../utils'


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

    if (data?.address === delegateManager.owner) return null


    return (
        <YStack w="100%">
            <View
                flexDirection='row'
                columnGap={10}
                paddingHorizontal={Utils.dynamicWidth(3)}
                paddingVertical={Utils.dynamicHeight(1)}
            >

                    <View
                        h="100%"
                        w="10%"
                    >
                        <Avatar circular size={"$3"} >
                            <Avatar.Image
                            src={data?.profile?.pfp! ?? Utils.diceImage(data?.address! ?? '1')}
                                accessibilityLabel="Profile Picture"
                            />
                            <Avatar.Fallback
                                backgroundColor="$pink10"
                            />
                        </Avatar>
                    </View>
                <View w="90%" rowGap={5} >
                    <View flexDirection="row" alignItems="center" justifyContent="space-between" >
                        <View flexDirection="row" alignItems="flex-start" columnGap={10}>
                                <View>
                                    <Text fontWeight={"$5"} fontSize={"$sm"}>
                                        {data?.profile?.display_name}
                                    </Text>
                                    <Text fontSize={'$xs'} color={'$sideText'} >
                                        @{data?.username?.username}
                                    </Text>
                                </View>
                        </View>
                        <View>
                            {queryData?.loading ? <Spinner /> : <Button onPress={handleFollowToggle} size={"$3"} backgroundColor={queryData?.data?.account?.viewer?.follows ? "$colourlessButton" : "$button"} borderWidth={queryData?.data?.account?.viewer?.follows ? 1 : 0} borderColor={"$button"} color={queryData?.data?.account?.viewer?.follows ? "$text" : "$buttonText"} mr={10}
                                variant={queryData?.data?.account?.viewer?.follows ? "outlined" : undefined}
                            >
                                {
                                    queryData?.data?.account?.viewer?.follows ? "Following" : "Follow"
                                }
                            </Button>}
                        </View>
                    </View>
                    {/* Bio */}
                    <View w="100%" marginTop={8}>
                        <Text fontSize={"$sm"}>
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