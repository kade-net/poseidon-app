import { View, Text, YStack, useTheme, XStack, Image, SizableText } from 'tamagui'
import React, { memo, useMemo } from 'react'
// @ts-ignore
import { OpenGraphAwareInput, OpenGraphDisplay, OpenGraphParser } from 'react-native-opengraph-kit';
import { useQuery } from 'react-query';
import { Alert, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import * as Linking from 'expo-linking'
import * as browser from 'expo-web-browser'
import PortalRenderer from '../portal-ui';
import { Globe } from '@tamagui/lucide-icons';
import { truncate } from 'lodash';

const HOST_REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/img

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

    if (link.includes("https://portals.poseidon.ac") || link.includes("http://192.168.1.7:3000")) {
        return <PortalRenderer
            kid={kid}
            post_ref={publication_ref}
            url={
                __DEV__ ? link?.replace("https://portals.poseidon.ac", "http://192.168.1.7:3000") :
                    link
            }
        />
    }

    if (!link || link.length === 0 || !linkMetaQuery.data?.[0] || !linkMetaQuery.data?.[0]?.url || !linkMetaQuery.data?.[0]?.title) {
        return <XStack w={0} h={0} />
    }

    const extractDomain = (url: string): string  => {
        try {
            const { hostname } = new URL(url);
            return hostname.replace(/^www\./, '');
        } catch (error) {
            console.error('Invalid URL:', error);
            return '';
        }
    }

    const linkDomain: string = extractDomain(link)

    const getSize = async (image: string) => {
        return new Promise<{ width: number, height: number }>((res, rej) => {
            Image.getSize(image, (width, height) => {
                res({ width, height })
            }, (error) => {
                rej(error)
            })
        })
    }

    const { data: aspectRatio, isLoading, error } = useQuery({
        queryKey: ['aspectRatio:feed', linkMetaQuery.data?.[0]?.image],
        queryFn: async () => {

            const { width, height } = await getSize(linkMetaQuery.data?.[0]?.image)
                return width / height

        },
        initialData: 16 / 9
    })
    
    const maxAspectRatio = 1.8
    let finalAspectRatio;

    if(aspectRatio){
        finalAspectRatio = aspectRatio < maxAspectRatio ? maxAspectRatio : aspectRatio
    }

    return (
        <TouchableWithoutFeedback
            onPress={handleOpenUrl}
        >
            <YStack borderRadius={5} w="100%" mt={5} >
                <YStack w="100%" columnGap={10} borderWidth={
                    linkMetaQuery.data?.[0]?.image ? 1 : 0
                } borderColor={'$borderColor'} borderRadius={5} p={5} >
                    {linkMetaQuery.data?.at(0)?.image && <Image
                        w="100%"
                        aspectRatio={finalAspectRatio}
                        source={{ uri: linkMetaQuery.data?.[0]?.image }}
                        borderTopLeftRadius={9}
                        borderTopRightRadius={9}
                        mb={10}

                    />}
                    <YStack rowGap={5} flex={1} >
                        {linkDomain.length>0 && <SizableText color={"$sideText"} ellipse={true} w="100%" >
                            {linkDomain}
                        </SizableText>}
                        {linkMetaQuery.data?.[0]?.title && <SizableText numberOfLines={2} size={"$sm"}  w="100%" >
                            {linkMetaQuery.data?.[0]?.title}
                        </SizableText>}
                        {linkMetaQuery.data?.[0]?.description && <SizableText numberOfLines={3} mt={2} fontSize={12} w="100%" >
                            {linkMetaQuery.data?.[0]?.description}
                        </SizableText>}
                    </YStack>
                </YStack>
            </YStack>
        </TouchableWithoutFeedback>
    )
}

export default memo(LinkResolver)