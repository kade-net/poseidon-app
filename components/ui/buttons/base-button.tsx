import React from 'react'
import { useColorScheme } from 'react-native'
import { Button, Spinner, Text, XStack, styled } from 'tamagui'

const _BaseButton = styled(Button, {
    variants: {
        type: {
            primary: {
                backgroundColor: '$primary',
            },
            outlined: {
                backgroundColor: '$colorTransparent',
                borderWidth: 1,
                borderColor: '$primary',
                color: '$primary',
            }
        }
    } as const,
    defaultVariants: {
        type: 'primary'
    },
})

function BaseButton(props: Parameters<typeof _BaseButton>[0] & { loading?: boolean, loadingText?: string }) {
    const { children, loading, loadingText, ...rest } = props
    return <_BaseButton {...rest} >
        {
            loading ? <XStack alignItems='center' justifyContent='center' columnGap={5} flex={1} px={5} >
                <Spinner />
                {/* {loadingText ? 
                <Text
                    color={'white'}
                >{loadingText}</Text> : 
                null} */}
            </XStack> : <>
                {children}
            </>
        }
    </_BaseButton>
}

export default BaseButton

