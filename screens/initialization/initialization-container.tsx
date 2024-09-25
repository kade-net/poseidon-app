import { memo, useEffect, useState } from "react";
import { YStack } from "tamagui";
import { updateInstallPipeline } from "../../lib/pipeline/pipelines/updates";
import delegateManager from "../../lib/delegate-manager";
import { initializeFGSAccountPipeline } from "../../lib/pipeline/pipelines/fgs-initialization";
import InitializationScreen from ".";



interface InitializationContainerProps {
    children: React.ReactNode;
}

export const InitializationContainer = memo(({ children }: InitializationContainerProps) => {


    const [runningPipeline, setRunningPipeline] = useState(false)

    useEffect(() => {
        const runPipelines = async () => {
            const DELEGATE_ADDRESS = delegateManager.account?.address().toString()
            console.log("DELEGATE ADDRESS", DELEGATE_ADDRESS)
            if (!DELEGATE_ADDRESS) return;
            setRunningPipeline(true)

            try {
                await updateInstallPipeline.process(delegateManager!)
                await initializeFGSAccountPipeline.process(delegateManager!)
            }
            catch (e) {
                console.log("Something went wrong when running pipelines, ", e)
            }
            finally {
                setRunningPipeline(false)
            }


        }

        runPipelines()
    }, [, delegateManager.owner])

    if (runningPipeline) return <InitializationScreen />

    return children
})