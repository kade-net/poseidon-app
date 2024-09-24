import { ChevronDown, ChevronUp, Home } from '@tamagui/lucide-icons'
import React, { memo, useEffect, useMemo } from 'react'
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, useColorScheme } from 'react-native'
import { Avatar, Separator, Text, XStack, YStack } from 'tamagui'
import useDisclosure from '../../components/hooks/useDisclosure'
import BaseContentSheet from '../../components/ui/action-sheets/base-content-sheet'
import { FullWindowOverlay } from 'react-native-screens'
import SearchInput from '../../components/ui/search-input'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../schema'
import KeyboardDown from '../../assets/svgs/keyboard-down'
import { POST_COMMUNITY_SEARCH, SEARCH_COMMUNITIES } from '../../utils/queries'
import { useQuery } from '@apollo/client'
import delegateManager from '../../lib/delegate-manager'
import * as Haptics from 'expo-haptics'

interface Props {
    form: UseFormReturn<TPUBLICATION, any, any>
    handleBlur: () => void
}

const CommunitySearch = (props: Props) => {
    const [value, setValue] = React.useState('')
    const [keyboardHide, setKeyboardHide] = React.useState(false)
    const { form, handleBlur } = props
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    const CURRENT_COMMUNITY = form.watch('community') ?? undefined

    const communityQuery = useQuery(SEARCH_COMMUNITIES, {
        variables: {
            search: value,
            page: 0,
            size: 5
        }
    })

    const handleSelect = (community: string) => {
        Haptics.selectionAsync()
        if (community === 'home') {
            form.setValue('community', undefined)
        } else {
            form.setValue('community', community)
        }
        onClose()
    }


    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHide(false)
        })

        const subscription2 = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardHide(true)
        })

        return () => {
            subscription.remove()
            subscription2.remove()
        }
    }, [])

    const containerComponent = useMemo(() => (props: any) => (
        Platform.OS === 'ios' ? (
            <FullWindowOverlay>
                <YStack flex={1} pe='box-none' >
                    {props.children}
                </YStack>
            </FullWindowOverlay>
        ) : props.children
    ), [])

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    handleBlur()
                    onToggle()
                }}
            >
                <XStack
                    p={5}
                    py={2.5}
                    columnGap={5}
                    backgroundColor={'$lightButton'}
                    alignItems='center'
                    borderRadius={10}
                >
                    <Text>
                        {CURRENT_COMMUNITY ? `/${CURRENT_COMMUNITY}` : 'feed'}
                    </Text>
                    {isOpen ? <ChevronUp size={'$1'} /> : <ChevronDown size={'$1'} />}
                </XStack>
            </TouchableOpacity>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onClose}
                snapPoints={[60]}
                containerComponent={containerComponent}
                showOverlay={false}
                disableDrag
            >
                <YStack flex={1} w="100%" h="100%" >
                    <YStack p={20} flex={1} w="100%" h="100%" backgroundColor={'$background'} borderTopRightRadius={10} borderTopLeftRadius={10} rowGap={20}>
                        <XStack w="100%" px={20} >
                            <SearchInput value={value} onChangeText={setValue} />
                        </XStack>
                        <FlatList
                            scrollEnabled={false}
                            data={(communityQuery.data?.communities?.slice(0, 5)) ?? []}
                            keyExtractor={(item) => item?.id?.toString()}
                            ListHeaderComponent={() => (
                                <TouchableOpacity style={{
                                    width: '100%'
                                }} onPress={() => {
                                    handleSelect('home')
                                }}  >
                                    <XStack w="100%" alignItems='center' columnGap={10} p={10} >
                                        <XStack p={10} borderRadius={100} alignItems='center' justifyContent='center' background={'black'}  >
                                            <Home size={16} />
                                        </XStack>
                                        <YStack>
                                            <Text fontSize={18} fontWeight={'600'} >
                                                Home
                                            </Text>
                                            <Text color={'$sideText'} >
                                                /home
                                            </Text>
                                        </YStack>
                                    </XStack>
                                    <Separator borderColor={'$border'} />
                                </TouchableOpacity>
                            )}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={{
                                        width: '100%'
                                    }} onPress={() => {
                                        handleSelect(item?.name)
                                    }}  >
                                        <XStack w="100%" alignItems='center' columnGap={10} p={10} >
                                            <Avatar circular size={'$3'}>
                                                <Avatar.Image
                                                    src={item?.image ?? ''}

                                                />
                                                <Avatar.Fallback
                                                    backgroundColor={'$pink10'} />
                                            </Avatar>
                                            <YStack>
                                                <Text fontSize={18} fontWeight={'600'} >
                                                    {item?.name}
                                                </Text>
                                                <Text color={'$sideText'} >
                                                    /{item?.name}
                                                </Text>
                                            </YStack>
                                        </XStack>
                                    </TouchableOpacity>
                                )
                            }}
                            ItemSeparatorComponent={() => <Separator borderColor={'$border'} />}
                        />
                    </YStack>
                    <KeyboardAvoidingView
                        behavior={Platform.select({
                            ios: 'padding',
                            android: undefined
                        })}
                        keyboardVerticalOffset={Platform.select({
                            ios: 340,
                            android: 100
                        })}
                    >
                        {keyboardHide &&
                            <TouchableOpacity onPress={Keyboard.dismiss}  >
                                <XStack p={10} backgroundColor={'$portalBackground'} alignItems='center' justifyContent='center' >
                                    <KeyboardDown />
                                </XStack>
                            </TouchableOpacity>
                        }
                    </KeyboardAvoidingView>
                </YStack>
            </BaseContentSheet>
        </>
    )
}

export default memo(CommunitySearch)