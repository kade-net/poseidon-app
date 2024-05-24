import { Data } from "effect";

export class GeneratePortalDefinitionError extends Data.TaggedError("GeneratePortalDefinitionError")<{
    initialError: any
}> {

}

export class PortalDeserializerError extends Data.TaggedError("PortalDeserializerError")<{
    initialError: any
}> {

}

export class UnableToFetchNewPortalError extends Data.TaggedError("UnableToFetchNewPortalError")<{
    initialError: any
}> {

}