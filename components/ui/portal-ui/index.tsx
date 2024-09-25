import { View, Text, YStack, Spinner, Input, Button, XStack } from 'tamagui'
import React, {memo, useEffect, useMemo, useRef, useState} from 'react'
import usePortal from '../../../lib/portals/use-portal'
import {FlatList, Image, Platform} from 'react-native'
import { sortBy, truncate } from 'lodash'
import useDisclosure from '../../hooks/useDisclosure'
import TransactionSheet from '../action-sheets/in-app-transactions/transaction-sheet'
import { BasePortal, PortalButton } from '@kade-net/portals-parser'
import { Utils } from '../../../utils'
import { ExternalLink, X, Zap } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import Loading from '../feedback/loading'
import BaseButton from '../buttons/base-button'
import { useRoute } from '@react-navigation/native'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import * as LocalAuthentication from 'expo-local-authentication'
import {FullWindowOverlay} from "react-native-screens";

interface RenderButtons {

}

interface Props {
    url: string
    kid: number
    post_ref: string
}
const currentParams = {
    data: "",
    response: ""
}

function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ''
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

interface RP {

}

type RenderPortalProps = RP & Props & ReturnType<typeof usePortal>

function RenderPortal(props: RenderPortalProps) {
    const { portal, loading, handleButtonPress, kid, post_ref: ref, currentURL } = props
    const inputRef = useRef<Input>(null)
    const [imageLoading, setImageLoading] = useState<boolean>(true)
    const [input, setInput] = useState<string>()
    const [activeButton, setActiveButton] = React.useState<PortalButton | null>(null)
    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
    const [cacheBuster, setCacheBuster] = useState<string>(generateRandomString(10))

    const portalButtons = useMemo(() => {
        const rows: Array<Array<PortalButton>> = []
        const buttons = sortBy(portal?.components?.buttons, 'index') ?? []

        buttons.forEach((button, index) => {
            if (index % 2 === 0) {
                rows.push([button])
            } else {
                rows[rows.length - 1].push(button)
            }
        })
        return rows
    }, [currentURL, kid, portal?.components?.buttons?.length])

    const router = useRouter()

    const handleMint = (button: PortalButton | null) => {
        // router.setParams(currentParams)
        setActiveButton(button)
        onOpen()
    }

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


    return (
        <YStack
            width={'100%'}
            backgroundColor={'$portalBackground'}
            borderRadius={5}
            borderColor={'$portalBorderColor'}
            borderWidth={1}
            overflow='hidden'
            position='relative'
        > 

            <YStack pos="relative" w={"100%"} aspectRatio={portal?.components?.image?.aspect_ratio ? Utils.convertAspectRatio(portal?.components?.image?.aspect_ratio) : 1.91 / 1} >
                {portal?.components?.image?.image && <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                    source={{
                        uri: portal?.components?.image?.image + (
                            !cacheBuster ? "" :
                            portal?.components?.image?.image.includes('?') ? `&cache_buster=${cacheBuster}` :
                                `?cache_buster=${cacheBuster}`
                        )
                    }}
                    onLoadStart={() => {
                        setImageLoading(true)
                    }}
                    onLoad={() => {
                        setImageLoading(false)
                    }}
                />}

                {
                    imageLoading &&
                    <Loading
                        flex={1}
                        w="100%"
                        h="100%"
                        pos={'absolute'}
                        backgroundColor={'$portalBackground'}
                    />
                }
            </YStack>
            <YStack
                w="100%"
                p={5}
            >
                {
                    portal?.components?.input &&
                    <XStack w="100%" px={10} py={5} >
                        <Input
                                ref={inputRef}
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
                <YStack rowGap={10} >
                    {
                        portalButtons?.map((row, rowIndex) => {
                            return <XStack key={rowIndex} columnGap={10} >
                                {
                                    row.map((item, columnIndex) => {
                                        return (
                                            <Button disabled={imageLoading} size={'$3'} key={item.index} flex={1} onPress={() => {
                                                if (inputRef.current) {
                                                    inputRef.current.blur()

                                                }
                                                if (item.type === 'mint' || item.type == 'tx') {
                                                    handleMint(item)
                                                } else {
                                                    handleButtonPress({
                                                        button: item,
                                                        kid,
                                                        ref,
                                                        input
                                                    }).then(() => {
                                                        setCacheBuster(generateRandomString(10))
                                                        if (inputRef.current) {
                                                            setInput('')
                                                            inputRef.current.clear()
                                                        }
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
                                    })
                                }
                            </XStack>
                        })
                    }
                </YStack>
            </YStack>
            {
                loading && <Loading
                    flex={1}
                    w="100%"
                    h="100%"
                    pos={'absolute'}
                    backgroundColor={'$portalBackground'}
                />
            }
            <TransactionSheet
                wallet={portal?.components?.wallet || 'preffered'}
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

const PortalRenderer = (props: Props) => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const [isApp, setIsApp] = useState<boolean>(false)
    const [initialPortal, setInitialPortal] = useState<BasePortal | null>(null)
    const portal = usePortal({
        initialUrl: props?.url?.trim()
    })

    const containerComponent = useMemo(() => (props: any) => (
        Platform.OS === 'ios' ? (
            <FullWindowOverlay>
                <YStack flex={1} pe='box-none' >
                    {props.children}
                </YStack>
            </FullWindowOverlay>
        ) : props.children
    ), [])

    useEffect(() => {
        if (portal?.portal?.components?.type === 'app') {
            setInitialPortal(portal.portal)
            setIsApp(true)
        }
    }, [portal?.portal?.components?.type])



    if (isApp) {
        return (
            <YStack w="100%" >
                <XStack justifyContent='space-between' w="100%" borderRadius={5} borderColor={'$portalBorderColor'} borderWidth={1} overflow='hidden' p={10} >
                    <XStack flex={1} >
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 5
                            }}
                            source={{ uri: initialPortal?.components?.icon }}
                        />
                        <YStack flex={1} justifyContent='center' px={10} >
                            <Text fontSize={24} >
                                {initialPortal?.components?.title}
                            </Text>
                            <Text>
                                {truncate(initialPortal?.components?.description, {
                                    length: 30,
                                    omission: '...'
                                })}
                            </Text>
                        </YStack>
                    </XStack>

                    <BaseButton onPress={onToggle} size={'$3'} >
                        Open
                    </BaseButton>

                </XStack>
                {isOpen && <BaseContentSheet
                    open={isOpen}
                    onOpenChange={onToggle}
                    snapPoints={[70]}
                    level={9}
                    showOverlay={false}
                    containerComponent={containerComponent}

                >
                    <YStack rowGap={20} flex={1} w={'100%'} h={'100%'} p={20} pb={100} backgroundColor={'$portalBackground'} >
                        <RenderPortal
                            {...portal}
                            {...props}
                        />
                        <XStack w="100%" alignContent='center' justifyContent='center' >
                            <BaseButton
                                icon={<X />}
                                size={'$2'}
                                rounded='large'
                                onPress={onClose}
                            >
                                <Text>
                                    Close
                                </Text>
                            </BaseButton>
                        </XStack>
                    </YStack>
                </BaseContentSheet>}
            </YStack>
        )
    }



    return <RenderPortal
        {...portal}
        {...props}
    />
}

export default PortalRenderer




















// build weapon dog retire trial crystal kidney orient shrug thrive company eyebrow