import { ANCHORS_VIEW_FUNCTIONS, aptos } from "..";
import delegateManager from "../../lib/delegate-manager";


class AnchorsModule {

    async getBalance() {

        const data = await aptos.view({
            payload: {
                function: ANCHORS_VIEW_FUNCTIONS.get_balance,
                functionArguments: [delegateManager.owner!],
                typeArguments: []
            }
        })
        const [balance] = data as [string]

        if (!balance) return 0
        if (Number.isNaN(parseInt(balance))) return 0
        return parseInt(balance)
    }
}

export default new AnchorsModule()