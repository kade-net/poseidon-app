import { WebView } from 'react-native-webview'
import {useQuery} from "@apollo/client";
import {GET_MY_PROFILE} from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import client from "../../data/apollo";
import Loading from "../../components/ui/feedback/loading";
import {useMemo} from "react";
import {MyProfileQuery} from "../../__generated__/graphql";
import {TPUBLICATION} from "../../schema";
import {useRouter} from "expo-router";
interface ComposableEvents {
    onClose: ()=> void;
    onApprovalRequest: (
        args: {
            function: string;
            args: any[];
        }
    )=> void
    onCreatePortal: (args: {
        portalUrl: string
    }) => void
}



interface  Props {
    target_url: string
    post: TPUBLICATION | null
}


export default function ComposableWebView(props: Props) {
    const { target_url, post } = props
    const router = useRouter()
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })

    if(profileQuery?.loading) return <Loading flex={1} h={"100%"} w={"100%"} />

    const KADE_INIT_SCRIPT = `
                window.kade = {
                    profile: ${JSON.stringify(profileQuery?.data?.account ?? null)},
                    app:"poseidon",
                    post: ${JSON.stringify((post))},
                    onApprovalRequest: (args)=>{
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'approval_request',
                            args
                        }))
                    },
                    onPost: (args)=>{
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'post',
                            args
                        }))
                    },
                    onClose: ()=>{
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'close_portal',
                        }))
                    }
                }
    `

    return (
        <WebView
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
            }}

            source={{
                uri: target_url
            }}
            injectedJavaScriptBeforeContentLoaded={KADE_INIT_SCRIPT}
            domStorageEnabled
            onMessage={(event)=>{
                const data = event.nativeEvent.data
                if(!data){
                    return
                }
                try {
                    const parsedData = JSON.parse(data)
                    switch (parsedData.type) {
                        case "approval_request":{
                            break;
                        }
                        case "post":{
                            const postData = (parsedData.args.post as TPUBLICATION) ?? null
                            router.back()
                            router.setParams({
                                  type: 1,
                                  post: Buffer.from(JSON.stringify(postData)).toString('base64')
                                }
                            )
                            break;
                        }
                        case "close_portal":{
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
                catch (e)
                {
                    console.log("Error: ", e)
                }

                console.log("incoming message:: ",data)
            }}
        />
    )
}