import { YStack } from "tamagui";
import ProfileDetails from "../../profiles";
import React from "react";

interface Props {
    address: string
}
export function ProfilesV2(props: Props) {
    const { address } = props;
    return (
        <YStack flex={1} w={'100%'} h={'100%'} bg={'$background'} >
            {address && <ProfileDetails
                address={address}
            />}
        </YStack>
    )
}