import React, { useState } from 'react'
import { Link, Stack, useGlobalSearchParams, useNavigation, useRouter } from 'expo-router'
import { Button, Spinner, XStack, YStack, Text } from 'tamagui'
import { useQuery } from 'react-query'
import collected from '../../../../../contract/modules/collected'
import Image from '../../../../../components/ui/feed/image'
import CollectionImage from '../../../../../screens/profiles/collection/collection-image'
import TopBarWithBack from '../../../../../components/ui/navigation/top-bar-with-back'
import { Anchor } from '@tamagui/lucide-icons'
import useDisclosure from '../../../../../components/hooks/useDisclosure'
import anchors from '../../../../../contract/modules/anchors'
import BaseContentSheet from '../../../../../components/ui/action-sheets/base-content-sheet'
import Toast from 'react-native-toast-message'
import delegateManager from '../../../../../lib/delegate-manager'

const index = () => {
    const params = useGlobalSearchParams()
    const address = params['address'] as string
    const _collection = params['collection'] as string
    const variant = params['variant'] as string
    const [collecting, setCollecting] = useState(false)
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const nftsQuery = useQuery({
        queryFn: () => {
            return collected.getCollections(address)
        },
        queryKey: ['collections', address],
    })

    const router = useRouter()

    const collection = useQuery({
        queryKey: ['collection', _collection],
        queryFn: () => collected.getVariants(_collection),
    })

    const variantQuery = useQuery({
        queryKey: ['collection', _collection, variant],
        queryFn: () => collection.data?.collection?.variants?.find((c) => c.name == variant) ?? null,
        enabled: !!collection?.data
    })


    const handleCollect = async () => {
        setCollecting(true)
        const anchorsBalance = await anchors.getBalance()

        const currentCollectionPrice = collection.data?.collection.anchor_amount ?? 0

        if (anchorsBalance < currentCollectionPrice) {
            onOpen()
            setCollecting(false)
            return
        }

        try {
            await collected.mintFromCollection(
                _collection,
                variant
            )

            await nftsQuery.refetch()

            Toast.show({
                type: 'success',
                text2: `Successfully Claimed ${variant}`,
                text1: `Success`
            })

            router.back()
            router.back()
        }
        catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Unable to complete collection'
            })
        }
        finally {

            setCollecting(false)
        }

    }

    const handleGetAnchors = async () => {
        onClose()
        router.replace('/settings/')
    }


    if (collection.isLoading || variantQuery.isLoading) return (
        <YStack
            flex={1}
            w="100%"
            h="100%"
            alignItems='center'
            justifyContent='center'
            backgroundColor={'$background'}
        >
            <Spinner />
        </YStack>
    )


    return (
        <>
            <Stack.Screen
                options={{
                    header(props) {
                        return <TopBarWithBack
                            navigation={props.navigation}
                            title={variant}
                        />
                    },
                    headerShown: true
                }}
            />
            <YStack
                flex={1}
                w="100%"
                backgroundColor={'$background'}
            >
                <CollectionImage
                    image={variantQuery?.data?.image ?? ''}
                    name={variantQuery?.data?.name ?? ''}
                />
                <XStack w="100%" alignItems='center' justifyContent='center' p={20} >
                    <Button
                        onPress={handleCollect}
                        iconAfter={
                            ((collection?.data?.collection?.anchor_amount ?? 0) > 0 && !collecting) ? <Anchor /> : null
                        }
                        w="100%" backgroundColor={'$button'} color={'white'} >
                        {collecting ? (
                            <XStack columnGap={10} >
                                <Spinner />
                                <Text>
                                    Collecting...
                                </Text>
                            </XStack>
                        ) : (
                            (collection?.data?.collection?.anchor_amount ?? 0) > 0 ?
                                `Collect for ${collection?.data?.collection?.anchor_amount}` :
                                "Collect"
                        )

                        }
                    </Button>
                </XStack>
            </YStack>

            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[30]}
                showOverlay
                animation='quick'
            >
                <YStack w="100%" p={20} rowGap={20}  >
                    <Text fontSize={"$md"} >
                        You need at least {collection.data?.collection?.anchor_amount ?? 0} ANCHORS to mint from this collection.
                    </Text>

                    <Button
                        onPress={handleGetAnchors}
                        fontSize={"$md"}
                        fontWeight={"$2"}
                        borderWidth={1}
                        borderColor={"$button"}
                        variant='outlined'
                        color={"$text"}
                    >
                        Get Anchors
                    </Button>
                </YStack>
            </BaseContentSheet>
        </>
    )
}

export default index