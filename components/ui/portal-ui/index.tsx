import { View, Text, YStack, Spinner, Input, Button, XStack } from 'tamagui'
import React, { useEffect, useState } from 'react'
import usePortal from '../../../lib/portals/use-portal'
import { FlatList, Image } from 'react-native'
import { sortBy } from 'lodash'
import useDisclosure from '../../hooks/useDisclosure'
import TransactionSheet from '../action-sheets/in-app-transactions/transaction-sheet'
import { PortalButton } from '@kade-net/portals-parser'
import { Utils } from '../../../utils'
import { ExternalLink, Zap } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'

interface Props {
    url: string
    kid: number
    post_ref: string
}
const currentParams = {
    data: "",
    response: ""
}
const PortalRenderer = (props: Props) => {
    const { url, kid, post_ref: ref } = props
    const [input, setInput] = useState<string>()
    const [activeButton, setActiveButton] = React.useState<PortalButton | null>(null)
    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
    const { portal, loading, setPortal, error, handleButtonPress } = usePortal({
        initialUrl: url?.trim()
    })

    const router = useRouter()

    const handleMint = (button: PortalButton | null) => {
        router.setParams(currentParams)
        setActiveButton(button)
        onOpen()
    }

    useEffect(() => {
        if (!isOpen) {
            router.setParams(currentParams)
        }
    }, [isOpen])

    const handleClose = async (hash: string) => {
        router.setParams(currentParams)
        onClose()
        if (activeButton) {
            await handleButtonPress({
                button: activeButton,
                kid,
                ref,
                hash,
                input
            })
        }
    }


    if (loading) {
        return (
            <YStack
                aspectRatio={1}
                width={'100%'}
                borderRadius={10}
                padding={10}
                backgroundColor={'$portalBackground'}
                borderColor={'$portalBorderColor'}
                borderWidth={1}
                alignItems='center'
                justifyContent='center'
            >
                <Spinner />
            </YStack>
        )
    }

    return (
        <YStack
            width={'100%'}
            backgroundColor={'$portalBackground'}
            borderRadius={5}
            borderColor={'$portalBorderColor'}
            borderWidth={1}
            overflow='hidden'
        >
            <YStack w={"100%"} aspectRatio={portal?.components?.image?.aspect_ratio ? Utils.convertAspectRatio(portal?.components?.image?.aspect_ratio) : 1.91 / 1} >
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }}
                    source={{ uri: portal?.components.image?.image }}
                />
            </YStack>
            <YStack
                w="100%"
                p={5}
            >
                {
                    portal?.components?.input &&
                    <XStack w="100%" px={10} py={5} >
                        <Input
                            // p={0}
                            w="100%"
                            height={30}
                            borderRadius={5}
                            value={input ?? ''}
                            onChangeText={setInput}
                            placeholder={portal?.components?.input?.input || ""}
                                autoCapitalize='none'
                            />
                        </XStack>
                }
                <FlatList

                    data={sortBy(portal?.components.buttons, 'index') ?? []}
                    keyExtractor={(item) => item.index.toString()}
                    numColumns={2}
                    style={{
                        padding: 10,
                        borderTopWidth: 1,
                        borderTopColor: "#4c3a4e80",
                        rowGap: 10
                    }}
                    columnWrapperStyle={{
                        columnGap: 10,
                        rowGap: 10,
                    }}
                    renderItem={({ item }) => {
                        return (
                            <Button size={'$3'} key={item.index} flex={1} onPress={() => {
                                if (item.type === 'mint' || item.type == 'tx') {
                                    handleMint(item)
                                } else {
                                    handleButtonPress({
                                        button: item,
                                        kid,
                                        ref,
                                        input
                                    })
                                }
                            }} backgroundColor={'$portalButton'}
                                iconAfter={
                                    item.type === 'link' ? <ExternalLink color={'$sideText'} /> :
                                        item.type === 'mint' ? <Zap color={'$primary'} /> :
                                            item.type === 'tx' ? <Zap color={'$yellow'} /> : null
                                }
                            >
                                {item.title}
                            </Button>
                        )
                    }}
                />
            </YStack>
            <TransactionSheet
                isOpen={isOpen}
                onClose={(hash) => {
                    // console.log("hash", hash)
                    if (hash) {
                        handleClose(hash)
                    } else {
                        onClose()
                    }
                }}
                module_arguments={activeButton?.module_arguments || ''}
                module_function={activeButton?.module_function || ''}
                type_arguments={activeButton?.type_arguments}
                onOpen={onOpen}
                onToggle={onToggle}
            />
        </YStack>
    )
}

export default PortalRenderer