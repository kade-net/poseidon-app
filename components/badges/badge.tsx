import { TouchableOpacity, Image } from "react-native";
import React, { ReactNode } from "react";
import ActiveBadge from "./active";
import CatalystBadge from "./catalyst";
import ExplorerBadge from "./explorer";
import HypeBadge from "./hype";
import PioneerBadge from "./pioneer";
import StreakBadge from "./streak";
import TopPosterBadge from "./top-poster";
import useDisclosure from "../hooks/useDisclosure";
import BaseContentSheet from "../ui/action-sheets/base-content-sheet";
import { H3, Text, XStack, YStack } from "tamagui";
import VerifiedBadge from "./verified";

type BADGE_TYPES =
  | "active"
  | "catalyst"
  | "explorer"
  | "hype"
  | "pioneer"
  | "streak"
  | "top-poster"
  | "verified"

interface BadgeDetails {
  badge: BADGE_TYPES;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  display: () => ReactNode;
}

const badgeDetails: BadgeDetails[] = [
  {
    badge: "active",
    name: "Active Badge",
    color: "#00FF00",
    description: "Awarded for being active on the Poseidon",
    icon: <ActiveBadge />,
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/active.png")}
      />
    ),
  },
  {
    badge: "catalyst",
    name: "Catalyst Badge",
    description: "Awarded for being a catalyst of conversations on Kade",
    icon: <CatalystBadge />,
    color: "#FF4500",
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/catalyst.png")}
      />
    ),
  },
  {
    badge: "explorer",
    name: "Explorer Badge",
    description: "Awarded for making posts in 5 or more communities",
    icon: <ExplorerBadge />,
    color: "#800080",
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/explorer.png")}
      />
    ),
  },
  {
    badge: "hype",
    name: "Hype Badge",
    description: "Made a post with a high number of interactions",
    icon: <HypeBadge />,
    color: "#7DF9FF",
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/hype.png")}
      />
    ),
  },
  {
    badge: "pioneer",
    name: "Pioneer Badge",
    description: "Awarded for being an early adopter of Kade",
    icon: <PioneerBadge />,
    color: "#FFD700",
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/pioneer.png")}
      />
    ),
  },
  {
    badge: "streak",
    name: "Streak Badge",
    description: "Has an ongoing streak of daily posts",
    icon: <StreakBadge />,
    color: "#FF0000",
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/streak.png")}
      />
    ),
  },
  {
    badge: "top-poster",
    name: "Top Poster Badge",
    description: "Has been consistently posting high quality content",
    icon: <TopPosterBadge />,
    color: "#FFA500",
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/top-poster.png")}
      />
    ),
  },
  {
    badge: 'verified',
    name: 'Verified Badge',
    description: 'Awarded for having an aptos domain',
    icon: <VerifiedBadge />,
    color: '#4169E1',
    display: () => (
      <Image
        style={{ borderRadius: 10 }}
        width={80}
        height={80}
        source={require("../../assets/badges/verified.png")}
      />
    ),
  }
];

interface Props {
  badge: BADGE_TYPES;
}
const Badge = (props: Props) => {
  const { badge } = props;
  const badgeDetail = badgeDetails.find((bd) => bd.badge === badge)!;
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        {badgeDetail.icon ?? null}
      </TouchableOpacity>
      <BaseContentSheet
        snapPoints={[30]}
        open={isOpen}
        onOpenChange={() => {
          onClose();
        }}
        level={9}
        dismissOnOverlayPress
      >
        <YStack rowGap={10} flex={1} w="100%" h="100%" p={20}>
          <XStack>{badgeDetail?.display()}</XStack>
          <H3 color={badgeDetail?.color}>{badgeDetail.name}</H3>
          <Text>{badgeDetail.description}</Text>
        </YStack>
      </BaseContentSheet>
    </>
  );
};

export default Badge;
