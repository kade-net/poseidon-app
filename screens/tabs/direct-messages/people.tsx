import { View, Text, YStack, XStack, useTheme, Separator } from 'tamagui'
import React, { useCallback, useDeferredValue, useState } from 'react'
import SearchInput from '../../../components/ui/search-input'
import { ACCOUNTS_SEARCH_QUERY } from '../../../utils/queries'
import { useQuery } from '@apollo/client'
import SimpleProfileCard from './components/simple-profile-card'
import { FlatList, TouchableOpacity } from 'react-native'
import useDisclosure from '../../../components/hooks/useDisclosure'
import BaseContentSheet from '../../../components/ui/action-sheets/base-content-sheet'
import { Account } from '../../../__generated__/graphql'
import BaseButton from '../../../components/ui/buttons/base-button'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'
import * as Haptic from 'expo-haptics'
import hermes from '../../../contract/modules/hermes'
import Toast from 'react-native-toast-message'

const People = () => {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const searchValue = useDeferredValue(search)
  const theme = useTheme()
  const peopleSearchQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
    variables: {
      search: searchValue,
      page: 0,
      size: 20
    }
  })
  const [selectedProfile, setSelectedProfile] = useState<Partial<Account> | null>(null)
  const { onOpen, isOpen, onToggle, onClose } = useDisclosure()

  const handleSelectProfile = (profile: any) => {
    setSelectedProfile(profile)
    onOpen()
  }

  const handleSendRequest = async () => {
    if (!selectedProfile?.address) {
      Haptic.notificationAsync(Haptic.NotificationFeedbackType.Error)
      return
    }
    setLoading(true)
    Haptic.selectionAsync()
    const result = await hermes.requestConversation(selectedProfile.address)
    console.log("Result::", result)

    if (result.error) {
      Haptic.notificationAsync(Haptic.NotificationFeedbackType.Error)
      console.log("Something went wrong::", result.error)
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later'
      })
    }

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Request sent',
        text2: 'Wait for the user to accept the request'
      })
      console.log("Hash::", result.data)
    }
    setLoading(false)
    onClose()
  }

  const renderItem = useCallback(({ item }: any) => {
    return (
      <TouchableOpacity onPress={() => {
        handleSelectProfile(item)
      }} style={{ width: '100%' }} >
        <SimpleProfileCard
          data={item}
        />
      </TouchableOpacity>
    )
  }, [])


  return (
    <YStack flex={1} w="100%" h="100%" p={20} backgroundColor={'$background'} rowGap={20} >
      <XStack w="100%" >
        <SearchInput onChangeText={setSearch} />
      </XStack>
      <YStack flex={1} w="100%" h="100%" >
        <FlatList
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: theme.baseBackround.val,
            borderRadius: 20,
            overflow: 'hidden'
          }}
          ItemSeparatorComponent={() => <Separator />}
          showsVerticalScrollIndicator={false}
          data={peopleSearchQuery.data?.accounts ?? []}
          keyExtractor={(item) => item.address}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            if (peopleSearchQuery.loading) return <Loading
              p={20}
              w="100%"
              h="100%"
              flex={1}
            />

            return <Empty
              p={20}
              emptyText='No results found'
            />
          }}

        />
      </YStack>
      <BaseContentSheet
        snapPoints={[25]}
        showOverlay
        open={isOpen}
        onOpenChange={onToggle}
      >
        <YStack p={20} w="100%" h="100%" flex={1} rowGap={20} >
          {selectedProfile && <SimpleProfileCard
            data={selectedProfile}
          />}
          <XStack columnGap={10} w="100%" alignItems='center' >
            <BaseButton onPress={() => {
              onClose()
              setSelectedProfile(null)
            }} flex={1} type="outlined" >
              <Text>
                Cancel
              </Text>
            </BaseButton>
            <BaseButton loading={loading} flex={1} onPress={handleSendRequest} >
              <Text>
                Send Request
              </Text>
            </BaseButton>
          </XStack>
        </YStack>
      </BaseContentSheet>
    </YStack>
  )
}

export default People