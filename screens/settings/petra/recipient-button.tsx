import { View, Text, XStack, Avatar } from 'tamagui'
import React, { memo } from 'react'
import { Account } from '../../../__generated__/graphql'
import { Utils } from '../../../utils'
import { Link, useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { TouchableOpacity } from 'react-native'
import { isUndefined } from 'lodash'

interface Props {
    data: Partial<Account & { is_address_only: boolean, disabled?: boolean }>
}

const RecipientProfile = (props: Props) => {
    const { data } = props
    const router = useRouter()
    console.log("IS DISABLED ::", data?.disabled)


    const handlePress = () => {
        if (data?.disabled) return
        // @ts-expect-error - route type suck
        router.push('/settings/wallet/amount?recipient=' + data.address)
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={data?.disabled}
        >
            <View
                flexDirection='row'
                columnGap={10}
                paddingHorizontal={Utils.dynamicWidth(3)}
                paddingVertical={Utils.dynamicHeight(1)}
                borderWidth={data?.disabled ? undefined : 1}
                borderColor={data?.disabled ? undefined : '$border'}
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
                    {data?.username && <View flexDirection="row" alignItems="center" justifyContent="space-between" >
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

                    </View>}
                    {
                        !data?.username && <Text>
                            {data?.address?.slice(0, 6) + "..." + data?.address?.slice(-4)}
                        </Text>
                    }
                    {/* Bio */}
                    <View w="100%" marginTop={8}>
                        <Text fontSize={"$sm"}>
                            {data?.profile?.bio}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    )
}

const RenderAddress = (props: Props) => {
    const { data } = props

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: data.address! // WE ASSUME to get to this point the address is not null
        }
    })

    if (profileQuery.loading) return null



    return (
        <RecipientButton data={profileQuery.data?.account ? {
            ...(profileQuery?.data?.account ?? null),
            disabled: data.disabled
        } : {
            address: data.address,
            profile: {
                pfp: Utils.diceImage(data.address!)
            },
            disabled: data.disabled
        }} />
    )

}

export const RecipientButton = (props: Props) => {
    const { data } = props
    const isAddressOnly = data.is_address_only

    return (
        isAddressOnly ? <RenderAddress data={data} /> : <RecipientProfile data={data} />
    )
}



export default memo(RecipientButton)