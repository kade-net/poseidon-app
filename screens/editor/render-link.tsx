import React, {memo, useDeferredValue, useMemo} from "react";
import {Utils} from "../../utils";
import {YStack} from "tamagui";
import {checkIsPortal} from "../../lib/WHITELISTS";
import PortalRenderer from "../../components/ui/portal-ui";


function RenderLinks(props: {content: string}) {
    const defferedContent = useDeferredValue(props.content)
    const portals = useMemo(()=>{
        if(defferedContent && defferedContent?.trim().length > 0){
            return defferedContent.split(Utils.HIGHLIGHT_REGEX).filter(v => Utils.urlRegex.test(v)).filter((v)=>checkIsPortal(v))
        }else {
            return []
        }
    }, [defferedContent])


    return (
        <YStack w={"100%"} alignItems={'center'} >
            {
                portals.map((link, i)=>{
                    return (
                        <PortalRenderer key={i} url={link} kid={0} post_ref={"draft:portal"} />
                    )
                })
            }
        </YStack>
    )
}

export default memo(RenderLinks)

