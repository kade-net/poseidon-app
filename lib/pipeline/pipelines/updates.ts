import { Data, Effect } from "effect";
import { ExecutableStep, Pipeline } from "..";
import * as Updates from 'expo-updates'
import * as Haptics from 'expo-haptics'
import posti from "../../posti";

class UpdateFetchError extends Data.TaggedError('UpdateFetchError')<{ initialError: any }> { }


const checkAndInstallUpdates: Array<ExecutableStep<any>> = [
    {
        name: 'Check if there are updates',
        execute(delegate, prevResult) {
            return Effect.tryPromise({
                try: async () => {
                    const update = await Updates.checkForUpdateAsync()
                    return {
                        prevResult: update,
                        context: null
                    }
                },
                catch(error) {
                    return new UpdateFetchError({ initialError: error })
                },
            })
        },
    },
    {
        name: 'Fetch and install the new updates',
        execute(delegate, { prevResult: _prevResult }) {
            const prevResult = _prevResult as Updates.UpdateCheckResult
            return Effect.tryPromise({
                try: async () => {
                    if (prevResult.isAvailable) {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                        await Updates.fetchUpdateAsync()
                        await Updates.reloadAsync()
                    }
                    return {
                        prevResult: null,
                        context: null
                    }
                },
                catch(error) {
                    posti.capture('update failed', {
                        prevResult: prevResult,
                        user: delegate.owner
                    })
                    return new UpdateFetchError({ initialError: error })
                },
            })
        },
    }
]


export const updateInstallPipeline = new Pipeline(checkAndInstallUpdates)
