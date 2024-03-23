import React from 'react'
import { Spinner, XStack, YStack } from 'tamagui'
import { useQuery } from '@apollo/client'
import { GET_ACCOUNT_FOLLOWERS } from '../../../utils/queries'
import ProfileCard from '../../../components/ui/profile/profile-card'
import { FlatList } from 'react-native'

interface Props {
  address: string
}
const Followers = (props: Props) => {
  const { address } = props
  console.log(address)
  const followersQuery = useQuery(GET_ACCOUNT_FOLLOWERS, {
    variables: {
      accountAddress: address,
      page: 0,
      size: 20
    }
  })

  const handleFetchMore = async () => {
    if (followersQuery.loading) return null
    const currentPage = Math.floor(((followersQuery.data?.followers?.length ?? 0) / 20)) - 1
    const next = currentPage + 1
    await followersQuery.fetchMore({
      variables: {
        page: next,
        size: 20,
        accountAddress: address
      }
    })
  }

  const handleFetchTop = async () => {
    if (followersQuery.loading) return null
    await followersQuery.fetchMore({
      variables: {
        page: 0,
        size: 20,
        accountAddress: address
      }
    })
  }

  return (
    <YStack backgroundColor={'$background'} flex={1} >
      <FlatList
        data={followersQuery?.data?.followers}
        keyExtractor={(item) => item?.address}
        renderItem={({ item }) => {
          return <ProfileCard
            data={item as any}
          />
        }}
        onEndReached={handleFetchMore}
        onEndReachedThreshold={1}
        onStartReached={handleFetchTop}
        onStartReachedThreshold={1}
        ListFooterComponent={() => {
          return <XStack w="100%" alignItems='center' justifyContent='center' p={20} >
            {
              followersQuery.loading ? <Spinner /> : null
            }
          </XStack>
        }}
      />
    </YStack>
  )
}

export default Followers