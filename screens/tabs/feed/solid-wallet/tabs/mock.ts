import { TRevenueTransaction } from "./types";


export const mockTransactions: TRevenueTransaction[] = [
    {
        from: "0x1234abcd5678efgh9012ijkl",
        type: "mint",
        amount: 250,
        currency: "USD",
        timestamp: 1692889170,
        hash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        nft: {
            url: "https://images.pexels.com/photos/2832468/pexels-photo-2832468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            type: "image"
        },
        profile: {
            username: "nft_creator_01",
            pfp: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            display_name: "NFT Creator"
        },
        message: "Minted your NFT for 250 $APT"
    },
    {
        from: "0xabcdef1234567890abcdef1234567890",
        type: "tip",
        amount: 50,
        currency: "ETH",
        timestamp: 1692892170,
        profile: {
            username: "artlover42",
            pfp: "https://images.pexels.com/photos/3219948/pexels-photo-3219948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            display_name: "Art Lover"
        },
        message: "Tipped you 50 $GUI"
    },
    {
        from: "0x9876fedcba4321fedcba4321fedcba43",
        type: "payment",
        amount: 1000,
        currency: "BTC",
        timestamp: 1692895170,
        hash: "0xfedcba9876543210fedcba9876543210",
        profile: {
            username: "custom_nft_buyer",
            pfp: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            display_name: "Custom NFT Buyer"
        },
        message: "Paid you 1000 $GUI"
    },
    {
        from: "0x8765efcd4321abcf8765efcd4321abcf",
        type: "mint",
        amount: 500,
        currency: "USD",
        timestamp: 1692898170,
        hash: "0x123456789abcdef0123456789abcdef0",
        nft: {
            url: "https://images.pexels.com/photos/355288/pexels-photo-355288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            type: "image"
        },
        profile: {
            username: "videomaster",
            pfp: "https://images.pexels.com/photos/3219948/pexels-photo-3219948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            display_name: "Video Master"
        },
        message: "Minted your NFT for 500 $GUI"
    },
    {
        from: "0xfedcba0987654321fedcba0987654321",
        type: "tip",
        amount: 75,
        currency: "USD",
        timestamp: 1692901170,
        profile: {
            username: "supporter99",
            pfp: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            display_name: "Top Supporter"
        },
        message: "Tipped you 75 $GUI"
    }
];

