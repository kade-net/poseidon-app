import { View, Text, YStack, Button, H3, H2, XStack, Separator, H4, Spinner, TextArea } from 'tamagui'
import React, { useEffect } from 'react'
import { Link, useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router'
import petra from '../../../lib/wallets/petra'
import TransactionButton from '../../../components/ui/wallet/transaction-button'
import { ArrowUpRight, Copy, Download, History, Inbox, Wallet } from '@tamagui/lucide-icons'
import { aptos } from '../../../contract'
import { UserTransactionResponse } from '@aptos-labs/ts-sdk'
import delegateManager from '../../../lib/delegate-manager'
import { poseidonIndexerClient } from '../../../lib/indexer-client'
import wallet, { CommonTransaction } from '../../../lib/wallets/wallet'
import { useInfiniteQuery, useQuery } from 'react-query'
import { FlatList } from 'react-native'
import { flatten, isNumber, uniqBy } from 'lodash'
import BaseContentSheet from '../../../components/ui/action-sheets/base-content-sheet'
import useDisclosure from '../../../components/hooks/useDisclosure'
import * as clipboard from 'expo-clipboard'

const IS_SELF_DELEGATE = delegateManager.owner! == delegateManager.account?.address().toString()

const Petra = () => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const balanceQuery = useQuery({
        queryFn: async () => {
            const value = await aptos.getAccountAPTAmount({
                accountAddress: IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!
            })


            if (value && isNumber(value)) {
                return value / 10 ** 8
            }
            return 0
        },
        queryKey: 'wallet-balance',
        refetchInterval: 10000
    })

    const transactionsQuery = useInfiniteQuery({
        queryKey: 'wallet-transactions',
        queryFn: wallet.handleTransactionsPaginate,
        getNextPageParam: (lastPage = [], allPages = []) => {

            const lastPageLength = lastPage.length
            if (lastPageLength < 20) return null
            const currentOffset = allPages.length * 20
            return currentOffset
        },
    })


    const handleCopyWalletAddress = async () => {
        try {
            await clipboard.setStringAsync(IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!)
            onClose()
        }
        catch (e) {
            // TODO: somehow deal with this
            onClose()
        }

    }





    return (
        <YStack backgroundColor={'$background'} flex={1} w='100%' h='100%' >

            <YStack w="100%" alignItems='center' justifyContent='flex-end' rowGap={10} pt={40} pb={20}   >
                <YStack alignItems='center' rowGap={5} px={20} >
                    <H2
                        fontWeight={'900'}
                    >
                        {balanceQuery?.data ?? 0} APT
                    </H2>
                    {/* <Text>
                        9.2 USD
                    </Text> */}
                </YStack>
                <XStack w="100%" alignItems='center' justifyContent='center' columnGap={10} px={20} >
                    <Link asChild href={'/settings/wallet/recipients'} >
                        <Button iconAfter={<ArrowUpRight />} variant='outlined' borderColor={'$primary'} onPress={() => console.log("pressed")} flex={1} >
                            Send
                        </Button>
                    </Link>
                    <Button onPress={onOpen} iconAfter={<Download />} variant='outlined' borderColor={'$primary'} flex={1}  >
                        Receive
                    </Button>
                </XStack>
                <Separator w="100%" />
            </YStack>

            <YStack w="100%" flex={1} alignItems='center' rowGap={20}  >


                <FlatList
                    refreshing={transactionsQuery.isFetching}
                    onRefresh={() => !transactionsQuery.isFetching && transactionsQuery.refetch()}
                    onEndReached={() => !transactionsQuery.isFetching && transactionsQuery.hasNextPage && transactionsQuery.fetchNextPage()}
                    // onEndReachedThreshold={1}
                    data={uniqBy(flatten(transactionsQuery?.data?.pages), (item) => item?.txnVersion) ?? []}
                    keyExtractor={(item, i) => item?.txnVersion ?? item?.timestamp ?? i.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TransactionButton
                                // @ts-expect-error - ignore
                                transaction={item}
                            />
                        )

                    }}
                    ItemSeparatorComponent={() => <Separator />}
                    ListEmptyComponent={() => {
                        return (
                            <YStack w="100%" alignItems='center' rowGap={10} >
                                <Inbox />
                                <H4>
                                    No transactions yet
                                </H4>
                            </YStack>
                        )
                    }}
                    ListFooterComponent={() => {
                        if (transactionsQuery.isLoading) return (
                            <XStack p={20} alignItems='center' justifyContent='center' >
                                <Spinner />
                            </XStack>
                        )
                        return null
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </YStack>

            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[30]}
                showOverlay
            >
                <YStack flex={1} p={20} rowGap={10} >
                    <XStack
                        columnGap={10}
                        alignItems='center'
                    >
                        <Wallet />
                        <Text fontSize={'$6'} >
                            Your Wallet Address
                        </Text>
                    </XStack>
                    <TextArea
                        disabled
                        value={
                            IS_SELF_DELEGATE ? delegateManager.owner! : delegateManager.account?.address().toString()!
                        }
                    />
                    <XStack w="100%" alignItems='center' justifyContent='flex-end' >
                        <Button
                            backgroundColor={'$primary'}
                            icon={<Copy />}
                            onPress={handleCopyWalletAddress}
                        >
                            Copy
                        </Button>
                    </XStack>
                </YStack>
            </BaseContentSheet>

        </YStack>
    )
}

export default Petra