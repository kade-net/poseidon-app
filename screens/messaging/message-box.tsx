import { z } from "zod";
import React, {useRef, useState} from "react";
import { useQueryClient } from "react-query";
import { Spinner, TextArea, useTheme, XStack, YStack } from "tamagui";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { ATTACHMENT, deserializeMessage, MESSAGE, MESSAGE_TYPE } from "@kade-net/fgs-rn";
import * as ImagePicker from "expo-image-picker";
import uploadManager from "../../lib/upload-manager";
import { Utils } from "../../utils";
import MediaViewer from "../../components/ui/media/media-viewer";
import {Dimensions, Keyboard, Platform, TextInput, TouchableOpacity} from "react-native";
import { ArrowUp, Image as ImageIcon } from "@tamagui/lucide-icons";
import { useConversationContext } from "./context";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import notifications from "../../lib/notifications";


const KEYBOARD_PADDING = Platform.select({ ios: 10, android: 0 }) ?? 0

const DEVICE_HEIGHT = Dimensions.get('screen').height;

const useGradualAnimation = () => {
    const height = useSharedValue(KEYBOARD_PADDING)

    useKeyboardHandler({
        onMove(e) {
            'worklet';
            height.value = Math.max(e.height, KEYBOARD_PADDING)
        }
    }, [])

    return { height }
}

const MessageForm = z.object({
    content: z.string().trim().optional(),
    attachments: z.array(z.object({
        url: z.string().trim().min(1),
        type: z.string().trim().min(1),
        unencrypted: z.string().optional(),
        size: z.number()
    })).optional()
})

type TMessageForm = z.infer<typeof MessageForm>

