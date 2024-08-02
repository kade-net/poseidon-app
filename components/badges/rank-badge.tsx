import { Image, TouchableOpacity } from "react-native";
import React, { memo, ReactNode } from "react";
import { useQuery } from "@apollo/client";
import { GET_RANKING } from "../../lib/convergence-client/queries";
import { convergenceClient } from "../../data/apollo";
import PowerBadge from "./power";
import ContributorBadge from "./contributor";
import useDisclosure from "../hooks/useDisclosure";
import BaseContentSheet from "../ui/action-sheets/base-content-sheet";
import { H3, H5, Separator, Text, XStack, YStack } from "tamagui";
import Badge from "./badge";

interface RankingDetails {
    rank: "power" | "noob" | "rookie" | "contributor";
    title: string;
    description: string;
    display: () => React.ReactNode;
    icon: ReactNode
    color: string
}

export const rankings: RankingDetails[] = [
    {
        rank: 'power',
        title: 'Power Rank',
        description: 'Awarded for being a power user on the Poseidon',
        display: () => <Image
            width={80}
            height={80}
            source={require("../../assets/badges/power.png")}
        />,
        icon: <PowerBadge />,
        color: '#FF69B4'
    },
    {
        rank: 'contributor',
        title: 'Contributor Rank',
        description: 'Awarded for consistent contributions to the content on Poseidon',
        display: () => <Image
            width={80}
            height={80}
            source={require("../../assets/badges/contributor.png")}
        />,
        icon: <ContributorBadge />,
        color: '#FFD700'
    }
]

interface Props {
    user_address: string;
}
const RankBadge = (props: Props) => {
    const { user_address } = props;
    const rankQuery = useQuery(GET_RANKING, {
        client: convergenceClient,
        variables: {
            user_address
        }
    })

    const { isOpen, onOpen, onClose } = useDisclosure()

    if (rankQuery.loading || !rankQuery.data?.getRanking) return null

    const { rank } = rankQuery.data.getRanking
    const details = rankings.find(r => r.rank === rank)


    return (
        <>
            <TouchableOpacity onPress={onOpen} >
                {details?.icon ?? null}
            </TouchableOpacity>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={() => onClose()}
                snapPoints={[50]}
                dismissOnOverlayPress
            >
                <YStack p={20} flex={1} w="100%" h="100%" rowGap={5} >
                    {
                        details?.display() ?? null
                    }
                    <H3 color={details?.color}>{details?.title}</H3>
                    <Text>{details?.description}</Text>
                    <Separator />
                    <H5>
                        Acquired Badges
                    </H5>
                    <XStack flex={1} w="100%" columnGap={10} >
                        {
                            rankQuery.data.getRanking.badges?.map((badge, i) => {
                                return <Badge
                                    key={i}
                                    badge={badge.type as any}
                                />
                            })
                        }
                    </XStack>
                </YStack>
            </BaseContentSheet>
        </>
    );
};

export default memo(RankBadge);
