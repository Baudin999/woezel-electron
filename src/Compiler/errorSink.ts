export enum ErrorType {
    SyntaxError,
    TypeError
}
export interface IPosition {
    startColumn: number;
    endColumn: number;
    startLine: number;
    endLine: number;
}
export interface IError {
    type: ErrorType;
    message: string;
    position: IPosition;
}

export class SyntaxError implements IError {
    type: ErrorType;
    message: string;
    position: IPosition;
    /**
     *
     */
    constructor(message, position) {
        this.type = ErrorType.SyntaxError;
        this.message = message;
        this.position = position;
    }
}

export class TypeError implements IError {
    type: ErrorType;
    message: string;
    position: IPosition;

    constructor(message, position) {
        this.type = ErrorType.TypeError;
        this.message = message;
        this.position = position;
    }
}

export class ErrorSink extends Array {

    addError(error: IError) {
        this.push(error);
    }
}