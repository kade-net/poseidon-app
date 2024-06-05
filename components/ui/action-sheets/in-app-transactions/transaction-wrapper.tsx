import { View, Text } from 'react-native'
import React from 'react'
import { createActorContext, useMachine } from '@xstate/react'
import { inAppTransactionsMachine } from './machine'

export const TransactionActorContext = createActorContext(inAppTransactionsMachine)

interface P {
    children: React.ReactNode
}

const TransactionWrapper = (props: P) => {
    const { children } = props
    return (
        <TransactionActorContext.Provider>
            {children}
        </TransactionActorContext.Provider>
    )
}

export default TransactionWrapper