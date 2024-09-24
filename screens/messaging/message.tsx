import {Text, useTheme, XStack, YStack} from "tamagui";
import Conversation from "./conversation";
import { ATTACHMENT, MESSAGE } from "@kade-net/fgs-rn";
import delegateManager from "../../lib/delegate-manager";
import dayjs from "dayjs";
import {memo, useEffect, useMemo, useState} from "react";
import uploadManager from "../../lib/upload-manager";
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { Utils } from "../../utils";
import MediaViewer from "../../components/ui/media/media-viewer";
import { useConversationContext } from "./context";
import {useQuery} from "react-query";
import {Image, XCircle} from "@tamagui/lucide-icons";
import {ErrorBoundary} from "../../components/ui/error-boundary";
import {Platform} from "react-native";

const Thrower = () => {
    useEffect(() => {
        throw new Error("Just checking");
    }, []);

    return (
        <XStack></XStack>
    )
}

const Attachments = memo((props: {data: MESSAGE})=> {

    const { data } = props
    const { conversation } = useConversationContext()


    const attachmentsQuery = useQuery({
        queryKey: [`attachments-query-${data?.id}`],
        queryFn: async ()=> {
            try {
                // console.log("Attachments::", data?.attachments)
                if ((data?.attachments?.length ?? 0) == 0) return []

                // console.log("Conversation Key", conversation?.header?.conversation_key)

                if(!conversation) return [];

                const attachments = await Promise.all(data?.attachments?.map(async (attachment) => {

                    let fileName = Utils.extractFileName(attachment.uri)!
                    // console.log("File Name::", fileName)
                    fileName = `${FileSystem.documentDirectory}${fileName}`




                    const existingFileInfo = await FileSystem.getInfoAsync(fileName)
                    const dfileName = fileName?.replace("..encrypted", "")?.replace('.encrypted', '')
                    const existingDecryptedFileInfo = await FileSystem.getInfoAsync(dfileName)

                    if (existingFileInfo.exists && existingDecryptedFileInfo.exists) {

                        const fileData = await FileSystem.readAsStringAsync(existingDecryptedFileInfo.uri, {encoding: 'base64'})
                        if((fileData?.trim()?.length ?? 0) == 0) return null;
                        return {
                            uri: existingDecryptedFileInfo.uri,
                            TYPE: attachment.TYPE,
                            SIZE: attachment.SIZE
                        } as ATTACHMENT
                    }

                    const res = await FileSystem.downloadAsync(attachment.uri, fileName)

                    const decrypted = await conversation?.decryptFile(res.uri)
                    // console.log("Decrypted:: ", decrypted)
                    const decryptedFile = decrypted?.includes('file://') ? decrypted : `file://${decrypted}`
                    const { granted } = await MediaLibrary.requestPermissionsAsync()

                    const decFileInfo = await FileSystem.readAsStringAsync(decryptedFile, {encoding: 'base64'})
                    if((decFileInfo?.trim()?.length ?? 0) == 0){
                        return null
                    }

                    if (granted) {
                        await MediaLibrary.saveToLibraryAsync(decryptedFile)



                        return {
                            uri: decryptedFile,
                            TYPE: attachment.TYPE,
                            SIZE: attachment.SIZE
                        } as ATTACHMENT

                    }

                    return null
                })?.filter(a => a !== null))

                return attachments as Array<ATTACHMENT>
            }
            catch (e)
            {
                console.log("Something went wrong::", e)
                return []
            }
        }
    })

    const isMe = data?.originator == delegateManager?.account?.address().toString()
    const IS_EMPTY_MESSAGE = (data?.content?.trim()?.length ?? 0) == 0;

    if(!props.data?.attachments || props?.data?.attachments?.length === 0) return null;

    if(attachmentsQuery?.isLoading) return (
        <XStack w={"100%"} px={10} justifyContent={isMe ? 'flex-end' : 'flex-start'} >
            <YStack alignItems={'center'} justifyContent={'flex-end'} width={'90%'} height={250} backgroundColor={'$portalBackground'} borderRadius={10} >
                <YStack aspectRatio={1} w={'100%'} h={'100%'} alignItems={'center'} justifyContent={'center'} >
                    <Image/>
                </YStack>
            </YStack>
        </XStack>
    );

    return (
        <YStack borderRadius={5} px={10} pt={10} width={'90%'} justifyContent={'flex-end'} >
            <XStack backgroundColor={'$portalBackground'} flex={1} >
                <ErrorBoundary
                    fallback={<YStack flex={1} w={'100%'} h={'100%'} alignItems={'center'} justifyContent={'center'} p={10} >
                        <XCircle color={'red'} />
                        <Text fontSize={14} >
                            Unsupported asset!
                        </Text>
                    </YStack>}
                >
                    <MediaViewer
                        data={attachmentsQuery?.data?.map(a => {
                            return ({
                                type: a?.TYPE,
                                url: a?.uri
                            })}
                        )
                    }
                    />
                </ErrorBoundary>
            </XStack>
            {IS_EMPTY_MESSAGE && <XStack w={'100%'} justifyContent={isMe ? 'flex-end' : 'flex-start'}>
                <Text fontSize={10} color={'beige'}>
                    {dayjs(data?.timestamp).format('HH:mm')}
                </Text>
            </XStack>}
        </YStack>
    )
})


interface Props {
    data: MESSAGE
    surrounding?: [Array<MESSAGE>, Array<MESSAGE>]
}
export const Message = memo((props: Props)=>{
    const { conversation } = useConversationContext()
    const { data, surrounding } = props

    const isMe = data?.originator == delegateManager?.account?.address().toString()
    const theme = useTheme()
    const IS_FIRST = surrounding?.at(0)?.length == 0
    const IS_SAME_WEEK = IS_FIRST && dayjs(data?.timestamp).isSame(new Date(), 'week')
    const IS_EMPTY_MESSAGE = (data?.content?.trim()?.length ?? 0) == 0;

    if(!data) return null;

    return (
        <YStack w={"100%"} >
            {
                IS_FIRST && <XStack w={"100%"} alignItems={'center'} justifyContent={'center'} >
                    <XStack p={5} borderRadius={5} >
                        <Text fontWeight={'semibold'} >
                            {dayjs(data?.timestamp).format(IS_SAME_WEEK ? 'dddd' : 'ddd, D MMM')}
                        </Text>
                    </XStack>
                </XStack>
            }
            <YStack w={"100%"} >
                <XStack w={"100%"} justifyContent={isMe ? 'flex-end' : 'flex-start'} >
                    <Attachments data={data} />
                </XStack>
                {!IS_EMPTY_MESSAGE && <XStack w={"100%"} alignItems={'center'} justifyContent={isMe ? 'flex-end' : 'flex-start'} p={10}
                         pt={0}>
                    <YStack maxWidth={"90%"} alignItems={'flex-end'} p={10} rowGap={5}
                            style={isMe ? {
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                backgroundColor: theme.primary.val
                            } : {
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                backgroundColor: theme.portalBackground?.val
                            }}
                    >

                        <YStack>
                            <Text>
                                {data?.content?.trim()}
                            </Text>
                        </YStack>
                        <XStack pl={15}>
                            <Text fontSize={10} color={'beige'}>
                                {dayjs(data?.timestamp).format('HH:mm')}
                            </Text>
                        </XStack>
                    </YStack>
                </XStack>}
            </YStack>
        </YStack>
    )
})