export interface TRevenueTransaction {
    from: string
    type: 'mint' | 'tip' | 'payment'
    amount: number
    currency: string
    timestamp: number
    hash?: string
    nft?: {
        url: string,
        type: 'image' | 'video'
    }
    profile?: {
        username: string,
        pfp: string
        display_name: string
    }
    message: string
}