
export interface IPosition {
    startColumn: number;
    endColumn: number;
    startLine: number;
    endLine: number;
}
export interface IError {
    message: string;
    position: IPosition;
}

export class SyntaxError implements IError {
    message: string;
    position: IPosition;
    /**
     *
     */
    constructor(message, position) {
        this.message = message;
        this.position = position;
    }
}

export class TypeError implements IError {
    message: string;
    position: IPosition;

    constructor(message, position) {
        this.message = message;
        this.position = position;
    }
}

export class ErrorSink {
    errors: IError[] = [];
    [Symbol.iterator]() { return this.errors.values() }

    addError(error: IError) {
        this.errors.push(error);
    }
}