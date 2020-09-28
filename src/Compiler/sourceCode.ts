


export class SourceCode {
    code: string;
    length: number;
    /**
     *
     */
    constructor(code: string) {
        this.code = code.replace("\r\n", "\n") + "\n";
        this.length = this.code.length;
    }
}