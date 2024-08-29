import {View, Text, YStack, H3, XStack, Input, H4, Separator, H5} from 'tamagui'
import React, {useMemo, useState} from 'react'
import BaseButton from '../../components/ui/buttons/base-button'
import {Check, PlusSquare, X, Zap} from '@tamagui/lucide-icons'
import useDisclosure from '../../components/hooks/useDisclosure'
import BaseContentSheet from '../../components/ui/action-sheets/base-content-sheet'
import {Image, Platform, TouchableOpacity} from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {useRouter} from "expo-router";
import SearchInput from "../../components/ui/search-input";

interface ComposerPortal {
    icon: string,
    name: string,
    description: string
    target: string
}

const data: Array<ComposerPortal> = [
    {
        icon: 'https://res.cloudinary.com/db7gfp5kb/image/upload/f_auto,q_auto/v1/portals/swarms/fqx4fqrhaqpmvp3uh65y',
        name: 'Make an NFT',
        description: 'Create an NFT for your post',
        target: 'https://swarms.poseidon.ac/create'
    }
]

const NftCreator = () => {
    const router = useRouter()
    const [search, setSearch] = useState<string>()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const containerComponent = useMemo(() => (props: any) => (
        Platform.OS === 'ios' ? (
            <FullWindowOverlay>
                <YStack flex={1} pe='box-none' >
                    {props.children}
                </YStack>
            </FullWindowOverlay>
        ) : props.children
    ), [])

    const results = useMemo(()=>{
        return data?.filter(cp => {
            if(!search || search.trim().length == 0) return true
            return cp.name?.toLowerCase().trim().includes(search.trim().toLowerCase())
        } )
    }, [search])

    return (
        <YStack>
            <TouchableOpacity onPress={onOpen} >
                <PlusSquare color={'$primary'} />
            </TouchableOpacity>
            {
                isOpen && <BaseContentSheet
                    open={isOpen}
                    onOpenChange={onClose}
                    snapPoints={[80]}
                    dismissOnOverlayPress
                    containerComponent={containerComponent}
                >
                    <KeyboardAwareScrollView
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <YStack p={20} flex={1} w="100%" h="100%" rowGap={20} >
                            <XStack w={"100%"} alignItems={'center'} justifyContent={'space-between'} >
                                <TouchableOpacity onPress={onClose} >
                                    <XStack backgroundColor={'$border'} borderRadius={50} p={5} >
                                        <X/>
                                    </XStack>
                                </TouchableOpacity>
                                    <H3>
                                        Composer Portals
                                    </H3>
                                <XStack/>
                            </XStack>
                            <XStack w={"100%"} >
                                <SearchInput
                                    onChangeText={setSearch}
                                    value={search}
                                />
                            </XStack>
                            <YStack>
                                {
                                    results.map((composer, i)=>{
                                        return (
                                            <YStack key={i}  w={"100%"} >

                                                <XStack   w={"full"} columnGap={10}  >
                                                    <Image
                                                        source={{
                                                            uri: composer.icon
                                                        }}
                                                        width={40}
                                                        height={40}
                                                        borderRadius={5}
                                                    />
                                                    <XStack flex={1} columnGap={10} alignItems={'center'} justifyContent={'space-between'} >
                                                        <YStack>
                                                            <H5>
                                                                {composer.name}
                                                            </H5>
                                                            <Text>
                                                                {composer.description}
                                                            </Text>
                                                        </YStack>

                                                        <BaseButton onPress={()=>{
                                                            onClose()
                                                            // @ts-ignore
                                                            router.push(`/composable-editor?target_url=${composer?.target}`)
                                                        }} size={'$3'} >
                                                            Create
                                                        </BaseButton>

                                                    </XStack>
                                                </XStack>
                                                <Separator borderColor={'$border'} mt={20} />
                                            </YStack>
                                        )
                                    })
                                }
                            </YStack>
                        </YStack>
                    </KeyboardAwareScrollView>
                </BaseContentSheet>
            }
        </YStack>
    )
}

export default NftCreator