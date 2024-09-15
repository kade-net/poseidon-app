import {CONVERSATION_HEADER, MESSAGE, MESSAGE_TYPE} from "@kade-net/fgs-rn";


export const dummyMessagingData: Array<MESSAGE> = [
    {
        content: "GM Fam",
        attachments: [],
        id: "msg_001",
        type: MESSAGE_TYPE.MESSAGE,
        timestamp: Date.now(),
        originator: "0x4ef479c7f529d93cd4cf7bcbc0e9c9516816dd6d9bfad032d543327deb24ed85",
        random_delimiter: "AB12"
    }
]

export const conversationHeaders: Array<CONVERSATION_HEADER> = [
    {
        conversation_id: 'conversation_id',
        participants: ["0x4ef479c7f529d93cd4cf7bcbc0e9c9516816dd6d9bfad032d543327deb24ed85"],
        originator: '0x4ef479c7f529d93cd4cf7bcbc0e9c9516816dd6d9bfad032d543327deb24ed85',
        conversation_key: 'conversation_key'
    },
    {
        conversation_id: 'conversation_id',
        participants: ["0xa5531453406f380515049743a59620fb6f4e126c2c0cca1f379712f0d835d574"],
        originator: '0x4ef479c7f529d93cd4cf7bcbc0e9c9516816dd6d9bfad032d543327deb24ed85',
        conversation_key: 'conversation_key'
    }
]