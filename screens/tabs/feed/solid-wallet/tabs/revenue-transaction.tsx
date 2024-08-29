import { View } from 'react-native'
import React from 'react'
import { Avatar, XStack, YStack, Text, Image } from 'tamagui'
import { Coins, HelpingHand, Sparkles } from '@tamagui/lucide-icons'
import {WalletNotification} from "../../../../../lib/convergence-client/__generated__/graphql";
import {useQuery} from "@apollo/client";
import {GET_MY_PROFILE} from "../../../../../utils/queries";
import {Utils} from "../../../../../utils";
import { MotiView } from 'moti'
import {Skeleton} from "moti/skeleton";

const AMOUNT_REGEX = /\d+\s?\$(GUI|APT)/gi


type TransactionType = {
    type: 'mint' | 'tip' | 'pay'
    icon: () => React.ReactNode
    color: string
}

const transactionTypes: Array<TransactionType> = [
    {
        type: 'mint',
        icon: () => <Sparkles color={'#FF4500'} />,
        color: '#FFEB3B'
    },
    {
        type: 'tip',
        icon: () => <Coins color={'#FFA500'} />,
        color: '#1E3A8A'
    },
    {
        type: 'pay',
        icon: () => <HelpingHand color={'#FFD700'} />,
        color: '#006400'
    }
]

function FormatAmount(text: string, color: string) {
    const parts = text.split(AMOUNT_REGEX)
    console.log(parts, text)
    return parts.map((part, index) => {
        if (AMOUNT_REGEX.test(part)) {
            return <Text key={index} color={color}>{part}</Text>
        }
        return <Text key={index}>{part}</Text>
    })

}



interface Props {
    data: WalletNotification
}

const RevenueTransaction = (props: Props) => {
    const { data } = props
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: data?.sender_address!
        }
    })
    const transactionType = transactionTypes.find(t => t?.type === data?.type)

    if(profileQuery?.loading) {
        return (
            <XStack w={"100%"} >
                <MotiView
                    transition={{
                        type: 'timing'
                    }}
                    style={{
                        width: '100%',
                    }}
                >
                    <Skeleton
                        colorMode='dark'
                        height={60}
                        width={'100%'}
                    />
                </MotiView>
            </XStack>
        )
    }

    return (
        <XStack bg="$border" borderRadius={10} p={10} alignItems='center' justifyContent='space-between' >
            <XStack alignItems='center' columnGap={10} >
                <XStack w={30} h={30} alignItems='center' justifyContent='center' borderRadius={100} bg={transactionType?.color ?? '#006400'} >
                    {transactionType?.icon()}
                </XStack>
                <Avatar circular size={'$3'} >
                    <Avatar.Image
                        src={Utils.parseAvatarImage(data?.receiver_address ?? '0x', profileQuery?.data?.account?.profile?.pfp)}

                    />
                    <Avatar.Fallback />
                </Avatar>
                <YStack>
                    <Text fontWeight={'600'} >
                        {profileQuery?.data?.account?.profile?.display_name}
                    </Text>
                    <Text fontSize={14} color={'$sideText'} >
                        {
                            data?.type == 'pay' ? `You received ${data?.amount} ${data?.currency ?? ''}` :
                                data?.type == 'tip' ? `You got a tip ${data?.amount} ${data?.currency ?? ''}` : ''
                        }
                    </Text>
                </YStack>
            </XStack>




        </XStack>
    )
}

export default RevenueTransaction