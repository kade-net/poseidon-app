import { DelegateManager } from "../delegate-manager";
import { Effect, Either } from "effect";


interface ExecutableResult<T> {
    context: T
    prevResult: Record<string, any> | null
}

export interface ExecutableStep<C> {
    name: string
    execute: (delegate: DelegateManager, prevResult: ExecutableResult<C>) => Effect.Effect<ExecutableResult<C>, any>
    path?: string
}

export class Pipeline {
    steps: Array<ExecutableStep<any>> = []

    constructor(steps: Array<ExecutableStep<any>> = []) {
        this.steps = steps
    }

    async process(delegate: DelegateManager, path?: string) {
        const chosenExecutableSteps = this.steps.filter((step) => {
            if (path) {
                return step.path === path
            }
            return true
        })
        const pipeline = chosenExecutableSteps.reduce((prevEffect, currentEffect, currentIndex) => {
            return prevEffect.pipe(
                Effect.flatMap((prevResult) => currentEffect.execute(delegate, prevResult)),
                Effect.tap((result) => {
                    console.log(`Step ${currentIndex}:: ${currentEffect.name} completed with result::`)
                })
            )
        }, Effect.tryPromise<ExecutableResult<any>, any>({
            async try() {
                return {
                    context: {},
                    prevResult: null
                }
            },
            catch(error) {
                return null
            }
        }))

        const eitherResult = await Effect.runPromise(Effect.either(pipeline))

        Either.match(eitherResult, {
            onLeft(l) {
                console.log("SOMETHING WENT WRONG DURING PIPELINE EXECUTION::", l)
            },
            onRight(r) {
                // console.log("COMPLETED SUCCESSFULLY::", r)
            }
        })

    }

}