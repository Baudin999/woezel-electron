


export class SourceCode {
    code: string;
    length: number;
    private _lines: string[];
    /**
     *
     */
    constructor(code: string) {
        this.code = code.replace("\r\n", "\n") + "\n";
        this.length = this.code.length;
    }

    lines() {
        if (!this._lines) {
            // we'll split on newline
            // but...in order to verify the results we'll
            // need to append the newline.
            this._lines = this.code.split("\n").map(line => line + "\n");
        }
        return this._lines;
    }
}