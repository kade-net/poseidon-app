import { View, Text, Image } from 'react-native'
import React from 'react'
import { XStack } from 'tamagui'
import ImageIcon from '../../../assets/svgs/image-icon'

interface Props {
    size: '$md' | '$sm' | '$lg',
    src: string
}


const BaseAvatar = React.forwardRef<unknown, Props>((props, ref) => {
    const { size, src } = props
    const IMG_SIZE = size === '$md' ? '$3' : size === '$sm' ? '$2' : size === '$lg' ? '$4' : '$3'

    return (
        <XStack w={IMG_SIZE} h={IMG_SIZE} borderRadius={100} overflow='hidden' alignItems='center' justifyContent='center' >
            <Image
                src={src}
                style={{
                    aspectRatio: 1,
                    width: '100%',
                    height: '100%',
                    borderRadius: 100
                }}
            />
            {/* <ImageIcon/> */}
        </XStack>
    )
})

BaseAvatar.displayName = 'BaseAvatar'

export default BaseAvatar

