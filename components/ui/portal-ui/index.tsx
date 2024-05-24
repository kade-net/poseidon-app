import { View, Text, YStack, Spinner, Input, Button } from 'tamagui'
import React, { useState } from 'react'
import usePortal from '../../../lib/portals/use-portal'
import { Image } from 'react-native'
import { sortBy } from 'lodash'
import useDisclosure from '../../hooks/useDisclosure'
import TransactionSheet from '../action-sheets/in-app-transactions/transaction-sheet'
import { PortalButton } from '@kade-net/portals-parser'

interface Props {
    url: string
    kid: number
    post_ref: string
}
const PortalRenderer = (props: Props) => {
    const { url, kid, post_ref: ref } = props
    const [input, setInput] = useState<string>()
    const [activeButton, setActiveButton] = React.useState<PortalButton | null>(null)
    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
    const { portal, loading, setPortal, error, handleButtonPress } = usePortal({
        initialUrl: url
    })

    console.log(JSON.stringify(portal))

    const handleMint = (button: PortalButton | null) => {
        setActiveButton(button)
        onOpen()
    }

    const handleClose = async (hash: string) => {
        console.log("hash", hash)
        onClose()
        if (activeButton) {
            await handleButtonPress({
                button: activeButton,
                kid,
                ref,
                hash
            })
        }
    }


    if (loading) {
        return (
            <YStack
                aspectRatio={1}
                width={'100%'}
                borderRadius={10}
                padding={10}
                backgroundColor={'rgb(12,12,45)'}
                alignItems='center'
                justifyContent='center'
            >
                <Spinner />
            </YStack>
        )
    }

    return (
        <YStack
            width={'100%'}
            backgroundColor={'rgb(12,12,45)'}
            borderRadius={10}
        >
            <YStack w={"100%"} p={5} aspectRatio={1.91 / 1} >
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }}
                    source={{ uri: portal?.components.image?.image }}
                />
            </YStack>
            <YStack
                w="100%"
                p={5}
            >
                {
                    portal?.components?.input && <Input
                        value={input ?? ''}
                        onChangeText={setInput}
                        placeholder={portal?.components?.input?.input || ""}
                    />
                }
                <YStack w="100%" rowGap={10}  >
                    {
                        sortBy(portal?.components.buttons, 'index').map((button) => {
                            return (
                                <Button key={button.index} onPress={() => {
                                    if (button.type === 'mint') {
                                        handleMint(button)
                                    } else {
                                        handleButtonPress({
                                            button,
                                            kid,
                                            ref,

                                        })
                                    }
                                }} >
                                    {button.title}
                                </Button>
                            )
                        })
                    }
                </YStack>
            </YStack>
            <TransactionSheet
                isOpen={isOpen}
                onClose={(hash) => {
                    console.log("hash", hash)
                    if (hash) {
                        handleClose(hash)
                    }
                }}
                module_arguments={activeButton?.module_arguments || ''}
                module_function={activeButton?.module_function || ''}
                type_arguments={activeButton?.type_arguments}
                onOpen={onOpen}
                onToggle={onToggle}
            />
        </YStack>
    )
}

export default PortalRenderer