import { assert, expect } from "chai";
import { it } from "mocha";
import { SyntaxKind, ExpressionKind, IToken } from "../../src/Compiler/types";
import type { IVariableExpression } from "../../src/Compiler/types";
import { lex } from "../../src/Compiler/lexer";
import { parser } from "../../src/Compiler/parser";



describe('parser - Function Application', function () {

    it('simple', function () {
        let code = `
let foo = add 3 4;`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(ast[0])
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
        assert.equal(errors.length, 0);
    });

    it('hello world', () => {
        assert.isTrue(true);
    });

    it('event loop', () => {
        let code = `
let add x y = x + y;

let main args =
    print (add 2 3);
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(JSON.stringify(ast, null, 4));
        // console.log(errors);
    });


});