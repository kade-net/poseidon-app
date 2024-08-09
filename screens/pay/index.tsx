import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from "react-native";
import React, { useMemo } from "react";
import { Avatar, H3, H4, Input, ScrollView, Separator, Text, TextArea, useTheme, XStack, YStack } from "tamagui";
import SelectCurrency from "./select-currency";
import { z } from "zod";
import amount from "../../app/settings/wallet/amount";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VirtualKeyboard from "./virtual-keyboard";
import BaseButton from "../../components/ui/buttons/base-button";
import { currencies } from "../../lib/currencies";
import { useQuery as uzQuery } from "react-query";
import { formatAddress } from "../../contract/modules/hermes/utils";
import delegateManager from "../../lib/delegate-manager";
import { useQuery } from "@apollo/client";
import { GET_MY_PROFILE } from "../../utils/queries";
import { Utils } from "../../utils";
import PayIcon from "../../assets/svgs/pay-icon";
import TipIcon from "../../assets/svgs/tip-icon";

const paymentSchema = z.object({
    currency: z.string(),
    amount: z.string()
})

type PSchema = z.infer<typeof paymentSchema>

interface Props {
    receiver?: string
    action?: 'pay' | 'tip'
    currency?: 'APT' | 'GUI'
    amount?: number
}

const PayUser = (props: Props) => {
    // TODO: remove receiver
    const { receiver = "0x4ef479c7f529d93cd4cf7bcbc0e9c9516816dd6d9bfad032d543327deb24ed85", action = 'pay', currency = 'APT' } = props

    const theme = useTheme()
    const form = useForm<PSchema>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            currency: currency
        }
    })
    const AMOUNT = form.watch("amount")
    let AMOUNT_FLT = parseFloat(AMOUNT)
    AMOUNT_FLT = Number.isNaN(AMOUNT_FLT) ? 0 : AMOUNT_FLT
    const CURRENCY = form.watch("currency")


    const balanceQuery = uzQuery({
        queryKey: ['balance', CURRENCY],
        queryFn: async () => {
            if (!CURRENCY) return 0

            const currencyHandler = currencies.find(c => c.name == CURRENCY)

            if (!currencyHandler) return 0

            try {
                const currencyBalance = (await currencyHandler.getCurrentBalance?.()) ?? 0
                // console.log("Currency:: ", CURRENCY, 1, currencyHandler)

                return currencyBalance
            }
            catch (e) {
                // console.log("Error::", e)
                return 0
            }
        }
    })

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: receiver
        },
        skip: !receiver
    })

    const HAS_BALANCE = (balanceQuery?.data ?? 0) >= (AMOUNT_FLT ?? 0)

    return (

        <YStack flex={1} w="100%" h="100%" borderColor={'$lightButton'}  >
            <YStack w="100%" p={20}>
                <XStack w="100%" justifyContent="space-between" alignItems="center" >
                    <XStack columnGap={10} alignItems="flex-end" >
                        {
                            action == 'pay' ? <PayIcon /> : <TipIcon />
                        }
                    </XStack>
                    <SelectCurrency value="APT" onChange={(value) => {
                        form.setValue('currency', value)
                    }} />
                </XStack>
                <XStack w="100%" alignItems="center" justifyContent="center" py={20} >
                    <Controller
                        control={form.control}
                        name="amount"
                        render={({ field }) => {
                            return (
                                <YStack alignItems="center" w="100%" >
                                    <XStack alignItems="center" >
                                        <Text fontSize={32} color={'$primary'}  >
                                            {`$${CURRENCY}`}
                                        </Text>
                                        <Input
                                            disabled
                                            onChangeText={field.onChange}
                                            backgroundColor={'$colorTransparent'}
                                            outlineWidth={0}
                                            borderWidth={0}
                                            placeholder="0.0"
                                            // autoFocus
                                            fontSize={32}
                                            fontWeight={"700"}
                                            verticalAlign={Platform.select({
                                                ios: undefined,
                                                android: "top",
                                            })}
                                            minWidth={100}
                                            keyboardType="numbers-and-punctuation"
                                        >
                                            <Text color={
                                                HAS_BALANCE ? undefined : '$red10'
                                            } fontSize={32} fontWeight={'500'} >{AMOUNT}</Text>
                                        </Input>
                                    </XStack>
                                    <YStack alignItems="center" pb={10} >
                                        <Text fontSize={'$sm'} color={'$sideText'} >
                                            {AMOUNT_FLT} {CURRENCY}
                                        </Text>
                                        <Text fontSize={'$sm'} color={'$sideText'} >
                                            {balanceQuery?.data} {CURRENCY} available
                                            {/* // TODO: set value to the actual value */}
                                        </Text>
                                    </YStack>
                                    <YStack w="100%" py={10} borderTopWidth={1} borderBottomWidth={1} borderColor={'$border'} >

                                        <XStack py={5} pb={10} w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text>
                                                From
                                            </Text>
                                            <Text>
                                                {formatAddress(delegateManager?.account?.address()?.toString() ?? '')}
                                            </Text>
                                        </XStack>
                                        <Separator w="100%" borderColor={'$border'} />

                                        <XStack w="100%" py={5} pt={10} justifyContent="space-between" alignItems="center" >
                                            <Text>
                                                To
                                            </Text>
                                            <XStack alignItems="center" columnGap={5} >
                                                <Text>
                                                    <Text color={'$primary'} >
                                                        {profileQuery?.data?.account?.username?.username && `@${profileQuery?.data?.account?.username?.username}  `}
                                                    </Text>
                                                    ({formatAddress(receiver ?? '')})
                                                </Text>
                                                <Avatar circular size={'$2'} >
                                                    <Avatar.Image src={Utils.parseAvatarImage(receiver ?? '1', profileQuery?.data?.account?.profile?.pfp)} />
                                                    <Avatar.Fallback />
                                                </Avatar>
                                            </XStack>
                                        </XStack>
                                    </YStack>
                                </YStack>
                            )
                        }}
                    />
                </XStack>
            </YStack>
            <YStack w="100%" >

            </YStack>
            <YStack w="100%" flex={1} >
                <VirtualKeyboard inValid={!HAS_BALANCE} onChange={(v) => {
                    form.setValue('amount', v)
                }} />
            </YStack>
            <YStack >
                <XStack w="100%" p={20} pb={Platform.select({
                    ios: 60,
                    android: 20
                })} columnGap={10} >
                    <BaseButton borderRadius={100} type="outlined" flex={1} >
                        Cancel
                    </BaseButton>
                    <BaseButton borderRadius={100} flex={1} >
                        Send
                    </BaseButton>
                </XStack>
            </YStack>
        </YStack>
    );
};

export default PayUser;
