import { View, Text, YStack, useTheme, XStack, Image } from 'tamagui'
import React, { memo, useMemo } from 'react'
// @ts-ignore
import { OpenGraphAwareInput, OpenGraphDisplay, OpenGraphParser } from 'react-native-opengraph-kit';
import { useQuery } from 'react-query';
import { Alert, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import * as Linking from 'expo-linking'
import * as browser from 'expo-web-browser'
import PortalRenderer from '../portal-ui';

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
    publication_ref: string
    kid: number
}

// TODO: add linking white list
const LINK_WHITELIST = [

]

const PORTALS_URL = [
    "https://portals.poseidon.ac"
]

const LinkResolver = (props: Props) => {
    const { link = '', kid, publication_ref } = props

    const linkMetaQuery = useQuery({
        queryKey: ['link', link],
        queryFn: async (): Promise<OGData[]> => {
            try {
                const data = await OpenGraphParser?.extractMeta?.(link?.trim() ?? "")
                return data
            }
            catch (e) {
                console.log("Something went wrong", e)
                return []
            }
        },
        enabled: !!link?.trim()
    })

    const handleOpenUrl = async () => {
        const _link = link.trim()
        return Linking.canOpenURL(_link).then(async (supported) => {
            if (supported) {
                Alert.alert("Leaving app", "You are about to leave the app, and pose a risk of being redirected to a malicious website. Are you sure you want to continue?", [
                    {
                        text: "Cancel",
                        onPress: () => { }
                    },
                    {
                        text: "Continue",
                        onPress: () => Linking.openURL(_link)
                    }
                ])
            } else {
                await browser.openBrowserAsync(_link)
            }
        })
    }

    if (link.startsWith("https://portals.poseidon.ac")) {
        return <PortalRenderer
            kid={kid}
            post_ref={publication_ref}
            url={link}
        />
    }

    if (!link || link.length === 0 || !linkMetaQuery.data?.[0] || !linkMetaQuery.data?.[0]?.url || !linkMetaQuery.data?.[0]?.title) {
        return <XStack w={0} h={0} />
    }

    return (
        <TouchableWithoutFeedback
            onPress={handleOpenUrl}
        >
            <YStack borderColor={'$borderColor'} borderWidth={1} borderRadius={5} w="100%" mt={5} >
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