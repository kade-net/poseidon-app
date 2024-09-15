import {Account} from "../../__generated__/graphql";
import {Separator, Text, XStack, YStack} from "tamagui";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import BaseButton from "../../components/ui/buttons/base-button";
import {ChevronLeft, Mail} from "@tamagui/lucide-icons";
import {useRouter} from "expo-router";
import {useCallback, useState} from "react";
import {useQuery} from "@apollo/client";
import {ACCOUNTS_SEARCH_QUERY} from "../../utils/queries";
import {FlatList, TouchableOpacity} from "react-native";
import SearchInput from "../../components/ui/search-input";


interface  ProfileCardWithButtonProps {
    data: Account
}

function ProfileCardWithButton(props: ProfileCardWithButtonProps){
    const { data } = props
    return (
        <XStack w={"100%"} justifyContent={'space-between'} alignItems={'center'} px={10} py={10} >
            <XStack columnGap={10} >
                <BaseAvatar size={'$lg'} src={Utils.parseAvatarImage(data?.address ?? "1", data?.profile?.pfp)} />
                <YStack>
                    <Text fontSize={16} fontWeight={'bold'} >
                        {data?.profile?.display_name}
                    </Text>
                    <Text fontSize={15} color={'$sideText'} >
                        @{data?.username?.username}
                    </Text>
                </YStack>
            </XStack>
            <BaseButton
                icon={<Mail/>}
                size={'$2'}
                borderRadius={30}
            >
                Request
            </BaseButton>
        </XStack>
    )
}


export function ChatSearch(){
    const router = useRouter()
    const [search, setSearch] = useState("")

    const profilesQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
        variables: {
            search: search.trim(),
            page: 0,
            size: 10
        },
        skip: (search.trim().length ?? 0) == 0
    })

    const renderProfile =  useCallback((props: {item: any, index: number})=>{
        return <ProfileCardWithButton data={props.item}  />
    }, [])


    return (
        <YStack flex={1} w={"100%"} h={"100%"} bg={"$background"} >
            <XStack columnGap={5} px={10} py={10} alignItems={'center'} >
                <TouchableOpacity onPress={router.back} >
                    <ChevronLeft/>
                </TouchableOpacity>
                <SearchInput value={search} onChangeText={setSearch} />
            </XStack>
            <YStack w={"100%"} flex={1} >
                <FlatList ItemSeparatorComponent={()=><Separator borderColor={'$border'} />} data={profilesQuery?.data?.accounts ?? []} renderItem={renderProfile} />
            </YStack>
        </YStack>
    )
}