interface MessageBoxProps {

}
export function MessageBox(props: MessageBoxProps) {
    const inputRef = React.useRef<TextInput>(null);
    const [sending, setSending] = useState(false)
    const [uploading, setUploading] = useState(false)
    const queryClient = useQueryClient()
    const { conversation, messageQuery } = useConversationContext()

    const [focused, setFocused] = useState(false)
    const theme = useTheme()

    const { height: keyboardHeight } = useGradualAnimation()

    const keyboardFollower = useAnimatedStyle(() => {
        return {
            height: Math.abs(keyboardHeight.value) - 50,
            // marginBottom: keyboardHeight.value > -20 ? 0 : KEYBOARD_PADDING,
        }
    })

    const form = useForm<TMessageForm>({
        resolver: zodResolver(MessageForm)
    })

    const handleSendMessage = async (values: TMessageForm) => {
        if( (values?.content?.length ?? 0) == 0 && ((values?.attachments?.length ?? 0) == 0)) return;
        await Haptics.selectionAsync()
        setSending(true)
        const resp = await conversation?.sendMessage({
            content: values.content ?? "",
            type: MESSAGE_TYPE.MESSAGE,
            attachments: values?.attachments?.map((attachment) => {
                return {
                    TYPE: attachment.type,
                    uri: attachment.url,
                    SIZE: attachment.size,
                } as ATTACHMENT
            }) ?? [],

        })

        if (!resp) return;

        const { message } = resp

        const INITIAL = deserializeMessage(message)
        INITIAL.timestamp = Date.now()

        queryClient.setQueryData<{ pages: Array<Array<MESSAGE>>, pageParams: Array<number> }>([`conversation-${conversation?.header.conversation_id}`], (data) => {

            return {
                pages: data?.pages?.map((page, i) => {
                    if(!i && !data?.pages) return [INITIAL]
                    if (i !== (data?.pages?.length - 1)) return page

                    return [INITIAL, ...page]
                }) ?? [],
                pageParams: data?.pageParams ?? []
            }
        })

        form.reset({ content: '', attachments: [] })
        Keyboard.dismiss()
        inputRef.current?.blur()
        await notifications.updateLastRead('dms')

        setSending(false)
    }

    const handleFormError = async (errors: any) => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        console.log(errors)
    }

    const handleAddAttachment = async () => {
        await Haptics.selectionAsync()

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            selectionLimit: 4,
            allowsMultipleSelection: true,
            videoMaxDuration: 60,
            quality: 1
        })

        if (!result.canceled) {
            const chosen = result.assets ?? []

            const existingMedia = form.getValues("attachments") ?? []

            if (chosen.length > 0) {
                setUploading(true)

                try {
                    const localAssets = chosen.map((asset) => {
                        return {
                            type: asset.type ?? 'image',
                            url: asset.uri,
                            unencrypted: asset.uri,
                            size: asset.fileSize ?? 1
                        }
                    })

                    form.setValue('attachments', [...existingMedia, ...localAssets])

                    const assets = await Promise.all(
                        chosen.map(async (asset) => {
                            // 1st encrypt file
                            const encrypted_version = await conversation?.encryptFile(asset.uri)
                            if (!encrypted_version) throw new Error("encrypted file not found")

                            // 2nd upload encrypted file
                            const upload = await uploadManager.uploadFile(encrypted_version, {
                                type: asset.type,
                                name: `${Utils.cleanFileName(asset.fileName ?? '')}.encrypted` ?? "direct-message-image",
                                size: asset.fileSize ?? 0,
                            });

                            return {
                                type: asset.type ?? 'image',
                                url: upload,
                                unencrypted: asset.uri,
                                size: asset.fileSize ?? 0,
                            }
                        })
                    )

                    let attachments = form.getValues('attachments') ?? []

                    for (const asset of assets) {
                        const target = attachments.findIndex(a => a.unencrypted == asset.unencrypted)
                        if (target > -1) {
                            attachments[target] = asset
                        }
                    }

                    form.setValue('attachments', attachments)
                }
                catch (e) {
                    console.log("Something went wrong ::", e)
                }
                finally {
                    setUploading(false)
                }
            }
        }
    }

    const content = form.watch('content') ?? ""
    const attachments = form.watch('attachments') ?? []
    const hasAttachments = attachments?.length > 0
    const IS_DISABLED = (content?.length ?? 0) == 0 && !hasAttachments

    return (
        <YStack w={"100%"} pos={'relative'} >
            {hasAttachments && <YStack borderWidth={1} borderColor={'$border'} height={200} w={"100%"} bg={'$background'} borderTopLeftRadius={10} borderTopRightRadius={10}
                pos={'absolute'} top={-200} left={0}>
                <MediaViewer
                    layout={'horizontal'}
                    data={attachments.map(a => ({
                        type: a.type,
                        url: a.unencrypted!
                    }))}
                    onRemove={(id) => {
                        const index = parseInt(id)
                        if (attachments?.[index]) {
                            const newMedia = attachments.filter((_, i) => i !== index)
                            form.setValue('attachments', newMedia)
                        }
                    }}
                />
            </YStack>}
            <XStack justifyContent={'space-between'} pb={10} w={"100%"} px={10} columnGap={5} zIndex={80} >
                <XStack >
                    <TouchableOpacity
                        disabled={uploading || attachments?.length >= 4 || sending}
                        onPress={handleAddAttachment}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.border?.val,
                            borderRadius: 15,
                            padding: 5,
                            height: 30,
                            width: 30,
                            marginTop: 5,
                            opacity: ((attachments?.length ?? 0) >= 4 || sending) ? 0.5 : 1
                        }}
                    >
                        {uploading ? <Spinner /> : <ImageIcon size={18} />}
                    </TouchableOpacity>
                </XStack>

                <XStack pos={'relative'} flex={1} px={5} borderWidth={focused ? 1 : 0} borderColor={focused ? '$primary' : undefined} w={"100%"} justifyContent={'space-between'} backgroundColor={'$portalBackground'} borderRadius={30} >

                    <Controller control={form.control} render={({ field }) => {

                        return (
                            <TextInput
                                ref={field.ref}
                                value={field.value}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                onChangeText={field.onChange}
                                placeholder="Say hey!"
                                cursorColor={theme.primary.val}
                                style={{
                                    padding: 10,
                                    width: '100%',
                                    color: 'white'
                                }}
                                multiline
                                placeholderTextColor={theme.sideText.val}
                            />
                        )
                    }} name={'content'} />
                </XStack>
                <TouchableOpacity
                    disabled={IS_DISABLED || uploading || sending}
                    onPress={form.handleSubmit(handleSendMessage, handleFormError)}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: (uploading || sending) ? theme.lightButton.val : theme.primary.val,
                        borderRadius: 15,
                        padding: 5,
                        height: 30,
                        width: 30,
                        marginTop: 5
                    }}
                >
                    {sending ? <Spinner /> : <ArrowUp size={18} />}
                </TouchableOpacity>
            </XStack>
            <Animated.View style={keyboardFollower} />
        </YStack>
    )
}