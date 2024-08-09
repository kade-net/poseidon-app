import { Animated, Dimensions, Platform } from 'react-native'
import React, { memo, useCallback } from 'react'
import { ProfileTabsProps, SceneProps, ScrollManager } from './common'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, GET_PUBLICATIONS } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Button, Spinner, Text, View, XStack, YStack } from 'tamagui'
import BaseContentContainer from '../../../components/ui/feed/base-content-container'
import { useGlobalSearchParams } from 'expo-router'
import { isEmpty } from 'lodash'
import account from '../../../contract/modules/account'
import publications from '../../../contract/modules/publications'
import Loading from '../../../components/ui/feedback/loading'
import Empty from '../../../components/ui/feedback/empty'
import client from '../../../data/apollo'

let DEVICE_HEIGHT = Dimensions.get('screen').height

const PublicationAnimatedFlatList = (props: ProfileTabsProps & {
  types?: number[],
  reaction?: number,
  address?: string
}) => {
  const { address } = props
  console.log("Address", address)
  const profileQuery = useQuery(GET_MY_PROFILE, {
    variables: {
      address
    }
  })
  const postsQuery = useQuery(GET_PUBLICATIONS, {
    variables: {
      page: 0,
      size: 20,
      address: address,
      types: props.types ?? [1, 3],
      reaction: props.reaction,
      muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
      hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
    },
    fetchPolicy: 'cache-and-network',
    skip: !address
  })

  const handleFetchMore = async () => {
    try {
      const totalPublications = postsQuery?.data?.publications?.length ?? 0
      const nextPage = (Math.floor(totalPublications / 20) - 1) + 1
      // console.log("Next page", nextPage)
      const results = await postsQuery.fetchMore({
        variables: {
          page: nextPage,
          size: 20
        }
      })

    }
    catch (e) {
      console.log("Error fetching more", e)
    }
  }

  const handleFetchTop = async () => {
    // console.log("Start reached")

    try {
      await postsQuery?.fetchMore({
        variables: {
          page: 0,
          size: 20
        }
      })

      await profileQuery?.refetch()
    }
    catch (e) {
      console.log("Error fetching more", e)
    }
  }

  const renderPublication = useCallback(({ item }: any) => {
    return (
      <BaseContentContainer
        data={item as any}
      />
    )

  }, [])

  return (
    <YStack w="100%" h="100%" >
      <Animated.FlatList
        onMomentumScrollBegin={props.manager.onMomentumScrollBegin}
        onMomentumScrollEnd={props.manager.onMomentumScrollEnd}
        onScrollEndDrag={props.manager.onScrollEndDrag}
        ref={(ref) => props.manager.trackRef(props.route.key, ref as any)}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: props.manager.scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshing={false}
        contentContainerStyle={Platform.select({
          ios: {
            // flexGrow: 1,
            paddingBottom: 40
          },
          android: {
            // flexGrow: 1,
            paddingBottom: 40,
            paddingTop: props.topSectionHeight + 50
          },

        })}
        contentOffset={Platform.select({
          ios: {
            y: -(props.topSectionHeight + 50),
            x: 0
          }
        })}
        contentInset={Platform.select({
          ios: {
            top: props.topSectionHeight + 50,
          }
        })}
        onRefresh={handleFetchTop}
        onEndReached={handleFetchMore}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        data={postsQuery?.data?.publications ?? []}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderPublication}
        ListEmptyComponent={() => {
          if (postsQuery.loading) return <Loading
            h={DEVICE_HEIGHT / 2}
            px={20}
          />
          return <Empty
            loading={postsQuery.loading}
            emptyText={
              `No ${props.route.title} yet`
            }
            px={20}
            onRefetch={handleFetchTop}
            h={DEVICE_HEIGHT / 2}
          />
        }}
        ListHeaderComponent={() => {
          if (postsQuery.loading && (postsQuery?.data?.publications?.length ?? 0) > 0) return <XStack w="100%" alignItems='center' justifyContent='center' >
            <Spinner />
          </XStack>

          return null
        }}
        ListFooterComponent={() => {
          if ((postsQuery.data?.publications?.length ?? 0) == 0) return null
          return <View w="100%" flexDirection='row' alignItems='center' justifyContent='center' columnGap={10} >
            {postsQuery?.loading && <>
              <Text color="$gray9" >
                Loading...
              </Text>
              <Spinner />
            </>}
          </View>
        }}

      />
    </YStack>
  )
}

export default memo(PublicationAnimatedFlatList)