import { View, Text } from 'tamagui'
import React from 'react'
import { buildPortalTransactionArgs } from '../../../../lib/transactions/portal-transactions'

interface P { }

type T = P & buildPortalTransactionArgs

const Simulating = (props: T) => {
    const { module_arguments, module_function } = props

    return (
        <View>
            <Text>Simulating</Text>
        </View>
    )
}

export default Simulating