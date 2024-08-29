import { View, Text, Platform } from "react-native";
import React from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import {useTheme, YStack} from "tamagui";
import PublicationEditor from "../components/ui/editor/publication-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import Editor from "../screens/editor";
import {TPUBLICATION} from "../schema";

const EditorScreen = () => {
    const params = useGlobalSearchParams<{
        type?: `${number}`,
        publicationId?: `${number}`,
        post?: string,
        ref?: string
    }>()

    let PUBLICATION_TYPE = params?.type ? parseInt(params.type) : 1
    PUBLICATION_TYPE = Number.isNaN(PUBLICATION_TYPE) ? 1 : PUBLICATION_TYPE
    let PUBLICATION_ID = params?.publicationId ? parseInt(params.publicationId) : undefined
    PUBLICATION_ID = Number.isNaN(PUBLICATION_ID) ? undefined : PUBLICATION_ID

    const theme = useTheme()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: theme.background.val
            }}
            edges={Platform.select({
                ios: ['top', 'left', 'right'],
                android: undefined
            })}
        >
            <Editor
                publicationType={PUBLICATION_TYPE}
                publicationId={PUBLICATION_ID}
                encodedPost={params?.post}
                parentPublicationRef={params?.ref}
            />
        </SafeAreaView>
    );
};

export default EditorScreen;
