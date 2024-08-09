import { Image } from "react-native";
import AptosIcon from "../assets/svgs/aptos-icon";
import { aptos } from "../contract";
import delegateManager from "./delegate-manager";

export interface Currency {
    name: string,
    address: string,
    decimals: number,
    icon: () => React.ReactNode,
    getCurrentBalance?: () => Promise<number>
}

export const currencies: Array<Currency> = [
    {
        name: 'APT',
        address: 'apt',
        decimals: 8,
        icon: () => <AptosIcon color='white' size={24} />,
        getCurrentBalance: async () => {
            console.log("Address::", delegateManager.account?.address().toString())
            const coinBalance = await aptos.account.getAccountCoinAmount({
                accountAddress: delegateManager.account?.address().toString() ?? '',
                coinType: '0x1::aptos_coin::AptosCoin'
            })

            // console.log("Coin balance::", coinBalance)

            return (coinBalance ?? 0) / 10 ** 8
        }
    },
    {
        name: 'GUI',
        address: 'gui',
        decimals: 8,
        icon: () => <Image source={require('../assets/tokens/GUI.png')} style={{
            width: 24,
            height: 24,
        }} />,
        getCurrentBalance: async () => {
            const coinBalance = await aptos.account.getAccountCoinAmount({
                accountAddress: delegateManager.account?.address().toString() ?? '',
                coinType: '0xe4ccb6d39136469f376242c31b34d10515c8eaaa38092f804db8e08a8f53c5b2::assets_v1::EchoCoin002'
            })

            return (coinBalance ?? 0) / 10 ** 8
        }
    }
]