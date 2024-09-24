
import "../../../global"
import { Dot, Heart, MessageSquare, MoreHorizontal, MoreVertical, Repeat2, Reply } from "@tamagui/lucide-icons";
import { Avatar, Separator, Text, View, XStack, YStack, useTheme } from "tamagui";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { Publication, PublicationStats } from "../../../__generated__/graphql";
import FeedImage from "./image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "expo-router";
import PublicationReactions from "./reactions";
import ContentPreviewContainer from "./content-preview-container";
import { Utils } from "../../../utils";
import HighlightMentions from "./highlight-mentions";
import PublicationAction from "./publication-action";
import LinkResolver from "./link-resolver";
import { getMutedUsers, getRemovedFromFeed } from "../../../contract/modules/store-getters";
import ErrorBoundary from "../../helpers/error-boundary";
import RankBadge from "../../badges/rank-badge";
import MediaViewer from "../media/media-viewer";
import BaseAvatar from "../avatar";

dayjs.extend(relativeTime);

interface BaseContentContainerProps {
  data: Partial<
    Publication & {
      stats: PublicationStats;
    }
  >;
  inCommunityFeed?: boolean;
}

const extractLinks = (content: string) => {
  const regex = /(?:^|\s)(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/g;
  return content.match(regex);
};

function BaseContentContainer(props: BaseContentContainerProps) {
  const { data: _data, inCommunityFeed } = props;
  const data = _data?.type == 4 ? _data?.parent : _data;
  const [hide, setHide] = useState(false);
  const triggerHide = useCallback(() => {
    setHide(true);
  }, []);

  const contentLinks = useMemo(() => {
    return extractLinks(data?.content?.content ?? "") ?? [];
  }, [, data?.content?.content]);

  const DATE_VALUE = useMemo(() => {
    return data?.timestamp ? Utils.formatTimestamp(data?.timestamp) : ''
  }, [data?.timestamp]);

  if (hide) return null;
  if (getMutedUsers()?.includes(data?.creator?.id!)) return null;
  if (getRemovedFromFeed()?.includes(data?.publication_ref!)) return null;

  const HAS_LONG_USERNAME =
    (data?.creator?.username?.username.length ?? 0) > 16;
  const HAS_LONG_DISPLAY_NAME =
    (data?.creator?.profile?.display_name?.length ?? 0) > 16;

  return (
    <YStack
      w="100%"
      // borderBottomWidth={0.5}
      // borderColor={"$borderColor"}
      py={10}
      px={20}
      // pb={10}
    >
      {_data?.type == 4 && (
        <Link
          href={{
            pathname: "/home/tabs/home/[ref]",
            params: {
              "ref": data?.publication_ref!,
            },
          }}
        >
          <View flexDirection="row" alignItems="center" pb={10} columnGap={10}>
            <Repeat2 size={"$1"} />
            <Text color="gray" fontSize={"$xxs"}>
              @{data?.creator?.username?.username} Reposted
            </Text>
          </View>
        </Link>
      )}
      {_data?.type == 3 && _data?.parent && (
        <Link
          asChild
          href={{
            pathname: "/home/tabs/home/[ref]",
            params: {
              "ref": data?.parent?.publication_ref!,
            },
          }}
        >
          <View flexDirection="row" alignItems="center" pb={10} columnGap={10}>
            <Reply size={10} />
            <Text color="gray" fontSize={10}>
              Replied to @{data?.parent?.creator?.username?.username}
            </Text>
          </View>
        </Link>
      )}

      <View w="100%" rowGap={10}>
        <XStack columnGap={15} >
          <Link
            asChild
            href={{
              pathname: "/profiles/[address]/",
              params: {
                address: data?.creator?.address!,
              },
            }}
          >
            <BaseAvatar size={'$md'} src={Utils.parseAvatarImage(
                data?.creator?.address ?? "1",
                data?.creator?.profile?.pfp as string
            )} />
          </Link>
          <View
            flex={1}
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Link
              href={{
                pathname: "/profiles/[address]/",
                params: {
                  address: data?.creator?.address!,
                },
              }}
              asChild
            >
              <YStack justifyContent="space-between" >
                <XStack w="100%" columnGap={5} alignItems="center">
                  <Text fontSize={18} fontWeight={'600'} >
                    {HAS_LONG_DISPLAY_NAME
                      ? `${data?.creator?.profile?.display_name?.slice(
                        0,
                        10
                      )}...`
                      : data?.creator?.profile?.display_name}
                  </Text>
                  <XStack columnGap={5} alignItems="center">
                    <RankBadge user_address={
                      data?.creator?.address!
                    } />
                  </XStack>
                </XStack>
                <Text color={"$sideText"}>
                  @
                  {HAS_LONG_USERNAME
                    ? `${data?.creator?.username?.username.slice(0, 10)}...`
                    : data?.creator?.username?.username}
                </Text>
              </YStack>
            </Link>
            {/* <MoreHorizontal /> */}
            <XStack alignItems="center" columnGap={10} >
              <Text color={"$sideText"}>{DATE_VALUE}</Text>
              <PublicationAction
                publicationId={data?.id ?? 0}
                publicationRef={data?.publication_ref ?? ""}
                userAddress={data?.creator?.address ?? ""}
                userId={data?.creator?.id ?? 0} // OPtimistically making the assumption a value will always be present
                triggerHide={triggerHide}
                publication_type={data?.type ?? 1}
              />
            </XStack>
          </View>
        </XStack>
        {data?.type == 4 && (
          <XStack w="100%" alignItems="center" columnGap={5}>
            <Repeat2 />
            <Text fontFamily={"$heading"}>Reposted</Text>
          </XStack>
        )}
        <Link
          href={{
            pathname: "/home/tabs/home/[ref]",
            params: {
              "ref": data?.publication_ref!,
            },
          }}
          asChild
        >
          {/* Content */}
          <View w="100%" flex={1}>
            <YStack w="100%" paddingBottom={10}>
              <Text color={"$text"} fontSize={20} >
                <HighlightMentions
                  content={`${data?.content?.content} ${__DEV__ ? `${data?.id}` : ""
                    }`}
                  tags={data?.content?.tags}
                  mentions={data?.content?.mentions}
                />
              </Text>
              {contentLinks?.map((link, i) => {
                return (
                  <LinkResolver
                    link={link}
                    key={i}
                    publication_ref={data?.publication_ref ?? ""}
                    kid={data?.id ?? 0}
                  />
                );
              })}
            </YStack>
            <MediaViewer
              data={data?.content?.media ?? []}
            />
          </View>
        </Link>
        {data?.parent && data?.type == 2 && (
          <View w="100%" px={5}>
            <ContentPreviewContainer data={data?.parent} />
          </View>
        )}

        <View flexDirection="row" columnGap={20} w="100%">
          <PublicationReactions
            initialStats={data?.stats}
            publication_ref={data?.publication_ref as string}
            // @ts-expect-error - ignoring for now  // TODO: fix me
            publication={data}
          />
        </View>
      </View>
      <Separator borderColor={'$border'} pt={20} />
    </YStack>
  );
}


export default memo(BaseContentContainer);