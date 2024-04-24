import { View, Text, XStack, Spinner, YStack } from 'tamagui'
import React, { useCallback, useContext, useDeferredValue, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ACCOUNTS_SEARCH_QUERY } from '../../../../utils/queries'
import delegateManager from '../../../../lib/delegate-manager'
import { Dimensions, FlatList } from 'react-native'
import ProfileCard from '../../../../components/ui/profile/profile-card'
import account from '../../../../contract/modules/account'
import searchContext from '../context'
import Loading from '../../../../components/ui/feedback/loading'
import Empty from '../../../../components/ui/feedback/empty'
import { Utils } from '../../../../utils'
const DEVICE_HEIGHT = Dimensions.get('screen').height

const PeopleSearch = () => {
  const { search } = useContext(searchContext)
  const [lastSearch, setLastSearch] = useState<any>()

  const defferedSearchValue = useDeferredValue(search)
  const peopleSearchQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
    variables: {
      search: defferedSearchValue,
      page: 0,
      size: 20
    },
    skip: !delegateManager.owner,
    onCompleted: (data) => {
      if (!lastSearch) {
        setLastSearch(data)
      }
    },
    onError: console.log
  })

  const renderItem = useCallback(({ item }: any) => {
    return (
      <ProfileCard
        search={search}
        data={item}
      />
    )
  }, [])

  const handleFetchTop = async () => {
    if (peopleSearchQuery.loading) return null
    await peopleSearchQuery.fetchMore({
      variables: {
        page: 0,
        size: 20,
        search: defferedSearchValue
      }
    })
  }

  const handleFetchMore = async () => {
    if (peopleSearchQuery.loading) return null
    const currentPage = Math.floor(((peopleSearchQuery.data?.accounts?.length ?? 0) / 20) - 1)
    const next = currentPage + 1
    console.log(next)
    await peopleSearchQuery.fetchMore({
      variables: {
        page: next,
        size: 20,
        search: defferedSearchValue
      }
    })
  }

  return (
    <YStack flex={1} w="100%" h="100%" >
      <FlatList
        style={{
          flex: 1,
          width: '100%',
          height: '100%'
        }}
        refreshing={false}
        data={peopleSearchQuery.data?.accounts?.filter((account) => account.address !== delegateManager.owner)}
        keyExtractor={(item) => item.address}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onRefresh={handleFetchTop}
        onEndReached={handleFetchMore}
        onEndReachedThreshold={1}
        contentContainerStyle={{
          paddingBottom: 40
        }}
        ListEmptyComponent={() => {
          if (peopleSearchQuery.loading) return <Loading
            height={DEVICE_HEIGHT - 400}
          />
          return <Empty
            flex={1}
            height={DEVICE_HEIGHT - 400}
            emptyText='No users found'
            px={20}
          />
        }}

      />
    </YStack>
  )
}

export default PeopleSearch