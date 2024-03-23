import { View, Text, XStack, Spinner } from 'tamagui'
import React, { useCallback, useDeferredValue } from 'react'
import { useQuery } from '@apollo/client'
import { ACCOUNTS_SEARCH_QUERY } from '../../../../utils/queries'
import delegateManager from '../../../../lib/delegate-manager'
import { FlatList } from 'react-native'
import ProfileCard from '../../../../components/ui/profile/profile-card'
import account from '../../../../contract/modules/account'

interface Props {
  search: string
}
const PeopleSearch = (props: Props) => {
  const { search } = props
  const defferedSearchValue = useDeferredValue(search)
  const peopleSearchQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
    variables: {
      search: defferedSearchValue,
      page: 0,
      size: 20
    },
    skip: !delegateManager.owner,
    onCompleted: (data) => console.log("Users::", data.accounts?.length),
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
    <FlatList
      refreshing={peopleSearchQuery?.loading}
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
      ListFooterComponent={() => {
        return (
          <XStack w="100%" alignItems='center' justifyContent='center' columnGap={20} >
            {peopleSearchQuery?.loading && <Spinner />}
          </XStack>
        )
      }}

    />
  )
}

export default PeopleSearch