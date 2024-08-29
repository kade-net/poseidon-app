import { isUndefined } from 'lodash'
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
                backgroundColor: '$lightButton',
                color: '$sideText',
            },
            text: {
                backgroundColor: 'transparent',
                color: '$primary'
            },
            "outlined-primary": {
                backgroundColor: '$colorTransparent',
                borderWidth: 1,
                borderColor: '$primary'
            }
        },
        rounded: {
            large: {
                borderRadius: "$6"
            },
            medium: {
                borderRadius: '$3'
            },
            small: {
                borderRadius: '$1'
            },
            full: {
                borderRadius: 100
            }
        }
    } as const,
    defaultVariants: {
        type: 'primary',
        rounded: 'medium'
    },
})

function BaseButton(props: Parameters<typeof _BaseButton>[0] & { loading?: boolean, loadingText?: string }) {
    const { children, loading, loadingText, ...rest } = props
    return <_BaseButton key={isUndefined(loading) ? undefined : `${loading}`} {...rest} >
        {
            loading ? <XStack alignItems='center' justifyContent='center' columnGap={5} flex={1} px={5} >
                <Spinner color={rest.type == 'outlined' ? '$primary' : 'white'} />
                {/* {loadingText ?
                <Text
                    color={'white'}
                >{loadingText}</Text> :
                    null}  */}
            </XStack> : <>
                    <Text color={rest.type == 'outlined' ? '$sideText' : rest.type == 'text' ? '$primary' : 'white'} >

                {children}
                    </Text>
            </>
        }
    </_BaseButton>
}

export default BaseButton

