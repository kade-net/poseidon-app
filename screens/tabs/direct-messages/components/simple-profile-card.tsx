import { View, Text, YStack, XStack, Avatar, Button } from 'tamagui'
import React from 'react'
import { Account } from '../../../../__generated__/graphql'
import { Utils } from '../../../../utils'
import { TouchableOpacity } from 'react-native'
import { CAccount } from '../../../../lib/convergence-client/__generated__/graphql'

interface Props {
  data: Partial<CAccount>
}

const SimpleProfileCard = (props: Props) => {
  const { data } = props
  return (
    <XStack backgroundColor={"$background"} w="100%" alignItems='center' columnGap={10} px={10} py={10} >
      <Avatar circular size={'$3'} >
        <Avatar.Image
          src={
            Utils.parseAvatarImage(data?.address! ?? '1', data?.pfp! ?? null)
          }
          accessibilityLabel='Profile Picture'
        />
        <Avatar.Fallback
          backgroundColor={'$pink10'}
        />
      </Avatar>
      <YStack w="100%" >
        <Text fontWeight={'$5'} fontSize={'$sm'} >
          {data?.display_name}
        </Text>
        <Text fontSize={'$xs'} color={'$sideText'} >
          @{data?.username}
        </Text>
      </YStack>
    </XStack>
  )
}

export default SimpleProfileCard