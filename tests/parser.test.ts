import { assert, expect } from "chai";
import { it } from "mocha";
import { SyntaxKind, ExpressionKind, IToken } from "../src/Compiler/types";
import { lex } from "./../src/Compiler/lexer";
import { parser } from "./../src/Compiler/parser";



describe('parser', function () {

    it('parse code', function () {
        let code = "let foo = 2;";
        let tokens = lex(code);
        let ast = parser(tokens);
        // console.log(ast);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse code 2', function () {
        let code = "let foo = 2 + 3;";
        let tokens = lex(code);
        let ast = parser(tokens);
        console.log(ast);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

});