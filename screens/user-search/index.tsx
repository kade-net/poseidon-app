import {H3, Separator, Text, useTheme, XStack, YStack} from "tamagui";
import {ProfileIcon} from "../../lib/icons";
import {useQuery} from "@apollo/client";
import {ACCOUNTS_SEARCH_QUERY, GET_RELATIONSHIP} from "../../utils/queries";
import {AccountsQuery, Account, Profile} from "../../__generated__/graphql";
import BaseAvatar from "../../components/ui/avatar";
import {Utils} from "../../utils";
import delegateManager from "../../lib/delegate-manager";
import BaseButton from "../../components/ui/buttons/base-button";
import {Link, useNavigation, useRouter} from "expo-router";
import {FlatList, TouchableOpacity} from "react-native";
import {useCallback, useDeferredValue, useState} from "react";
import {Menu} from "@tamagui/lucide-icons";
import SearchInput from "../../components/ui/search-input";
import {DrawerActions} from "@react-navigation/native";
import {isEmpty} from "lodash";
import * as Haptics from 'expo-haptics'
import account from "../../contract/modules/account";
import address from "../../app/profiles/[address]";
import posti from "../../lib/posti";

interface ProfileCardProps {
    data: Account
    type?: 'with-button' | 'without-bio' | 'without-bio-and-button'
}
function ProfileCardWithFollowBtn(props: ProfileCardProps) {
    const { data, type = 'with-button' } = props
    const isMe = data?.address == delegateManager.owner
    const relationshipQuery = useQuery(GET_RELATIONSHIP, {
        variables: {
            accountAddress: data.address!,
            viewerAddress: delegateManager.owner!
        },
        skip: type == 'without-bio-and-button' || isMe
    })

    const follows = relationshipQuery.data?.accountRelationship?.follows

    const toggleFollow = async () => {
        await Haptics.selectionAsync()

        try {
            if(follows){
                await account.unFollowAccount(data.address);
            }else{
                await account.followAccount(data.address);
            }
        }
        catch (e)
        {
            console.log('Error following ::', e)
            posti.capture('error-following', {
                delegate: delegateManager.owner,
                following: data.address,
            })
        }
    }
    return (
        <Link asChild href={{
            pathname: '/profiles/[address]',
            params: {
                address: data?.address!
            }
        }}>
            <YStack w={"100%"} rowGap={10} p={10} >
                 <XStack w={"100%"} alignItems={"center"} justifyContent={'space-between'} >
                     <XStack columnGap={10} >
                         <BaseAvatar size={'$md'} src={Utils.parseAvatarImage(data?.address, data?.profile?.pfp)} />
                         <YStack>
                            <Text fontSize={15} fontWeight={'bold'} >
                                {Utils.formatName(data?.profile?.display_name ?? "")}
                            </Text>
                             <Text fontSize={16} color={'$sideText'} >
                                 @{data?.username?.username}
                             </Text>
                         </YStack>
                     </XStack>
                     {
                         (!isMe && (type == 'with-button' || type=='without-bio') && !relationshipQuery.loading )&& <BaseButton
                             type={follows ? 'outlined' : 'primary'}
                             size={'$3'} rounded={'full'}
                             onPress={toggleFollow}
                         >
                         Follow
                         </BaseButton>
                     }
                 </XStack>
                {(
                    type == 'with-button'
                ) && <Text numberOfLines={4}>
                    {data?.profile?.bio}
                </Text>}
            </YStack>
        </Link>
    )
}


function SuggestedAccounts() {
    const profileQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
        variables: {
            byFollowing: true,
            page: 0,
            size: 10
        }
    })

    const theme = useTheme()

    const renderProfile = useCallback((props: {item: any, index: number}) => {
       return <ProfileCardWithFollowBtn data={props.item} />
    },[])

    return (
        <YStack flex={1} width={'100%'} height={'100%'} rowGap={10} pt={20}  >
            <XStack alignItems={'center'} columnGap={10} px={10} >
                <ProfileIcon color={theme.primary.val} />
                <H3>
                    Suggested accounts
                </H3>
            </XStack>
            <Text px={10} >
                Follow more accounts to get connected to your interests and build your network.
            </Text>

            <FlatList style={{
                borderTopWidth: 1,
                borderTopColor: theme.border?.val
            }} ItemSeparatorComponent={()=><Separator borderColor={'$border'} />} data={profileQuery?.data?.accounts ?? []} renderItem={renderProfile}/>
        </YStack>
    )
}

interface PeopleSearchProps {
    search: string
}
function PeopleSearchResults(props: PeopleSearchProps){
    const { search } = props
    const theme = useTheme()
    const searchDeferred = useDeferredValue(search)
    const profileQuery = useQuery(ACCOUNTS_SEARCH_QUERY, {
        variables: {
            search: search,
            page: 0,
            size: 20
        },
        skip: isEmpty(searchDeferred)
    })

    const renderProfile = useCallback((props: {item: any, index: number})=> {
        return <ProfileCardWithFollowBtn data={props.item} type={'without-bio-and-button'} />
    },[])

    return (
        <YStack flex={1} w={"100%"} h={"100%"} pt={20} >
            <FlatList style={{
                borderTopWidth: 1,
                borderTopColor: theme.border?.val
            }} ItemSeparatorComponent={()=><Separator borderColor={'$border'} />} data={profileQuery?.data?.accounts ?? []} renderItem={renderProfile} />
        </YStack>
    )

}



export default function UserSearch(){
    const [searchActive, setSearchActive] = useState(false)
    const [search, setSearch] = useState('')
    const navigations = useNavigation()
    return <YStack flex={1} py={10} w={"100%"} h={"100%"} bg={"$background"} >
        <XStack columnGap={10} alignItems={'center'} px={10}  >
            <TouchableOpacity onPress={()=> navigations.dispatch(DrawerActions.toggleDrawer())}  >
                <Menu color={'$sideText'} />
            </TouchableOpacity>
            <SearchInput placeholder={'Find People'} onInputActiveChange={setSearchActive} onChangeText={setSearch} />
        </XStack>
        {!searchActive && <SuggestedAccounts/>}
        {searchActive && <PeopleSearchResults search={search} />}
    </YStack>
}