import {Stack, useGlobalSearchParams} from "expo-router";
import {useQuery} from "@apollo/client";
import {GET_PUBLICATION} from "../../../../../utils/queries";
import Loading from "../../../../../components/ui/feedback/loading";
import PostDetail from "../../../../../screens/tabs/feed/post-detail";

export default function PublicationDetails(){
    const params = useGlobalSearchParams<{
        'ref': string
    }>()

    const publicationQuery = useQuery(GET_PUBLICATION, {
        variables: {
            postRef: params.ref
        }
    })

    if(publicationQuery.loading) return <Loading flex={1} w={"100%"} h={"100%"} />

    if(!publicationQuery.data) return null

    return <PostDetail
        data={publicationQuery.data}
    />
}