import { View, Text, Spinner, XStack, Avatar, YStack, Button, H3, H4, H5, H6, useTheme, Separator } from 'tamagui'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ACCOUNT_STATS, GET_MY_PROFILE, GET_RELATIONSHIP } from '../../utils/queries'
import delegateManager from '../../lib/delegate-manager'
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view'
import { Animated, Platform, useWindowDimensions } from 'react-native'
import { clone } from 'lodash'
import { SceneProps } from './tabs/common'
import PostsTab from './tabs/posts'
import RepostsTab from './tabs/reposts'
import LikesTab from './tabs/likes'
import NftsTab from './tabs/nfts'
import { useMultiScrollManager } from '../../components/hooks/useMultiScrollManager'
import TabNavbar from './tab-navbar'
import account from '../../contract/modules/account'
import { Link } from 'expo-router'
import { Utils } from '../../utils'
import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'
import { useQuery as uzQuery } from 'react-query'
import { aptos } from '../../contract'
import AptosIcon from '../../assets/svgs/aptos-icon'
import BaseButton from '../../components/ui/buttons/base-button'
import Badge from "../../components/badges/badge";
import { GET_RANKING } from '../../lib/convergence-client/queries'
import { convergenceClient } from '../../data/apollo'
import RankBadge from '../../components/badges/rank-badge'
import HighlightMentions from '../../components/ui/feed/highlight-mentions'
import PayIcon from '../../assets/svgs/pay-icon'
import PayButton from '../pay/pay-button'

interface Props {
  address: string;
}

