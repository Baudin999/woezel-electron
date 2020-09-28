import { assert, expect } from "chai";
import { it } from "mocha";
import { SourceCode } from "../src/Compiler/sourceCode";
import type { IToken } from "../src/Compiler/types";
import { SyntaxKind } from "../src/Compiler/types";
import { lex } from "./../src/Compiler/lexer";


let verifyTokens = (sourceCode: SourceCode, tokens: IToken[], show = false) => {
    tokens.forEach(p => {
        let val = p.value;
        let snippet = sourceCode.code.substring(p.fileStart, p.fileEnd);
        let equals = val === snippet;

        let lineSnippet = sourceCode.lines()[p.line].substring(p.columnStart, p.columnEnd);
        let lineEqual = val == lineSnippet;

        show && console.log(`(${val})=>(${snippet}) ${equals}`);
        show && console.log(`(${val})=>(${lineSnippet}) ${lineEqual}`);
        assert.equal(val, snippet);
        assert.equal(val, lineSnippet);
    });
}



describe('lexer', function () {
    it('lex code', function () {
        let code = new SourceCode(`
foo = 2`);
        let tokens = lex(code);
        verifyTokens(code, tokens, false);
    });

    it('lex code', function () {
        let code = new SourceCode(`
    extra = "ghij"
    bar () => 
        concat "ab" other another extra
        where
            other = "c"
            another = "def"

    main () =>
        bar ()
    `);
        let tokens = lex(code);
        verifyTokens(code, tokens);
    });

});