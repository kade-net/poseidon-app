import * as Network from 'expo-network';

class PoseidonNetwork {

    async isNetworkConnected() : Promise<boolean> {
        const networkStatus: Network.NetworkState = await  Network.getNetworkStateAsync()

        return networkStatus.isInternetReachable as boolean;
    }
}

export default new PoseidonNetwork();