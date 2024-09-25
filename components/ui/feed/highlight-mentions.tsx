import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TPUBLICATION } from '../../../schema'
import { Utils } from '../../../utils'
import { Link } from 'expo-router'
import {checkIsPortal} from "../../../lib/WHITELISTS";
import {truncate} from "lodash";
import * as Linking from "expo-linking";
import {Alert, Pressable, TouchableOpacity} from "react-native";
import * as browser from "expo-web-browser";

// split content string by mentions, links, hashtags, tags, currencies
const HIGHLIGHT_REGEX = /(@\w+)|(\b(?:https?|ftp):\/\/\S+\b)|(#\w+)|(^\/[a-zA-Z-]+|\s\/[a-zA-Z-]+)|(\$[a-zA-Z]+)|(\w+)/g;

const HASHTAG_REGEX = /#\w+/
const TAG_REGEX = /\/\w+/
const CURRENCY_REGEX = /\$\w+/

interface Props {
    content?: string
    tags?: string[]
    mentions?: Record<string, string>
}

const isLink = (text: string) => {
    return Utils.urlRegex.test(text)
}

interface MentionProps { username: string, mentions?: Record<string, string> }

function Mention(props: MentionProps) {
    const mentions = props.mentions
    const user_address = mentions?.[props.username?.replace("@", '')]

    if (!user_address) return <Text color={"$COAText"}>{props.username}</Text>

    return (
        <Link
            href={{
                pathname: '/profiles/[address]/',
                params: {
                    address: user_address
                }
            }}
            asChild
        >
            <Text color={"$COAText"}>{props.username}</Text>
        </Link>
    )

}

export const MemoedMention = memo(Mention)

const HighlightMentions = (props: Props) => {
    const { content = '', tags = [], mentions } = props
    const parts = content?.split(HIGHLIGHT_REGEX) ?? [] // Split by mentions and links

    const handleOpenLink = (link: string) => {
        const _link = link.trim()
        Linking.canOpenURL(_link).then(async (supported) => {
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

    return parts.map((part, index) => {
        if (Utils.mentionRegex.test(part) && mentions?.[(part.replace('@', ''))]) {
            return <MemoedMention
                key={index}
                username={part}
                mentions={mentions}
            />
        } else if (Utils.urlRegex.test(part)) {
            if(checkIsPortal(part)) return null;
            return (
                <Text key={index} onPress={()=>handleOpenLink(part)} color={'$COAText'}>
                    {truncate(part, {length: 30, omission: '...'})}
                </Text>
            )
        } else if (HASHTAG_REGEX.test(part)) {
            return <Text   color={'$COAText'} key={index}>{part}</Text>
        } else if (TAG_REGEX.test(part)) {
            return <Text  color={'$COAText'} key={index}>{part}</Text>
        } else if (CURRENCY_REGEX.test(part)) {
            return <Text  color={'$COAText'} key={index}>{part}</Text>
        }
        return <Text  key={index}>{part}</Text>
    })
}

export default memo(HighlightMentions)