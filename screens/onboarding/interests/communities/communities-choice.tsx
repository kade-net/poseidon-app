import { View, Text, YStack, XStack, Spinner, Button, useTheme } from 'tamagui'
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { SEARCH_COMMUNITIES } from '../../../../utils/queries'
import { FlatList, Pressable, Touchable, TouchableOpacity } from 'react-native'
import CommunityCard from '../../../../components/ui/community/community-card'
import CommunityChoiceCard from '../../../../components/ui/community/community-choice-card'
import communityModule from '../../../../contract/modules/community'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'

interface COMMUNITY {
    __typename?: "Community" | undefined;
    id: number;
    name: string;
    description: string;
    image: string;
    timestamp: any;
}
interface Props {
    community?: COMMUNITY
}

const CommunitiesChoice = () => {
    const tamaguiTheme = useTheme()

    const communitiesQuery = useQuery(SEARCH_COMMUNITIES, {
        variables: {
            page: 0,
            size: 10
        },
        onError: (error) => {
            console.error(error)
        },
        onCompleted: (data) => {
            console.log(`Data::`, data)
        }
    })

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

    const [saving, setSaving] = useState<boolean>(false)



    const addCommunityToPreferences = (name: string, keyId: number) => {
        if(selectedKeys.includes(keyId) && selectedItems.includes(name)){
            setSelectedItems(selectedItems.filter(item => item !== name));
            setSelectedKeys(selectedKeys.filter(item => item !== keyId));
        } else {
            setSelectedItems((previous)=>[...previous,name]);
            setSelectedKeys((previous)=>[...previous,keyId]);
        }
    }

    const handleFollow = async (name: string) => {
        try {
            await communityModule.follow(name)
        }
        catch (e) {
            console.log("Error: ", e)
        }
    }

    const saveCommunities = async (): Promise<void> => {
        setSaving(true)
        console.log(selectedItems)

        try {
            for (const item of selectedItems) {
                await handleFollow(item);
            }

            router.replace('/(tabs)/feed/home')
        }
        catch (e) {
            Toast.show({
                text1: 'Error saving communities',
                text2: 'Please try again, or skip this step.',
                type: 'error',
            })
        }

        
    }


    const handleFetchMore = async () => {
        const currentPage = Math.floor(
            ((communitiesQuery?.data?.communities?.length ?? 0) / 20)
        ) - 1

        await communitiesQuery.fetchMore({
            variables: {
                page: currentPage + 1,
                size: 10
            }
        })
    }

    const handleFetchTop = async () => {
        await communitiesQuery.fetchMore({
            variables: {
                page: 0,
                size: 10
            }
        })
    }

    return (
        <YStack flex={1} >
            <FlatList
                style={
                    [
                        {
                            flex: 1,
                            height: '100%',
                        }
                    ]
                }
                data={communitiesQuery?.data?.communities ?? []}
                keyExtractor={(item) => item.name}
                refreshing={communitiesQuery.loading}
                onRefresh={handleFetchTop}
                onEndReached={handleFetchMore}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={1}
                ListFooterComponent={() => {
                    return (
                        <XStack w="100%" alignItems='center' justifyContent='center' >
                            {
                                communitiesQuery?.loading ? <Spinner /> : null
                            }
                        </XStack>
                    )
                }}
                renderItem={({ item }) => {
                    return (
                        <Pressable
                            key={item.id} 
                            onPress={() => addCommunityToPreferences(item.name, item.id)}
                            style={
                                [
                                    {
                                        // borderColor: selectedKeys.includes(item.id)? 'rgb(44, 156, 232)' : tamaguiTheme.background.val,
                                        marginBottom: 8,
                                        // borderWidth: 1,
                                        // borderRadius: 10
                                    }
                                ]
                            }
                        >
                            <View 
                                borderColor={selectedKeys.includes(item.id)? 'rgb(44, 156, 232)' : '$background'} 
                                marginBottom={8}
                                borderWidth={1}
                                borderRadius={10}
                            
                            >
                                <CommunityChoiceCard
                                    community={item}
                                />
                            </View>
                            
                        </Pressable>
                    )
                }}
            />
            <Button 
                fontSize={"$sm"} 
                disabled={saving || selectedItems.length === 0} 
                backgroundColor={selectedItems.length > 0? "$button" : "$colourlessButton"}  
                color={selectedItems.length === 0 ? "$text" : "$buttonText"} 
                borderWidth={1} 
                borderColor={"$button"} 
                mt={10} 
                onPress={saveCommunities}>
                {saving ? 'Saving' : 'Save Communities'} {saving ? <Spinner color={"white"} /> : null}
            </Button>
        </YStack>
    )
}


export default CommunitiesChoice