import React from "react";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import Editor from "../../../screens/editor";

const PublicationEditorScreen = () => {
    const params = useGlobalSearchParams<{
        type?: `${number}`,
        publicationId?: `${number}`,
        content?: string,
        community?: string,
        ref?: string
    }>()
    const router = useRouter()
    let PUBLICATION_TYPE = params?.type ? parseInt(params.type) : 1
    PUBLICATION_TYPE = Number.isNaN(PUBLICATION_TYPE) ? 1 : PUBLICATION_TYPE
    let PUBLICATION_ID = params?.publicationId ? parseInt(params.publicationId) : undefined
    PUBLICATION_ID = Number.isNaN(PUBLICATION_ID) ? undefined : PUBLICATION_ID
    let CONTENT = params?.content ?? ""
    let COMMUNITY = params?.community ?? ""
    return (

        <Editor
            publicationType={PUBLICATION_TYPE}
            publicationId={PUBLICATION_ID}
            content={CONTENT}
            community={COMMUNITY}
            parentPublicationRef={params?.ref}
        />
    );
};

export default PublicationEditorScreen;
