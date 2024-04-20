import React, { useDeferredValue } from 'react'
import { H4, Separator, YStack } from 'tamagui'
import { Utils } from '../../../utils'
import { useQuery } from '@apollo/client'
import { ACCOUNTS_SEARCH_QUERY } from '../../../utils/queries'
import { FlatList } from 'react-native'
import RecipientButton from './recipient-button'
import { Inbox, User } from '@tamagui/lucide-icons'
import { Account } from '../../../__generated__/graphql'

interface Props {
  search?: string
}
function RecipientSearchResults(props: Props) {
  const { search } = props
  const searchTerm = useDeferredValue(search ?? '')
  console.log("Search term::", searchTerm)
  const IS_VALID_ADDRESS = Utils.isAptosAddress(searchTerm)
  const IS_VALID_USERNAME = Utils.isValidUsername(searchTerm)

  const recipientsQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
    variables: {
      page: 0,
      size: 20,
      search: searchTerm
    },
    skip: !searchTerm || IS_VALID_ADDRESS && !IS_VALID_USERNAME
  })

  return (
    <YStack flex={1} width={'100%'} height={'100%'} >
      <FlatList
        data={IS_VALID_USERNAME ? (recipientsQuery?.data?.accounts ?? []) : IS_VALID_ADDRESS ? [
          {
            address: searchTerm,
            profile: {
              pfp: Utils.diceImage(searchTerm),
            },
            is_address_only: true
          }
        ] as Array<Account & { is_address_only: boolean }> : []}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => {
          return (
            <RecipientButton
              data={item}
            />
          )
        }}
        contentContainerStyle={{
          padding: 20
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Separator />}
        refreshing={recipientsQuery.loading}
        onRefresh={() => !recipientsQuery.loading && recipientsQuery.refetch()}
        ListEmptyComponent={() => {
          if (searchTerm.length > 1) return (
            <YStack p={20} w="100%" alignItems='center' rowGap={10} >
              <User />
              <H4>
                No results found
              </H4>
            </YStack>
          )
          if (searchTerm.length == 0) return (
            <YStack p={20} w="100%" alignItems='center' rowGap={10} >
              <User />
              <H4>
                Search for a recipient
              </H4>
            </YStack>
          )
        }}
      />
    </YStack>
  )
}

export default RecipientSearchResults