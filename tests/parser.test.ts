import { assert, expect } from "chai";
import { it } from "mocha";
import { SyntaxKind, ExpressionKind, IToken } from "../src/Compiler/types";
import { lex } from "./../src/Compiler/lexer";
import { parser } from "./../src/Compiler/parser";



describe('parser', function () {

    it('parse code', function () {
        let code = "let foo = 2;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(ast);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse code 2', function () {
        let code = "let foo = 2 + 3;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(JSON.stringify(ast, null, 4));
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse code 3', function () {
        let code = "let foo = 2 + 3 + 4 + 5 + 6;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(JSON.stringify(ast, null, 4));
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse code 4', function () {
        let code = "let foo = (2 + 3) - 4;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(JSON.stringify(ast, null, 4));
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

});