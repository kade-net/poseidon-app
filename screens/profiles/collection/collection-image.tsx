import { View } from 'react-native'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Utils } from '../../../utils'
import { Image, Spinner, YStack, Text, XStack } from 'tamagui'
import BaseButton from '../../../components/ui/buttons/base-button'
import { useLocalSearchParams } from 'expo-router'
import delegateManager from '../../../lib/delegate-manager'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { useQuery as useApolloQuery } from '@apollo/client'
import * as Haptics from 'expo-haptics'
import account from '../../../contract/modules/account'
import Toast from 'react-native-toast-message'
import { SvgUri } from 'react-native-svg'

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
    const params = useLocalSearchParams()
    const address = params?.['address'] as string
    const IS_OWNER = address === delegateManager.owner!
    const profile = useApolloQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        },
        skip: !IS_OWNER
    })
    const [uploading, setUploading] = useState(false)
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
                const aspectRatio = width / height
                const newAspectRatio = isNaN(aspectRatio) ? 16 / 9 : aspectRatio == 0 ? 1 : aspectRatio
                return newAspectRatio
            }
            catch (e) {
                return 16 / 9
            }
        },
        enabled: !!image && !validateImageQuery.data?.is_svg
    })

    const handleSetPfp = async () => {
        Haptics.selectionAsync()
        setUploading(true)
        try {
            await account.updateProfile({
                pfp: image,
                bio: profile.data?.account?.profile?.bio ?? undefined,
                display_name: profile.data?.account?.profile?.display_name ?? undefined
            })
        }
        catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Toast.show({
                type: 'error',
                text1: 'Something went wrong'
            })
        }
        finally {
            setUploading(false)
        }
    }

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
        <YStack w="100%" rowGap={10} >
            {
                validateImageQuery?.data?.is_svg ?
                    <SvgUri
                        width={'100%'}
                        height={300}
                        uri={image}
                    /> : <Image
                src={image ?? ''}
                aspectRatio={aspectRatioQuery?.data ?? 16 / 9}
            />
            }

            {(IS_OWNER && !validateImageQuery?.data?.is_svg) && <XStack>

                <BaseButton loading={uploading} onPress={handleSetPfp} size="$2" py={3} type="outlined" >
                    <Text>
                        Set as PFP
                    </Text>
                </BaseButton>
            </XStack>}
        </YStack>
    )
}

export default CollectionImage