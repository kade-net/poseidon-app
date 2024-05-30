import { Data } from "effect";


export class TransactionBuildError extends Data.TaggedError("TransactionBuildError")<{
    originalError: any
}> { }

export class TransactionSimulationError extends Data.TaggedError("TransactionSimulationError")<{
    originalError: any
}> { }