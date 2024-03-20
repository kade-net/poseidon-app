import { View, Text, YStack, useTheme, XStack, Image } from 'tamagui'
import React, { memo, useMemo } from 'react'
// @ts-ignore
import { OpenGraphAwareInput, OpenGraphDisplay, OpenGraphParser } from 'react-native-opengraph-kit';
import { useQuery } from 'react-query';
import { TouchableWithoutFeedback, useColorScheme } from 'react-native';
import * as Linking from 'expo-linking'
import * as browser from 'expo-web-browser'

interface OGData {
    creator: string
    description: string
    title: string,
    'twitter:creator': string,
    url: string
    image: string
}

interface Props {
    link: string
}

// TODO: add linking white list
const LINK_WHITELIST = [

]

const LinkResolver = (props: Props) => {
    const { link } = props

    const linkMetaQuery = useQuery({
        queryKey: ['link', link],
        queryFn: (): Promise<Array<OGData>> => OpenGraphParser.extractMeta(link),
        enabled: !!link
    })
    const theme = useTheme()
    const mode = useColorScheme()

    const handleOpenUrl = () => {
        const _link = link.trim()
        return Linking.canOpenURL(_link).then(async (supported) => {
            console.log("supported", supported)
            if (supported) {
                Linking.openURL(_link)
            } else {
                await browser.openBrowserAsync(_link)
            }
        })
    }

    if (!link) return null

    return (
        <TouchableWithoutFeedback
            onPress={handleOpenUrl}
        >
            <YStack w="100%" mt={5} >
                <XStack w="100%" columnGap={10} borderWidth={
                    linkMetaQuery.data?.[0]?.image ? 1 : 0
                } borderColor={'$borderColor'} borderRadius={5} p={5} >
                    {linkMetaQuery.data?.at(0)?.image && <Image
                        height={70}
                        aspectRatio={1}
                        resizeMode='cover'
                        source={{ uri: linkMetaQuery.data?.[0]?.image }}
                        borderRadius={2}
                    />}
                    <YStack rowGap={5} flex={1} >
                        {linkMetaQuery.data?.[0]?.title && <Text w="100%" >
                            {linkMetaQuery.data?.[0]?.title}
                        </Text>}
                        {linkMetaQuery.data?.[0]?.description && <Text fontSize={12} w="100%" >
                            {linkMetaQuery.data?.[0]?.description}
                        </Text>}
                        <Text fontSize={12} color={'$blue10'} w="100%" >
                            {linkMetaQuery.data?.[0]?.url}
                        </Text>
                    </YStack>
                </XStack>
            </YStack>
        </TouchableWithoutFeedback>
    )
}

export default memo(LinkResolver)