import { Image } from "react-native";
import AptosIcon from "../assets/svgs/aptos-icon";
import { aptos } from "../contract";
import delegateManager from "./delegate-manager";
import {Utils} from "../utils";
import React from "react";

export interface Currency {
    name: string,
    address: string,
    decimals: number,
    icon: (props: { size?: number, color?: string }) => React.ReactNode,
    getCurrentBalance?: () => Promise<number>
    getUSDBalance?: (balance: number) => Promise<number>
}

export const currencies: Array<Currency> = [
    {
        name: 'APT',
        address: '0x1::aptos_coin::AptosCoin',
        decimals: 8,
        icon: (props) => <AptosIcon color={props?.color ?? 'white'} size={props.size ?? 24} />,
        getCurrentBalance: async () => {
            console.log("Address::", delegateManager.account?.address().toString())
            const coinBalance = await aptos.account.getAccountCoinAmount({
                accountAddress: delegateManager.account?.address().toString() ?? '',
                coinType: '0x1::aptos_coin::AptosCoin'
            })

            // console.log("Coin balance::", coinBalance)

            return (coinBalance ?? 0) / 10 ** 8
        },
        getUSDBalance: async (balance: number) => {
            const conversion = await Utils.getCurrencyUSD({
                currencyID: 'apt'
            })

            const usdBalance = balance * (conversion ?? 0)

            return usdBalance
        }
    },
    {
        name: 'GUI',
        address: '0xe4ccb6d39136469f376242c31b34d10515c8eaaa38092f804db8e08a8f53c5b2::assets_v1::EchoCoin002',
        decimals: 6,
        icon: (props) => <Image source={require('../assets/tokens/GUI.png')} style={{
            width: props?.size ?? 24,
            height: props?.size ?? 24,
        }} />,
        getCurrentBalance: async () => {
            const coinBalance = await aptos.account.getAccountCoinAmount({
                accountAddress: delegateManager.account?.address().toString() ?? '',
                coinType: '0xe4ccb6d39136469f376242c31b34d10515c8eaaa38092f804db8e08a8f53c5b2::assets_v1::EchoCoin002'
            })

            return (coinBalance ?? 0) / 10 ** 6
        },
        getUSDBalance: async (balance: number) => {
            const conversion = await Utils.getCurrencyUSD({
                currencyID: 'gui'
            })

            const usdBalance = balance * (conversion ?? 0)

            return usdBalance
        }
    }
]