const ProfileDetails = (props: Props) => {
  const tamaguiTheme = useTheme();
  const { address } = props;
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [topSectionHeight, setTopSectionHeight] = useState(0);
  const TabOffset = useMemo(() => {
    return Platform.OS === "ios" ? topSectionHeight : 0;
  }, [topSectionHeight]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [tabRoutes] = useState([
    { key: "posts", title: "Posts" },
    { key: "reposts", title: "Reposts + Replies" },
    { key: "likes", title: "Likes" },
    { key: "nfts", title: "NFTs" },
  ]);

  const scrollManager = useMultiScrollManager(tabRoutes, topSectionHeight);

  const handleCurrentTabIndexChange = (index: number) => {
    setCurrentTabIndex(index);
    scrollManager.setIndex(index);
  };

  const translateY = scrollManager.scrollY.interpolate({
    inputRange: [TabOffset, TabOffset + topSectionHeight],
    outputRange: [0, -topSectionHeight],
    extrapolateLeft: "clamp",
  });

  const renderScene = useCallback(
    (props: SceneProps) => {
      const { route } = props;
      switch (route.key) {
        case "posts":
          return (
            <PostsTab
              topSectionHeight={topSectionHeight}
              manager={scrollManager}
              address={address}
              {...props}
            />
          );
        case "reposts":
          return (
            <RepostsTab
              topSectionHeight={topSectionHeight}
              manager={scrollManager}
              address={address}
              {...props}
            />
          );
        case "likes":
          return (
            <LikesTab
              topSectionHeight={topSectionHeight}
              manager={scrollManager}
              address={address}
              {...props}
            />
          );
        case "nfts":
          return (
            <NftsTab
              topSectionHeight={topSectionHeight}
              manager={scrollManager}
              address={address}
              {...props}
            />
          );
        default:
          return <></>;
      }
    },
    [currentTabIndex, scrollManager.scrollY, topSectionHeight]
  );

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<{
          key: string;
          title: string;
        }>;
      }
    ) => {
      return (
        <TabNavbar
          {...props}
          scrollManager={scrollManager}
          topSectionHeight={topSectionHeight}
          tabRoutes={tabRoutes}
          currentTabIndex={currentTabIndex}
        />
      );
    },
    [topSectionHeight, scrollManager]
  );

  const IS_SAME_ACCOUNT = delegateManager.owner === address;
  const profileQuery = useQuery(GET_MY_PROFILE, {
    variables: {
      address: address,
    },
    skip: !address,
  });

  const accountStatsQuery = useQuery(GET_ACCOUNT_STATS, {
    variables: {
      accountAddress: address,
    },
    skip: !address,
  });

  const relationshipQuery = useQuery(GET_RELATIONSHIP, {
    variables: {
      accountAddress: address,
      viewerAddress: delegateManager.owner!,
    },
    skip: !address || IS_SAME_ACCOUNT,
  });

  const aptosName = uzQuery({
    queryFn: async () => {
      try {
        const ansName = await aptos.getPrimaryName({
          address: address,
        });

        return ansName;
      } catch (e) {
        return null;
      }
    },
    queryKey: ["aptosName", address],
  });

  const rankingQuery = useQuery(GET_RANKING, {
    client: convergenceClient,
    variables: {
      user_address: address
    }
  })

  const handleFollowToggle = async () => {
    Haptics.selectionAsync();
    try {
      const following = relationshipQuery?.data?.accountRelationship?.follows;
      if (following) {
        await account.unFollowAccount(address);
      } else {
        await account.followAccount(address);
      }
    } catch (e) {
      console.log("Error following account", e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
      });
    }
  };

  if (
    profileQuery.loading ||
    accountStatsQuery.loading ||
    relationshipQuery.loading
  ) {
    return (
      <View flex={1} w="100%" h="100%" backgroundColor={"$background"}>
        <Spinner />
      </View>
    );
  }
  return (
    <View flex={1} w="100%" h="100%" pos="relative">
      <Animated.View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          elevation: 0,
          transform: [
            {
              translateY,
            },
          ],
          backgroundColor: tamaguiTheme.background.val,
        }}
        onLayout={(event) => {
          const layout = clone(event?.nativeEvent?.layout);
          setTopSectionHeight(layout?.height ?? 0); // Add the tabbar height as well
        }}
      >
        <YStack px={20}>
          <XStack w="100%" py={10} columnGap={10}>
            <Avatar circular size={"$7"}>
              <Avatar.Image
                source={{
                  uri: Utils.parseAvatarImage(
                    address,
                    (profileQuery.data?.account?.profile?.pfp as string) ?? null
                  ),
                }}
              />
              <Avatar.Fallback bg="lightgray" />
            </Avatar>
            <YStack justifyContent="space-between" w="100%" flex={1}>
              <XStack w="100%" justifyContent="space-between" flex={1}>
                <YStack>
                  <H5>
                    {profileQuery.data?.account?.profile?.display_name}
                  </H5>
                  <XStack columnGap={5}>
                    <Text color="$sideText" fontSize={"$sm"}>
                      @{profileQuery.data?.account?.username?.username}
                    </Text>
                    {aptosName.data && <Separator vertical />}
                    {aptosName.data && (
                      <XStack alignItems="center" columnGap={5}>
                        <AptosIcon size={12} color="white" />
                        <Text color="$primary" fontSize={"$sm"}>
                          {aptosName.data}.apt
                        </Text>
                      </XStack>
                    )}
                  </XStack>
                  {
                    rankingQuery.loading || !rankingQuery.data?.getRanking ? null : (
                      <XStack alignItems='center' columnGap={10} mt={5} >
                        {(rankingQuery.data.getRanking.rank === 'power' || rankingQuery.data.getRanking.rank === 'contributor') && <RankBadge user_address={address} />}
                        <XStack alignItems='center' columnGap={5} >

                          {
                            rankingQuery.data.getRanking.badges?.map((badge, i) => {
                              return (<Badge key={i} badge={badge.type as any} />)
                            })
                          }
                        </XStack>
                      </XStack>
                    )
                  }
                </YStack>
              </XStack>
            </YStack>
          </XStack>
          <XStack>
            <Text color={"$text"} fontSize={"$sm"}>
              <HighlightMentions
                content={profileQuery.data?.account?.profile?.bio ?? ''}
              />
            </Text>
          </XStack>
        </YStack>
        <XStack px={20} w="100%" alignItems="center" columnGap={10} py={10}>
          <XStack columnGap={5}>
            <Text fontWeight={"bold"} color={"$text"}>
              {accountStatsQuery?.data?.accountStats?.following}
            </Text>
            <Link
              asChild
              href={{
                pathname: "/profiles/[address]/following",
                params: {
                  address: address,
                },
              }}
            >
              <Text color="$blue10">Following</Text>
            </Link>
          </XStack>
          <XStack columnGap={5}>
            <Text fontWeight={"bold"} color={"$text"}>
              {accountStatsQuery?.data?.accountStats?.followers}
            </Text>
            <Link
              asChild
              href={{
                pathname: "/profiles/[address]/followers",
                params: {
                  address: address,
                },
              }}
            >
              <Text color="$blue10">Followers</Text>
            </Link>
          </XStack>
        </XStack>
        {!IS_SAME_ACCOUNT &&
          <XStack px={20} w="100%" alignItems='center' justifyContent='space-between' columnGap={10} py={10} >
            <BaseButton
              rounded="full"
              size={"$3"}
              flex={1}
              type={
                relationshipQuery?.data?.accountRelationship?.follows
                  ? "outlined"
                  : "primary"
              }
              onPress={handleFollowToggle}
            >
              {relationshipQuery?.data?.accountRelationship?.follows
                ? "Following"
                : "Follow"}
            </BaseButton>
            <PayButton
              button={(props) => {
                return (
                  <BaseButton size={"$3"} onPress={props.onPress} flex={1} rounded='full' type='outlined' icon={<PayIcon color={undefined} size={20} />} >
                    Pay
                  </BaseButton>
                )
              }}
              reciever={address}
              action='pay'
              currency='APT'
            />

          </XStack>}
      </Animated.View>
      <YStack flex={1} w="100%" h="100%">
        <TabView
          swipeEnabled={false}
          navigationState={{
            index: currentTabIndex,
            routes: tabRoutes,
          }}
          style={[
            {
              backgroundColor: tamaguiTheme.background.val,
            },
          ]}
          onIndexChange={handleCurrentTabIndexChange}
          renderScene={renderScene}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </YStack>
    </View>
  );
};

export default memo(ProfileDetails)