import { aptos } from "../../contract";
import delegateManager from "../delegate-manager";

interface TransactionParticipant {
    address: string,
    kade_account_owner_address: string,
    is_user: boolean
}

interface PoseidonSimpleTransaction {
    sender: TransactionParticipant,
    receiver: TransactionParticipant,
    function_name: string,
    gas_fees: number,
    amount: number,
    version_number: string
    success: boolean
}


class PoseidonWallet {

    async getTransactions() {









    }


}