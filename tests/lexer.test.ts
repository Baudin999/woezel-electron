import { assert, expect } from "chai";
import { it } from "mocha";
import type { IToken } from "../src/Compiler/types";
import { SyntaxKind } from "../src/Compiler/types";
import { lex } from "./../src/Compiler/lexer";


let verifyTokens = (code, tokens: IToken[], show = false) => {
    tokens.forEach(p => {
        let val = p.value;
        let snippet = code.substring(p.fileStart, p.fileEnd);
        let equals = val === snippet;

        show && console.log(`(${val})=>(${snippet}) ${equals}`);
        assert.equal(val, snippet);
    });
}

let log = (tokens: IToken[]) => {
    //
    tokens.forEach(t => {
        console.log({ ...t, kind: SyntaxKind[t.kind] })
    });
}

describe('lexer', function () {
    it('lex code', function () {
        let code = "let foo = 2;"
        let tokens = lex(code);
        //console.log(tokens)
        verifyTokens(code, tokens);
    });

    it('lambda function', function () {
        let code = "let foo = a b => a + b;"
        let tokens = lex(code);
        // log(tokens)
        verifyTokens(code, tokens);
        assert.equal(tokens.length, 18);
    });

    it('lex type def', function () {
        let code = `let
foo = 2;
    `;
        let tokens = lex(code);
        //console.log(tokens);
        verifyTokens(code, tokens);
        assert.equal(tokens.length, 10);
    });

    it('newlineIndent', function () {
        let code = `
    `;
        let tokens = lex(code);
        //console.log(tokens);
        verifyTokens(code, tokens);
        assert.equal(tokens.length, 2);
    });

    it('string literal', function () {
        let code = `"Cyclops"`;
        let tokens = lex(code);
        verifyTokens(code, tokens);
        assert.equal(tokens[0].kind, SyntaxKind.StringLiteralToken);
    });

    it('number literal', function () {
        let code = `2.34e100`;
        let tokens = lex(code);
        // log(tokens);
        verifyTokens(code, tokens);
        assert.equal(tokens[0].kind, SyntaxKind.NumberLiteralToken);

    });

    it('number literal list', function () {
        let code = ' [2, 3, 4e10, 5.33, 12.2323e34]';
        let tokens = lex(code);
        // log(tokens)
        verifyTokens(code, tokens);
        assert.equal(tokens.length, 16);

        tokens.forEach((t, i) => {
            // little math trick to get all the numbers in the list...
            // modulo for the win!
            if (i > 0 && i % 3 == 2) {
                assert.equal(t.kind, SyntaxKind.NumberLiteralToken);
            }
        });
        assert.equal(tokens[3].kind, SyntaxKind.CommaToken);
    });

    it('single line comment', function () {
        let code = `
// This is a single line comment
"Carlos" // And more comment...        
`;
        let tokens = lex(code);
        //console.log(tokens);
        verifyTokens(code, tokens);
        assert.equal(tokens.length, 7);
        assert.equal(tokens[1].kind, SyntaxKind.SingleLineCommentToken);
    });

    it('multi line comment', function () {
        let code = `
/*
And we can write our comments
in peace and quite...
*/
"Carlos"
`;
        let tokens = lex(code);
        // log(tokens)
        verifyTokens(code, tokens);
        assert.equal(tokens.length, 5);
        assert.equal(tokens[1].kind, SyntaxKind.MultiLineCommentToken);
    });

    it('type defintion', function () {
        let code = `
@ My type definition
type Person =
    @ The first name
    @ of the person
    FirstName: String
        @ min length FirstName 2
        & min 2
        @ max length FirstName 25
        & max 25
        & default "Peter";
    `;
        let tokens = lex(code);
        verifyTokens(code, tokens);
    });

    it('template definition', function () {
        let code = `
<div name="root">
    <something />
</div>
`;
        let tokens = lex(code);
        verifyTokens(code, tokens);
    });
});