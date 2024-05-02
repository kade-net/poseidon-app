import { DeserializationError, NoOwner, AccountSignatureError, EmptyError, TransactionFailedError, TransactionFetchError, TransactionGenerationError, TransactionSubmissionError, TrasnactionError, UnknownError, UnknownTransactionError } from "./errors"

export type FunctionResponse<T = any> = {
    data: T | null
    error: NoOwner | DeserializationError | AccountSignatureError | EmptyError | TransactionFailedError | TransactionFetchError | TransactionGenerationError | TransactionSubmissionError | TrasnactionError | UnknownError | UnknownTransactionError | null
    success: boolean
}