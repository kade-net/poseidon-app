
export class NoOwner {
    readonly _tag = 'NoOwner'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class DeserializationError {
    readonly _tag = 'DeserializationError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }

}

export class AccountSignatureError {
    readonly _tag = 'AccountSignatureError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }

}

export class TransactionFetchError {
    readonly _tag = 'TransactionFetchError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class TransactionGenerationError {
    readonly _tag = 'TransactionGenerationError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class TransactionSubmissionError {
    readonly _tag = 'TransactionSubmissionError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }

}

export class TrasnactionError {
    readonly _tag = 'TransactionError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}


export class UnknownTransactionError {
    readonly _tag = 'UnknownTransactionError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class TransactionFailedError {
    readonly _tag = 'TransactionFailedError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}
export class UnknownError {
    readonly _tag = 'UnknownError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class EmptyError {
    readonly _tag = 'EmptyError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class FetchError {
    readonly _tag = 'FetchError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class DecryptionError {
    readonly _tag = 'DecryptionError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class EncryptionError {
    readonly _tag = 'EncryptionError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class NoPrivateKeyError {
    readonly _tag = 'NoPrivateKeyError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class NoPublicKeyError {
    readonly _tag = 'NoPublicKeyError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}

export class InboxNotFoundError {
    readonly _tag = 'InboxNotFoundError'
    initialError: any
    constructor(error?: any) {
        this.initialError = error
    }
}