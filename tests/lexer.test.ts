import { expect } from "chai";
import { it } from "mocha";
import { lex } from "./../src/Compiler/lexer";

describe('lexer', function () {
    it('lex code', function () {
        let code = "let foo = 2;"
        let tokens = lex(code);

        //console.log(tokens.map(t => t.toString()));
        tokens.forEach(t => {
            console.log(t.asdasd());
        })
        // console.log(tokens)
    });
});