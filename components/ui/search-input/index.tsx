import { View, Text, XStack, Input } from 'tamagui'
import React, { useState } from 'react'
import { Search, XCircle } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'

interface Props {

}

type P = Props & Parameters<typeof Input>[0]

const SearchInput = (props: P) => {
    const { ...rest } = props
    const [active, setActive] = useState(false)
    return (
        <XStack flex={1} alignItems='center' backgroundColor={'$baseBackround'} borderRadius={30} px={20}   >
            {active && <XStack w="100%" alignItems='center'   >
                <Search size={16} color={'$primary'} />
                <Input {...rest} autoFocus autoCapitalize='none' borderWidth={0} placeholder='' flex={1} onBlur={(e) => {
                    setActive(false)
                    rest?.onBlur?.(e)
                }} />
                <TouchableOpacity
                    onPress={() => {
                        setActive(false)
                        rest?.onChangeText?.('')
                    }}
                >
                    <XCircle size={16} />
                </TouchableOpacity>
            </XStack>}
            {!active && <XStack onPress={() => {
                setActive(true)
            }} w="100%" alignItems='center' justifyContent='center' columnGap={10} py={10} >
                <Search size={12} />
                <Text>Search</Text>
            </XStack>}
        </XStack>
    )
}

export default SearchInput