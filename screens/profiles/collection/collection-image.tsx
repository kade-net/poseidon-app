import { View, Text } from 'react-native'
import React from 'react'
import { useQuery } from 'react-query'
import { Utils } from '../../../utils'
import { Image, Spinner, YStack } from 'tamagui'

const getSize = async (image: string) => {
    return new Promise<{ width: number, height: number }>((res, rej) => {
        Image.getSize(image, (width, height) => {
            res({ width, height })
        }, (error) => {
            rej(error)
        })
    })
}

interface Props {
    image: string
    name: string
}
const CollectionImage = (props: Props) => {
    const { image, name } = props
    const validateImageQuery = useQuery({
        queryKey: [image],
        queryFn: () => Utils.validateImageUri(image ?? '')
    })

    const aspectRatioQuery = useQuery({
        queryKey: ['collection', image],
        queryFn: async () => {
            try {
                const { width, height } = await getSize(image)
                return width / height
            }
            catch (e) {
                return 16 / 9
            }
        },
        enabled: !!image
    })

    if (validateImageQuery.isLoading) return (
        <YStack flex={1} alignItems='center' justifyContent='center' >
            <Spinner />
        </YStack>
    )

    if (!validateImageQuery.data) return (
        <YStack bg='$button' flex={1} aspectRatio={1} borderRadius={5} overflow='hidden' alignItems='center' justifyContent='center'  >
            <Text>
                {name ?? 'Untitled'}
            </Text>
        </YStack>
    )

    return (
        <Image
            src={image ?? ''}
            aspectRatio={aspectRatioQuery?.data ?? 16 / 9}
        />
    )
}

export default CollectionImage