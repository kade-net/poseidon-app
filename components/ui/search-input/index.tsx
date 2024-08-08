import { View, Text, XStack, Input } from 'tamagui'
import React, { useEffect, useState } from 'react'
import { Search, XCircle } from '@tamagui/lucide-icons'
import { TouchableOpacity } from 'react-native'

interface Props {

}

type P = Props & Parameters<typeof Input>[0] & {
    onInputActiveChange?: (active: boolean) => void
}

const SearchInput = (props: P) => {
    const { onInputActiveChange, ...rest } = props
    const [active, setActive] = useState(false)
    useEffect(() => {
        onInputActiveChange?.(active)
    }, [active])
    return (
        <XStack flex={1} alignItems='center' backgroundColor={'$inputBackground'} borderRadius={30} px={20}   >
            {active && <XStack w="100%" alignItems='center'   >
                <Search size={16} color={'$primary'} />
                <Input backgroundColor={"$backgroundTransparent"} {...rest} autoFocus autoCapitalize='none' borderWidth={0} placeholder='' flex={1} />
                <TouchableOpacity
                    onPress={() => {
                        setActive(false)
                        rest?.onChangeText?.('')
                    }}
                    style={{
                        position: 'absolute',
                        right: -20,
                        top: 0,
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <XCircle color={'$red10'} size={16} />
                </TouchableOpacity>
            </XStack>}
            {!active && <XStack backgroundColor={'$inputBackground'} onPress={() => {
                setActive(true)
            }} w="100%" alignItems='center' justifyContent='center' columnGap={10} py={10} >
                <Search size={12} color={'$primary'} />
                <Text color={'$primary'} >Search</Text>
            </XStack>}
        </XStack>
    )
}

export default SearchInput