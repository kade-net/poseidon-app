import {YStack} from "tamagui";
import {useGlobalSearchParams, useLocalSearchParams} from "expo-router";
import ProfileDetails from "../../../../screens/profiles";
import React from "react";
import {ProfilesV2} from "../../../../screens/v2/profiles";


export default function ProfileScreen(){
    const params = useLocalSearchParams()
    const userAddress = params['address'] as string ?? ''
    return (
        <ProfilesV2 address={userAddress} />
    )
}