import { assert, expect } from "chai";
import { it } from "mocha";
import { SyntaxKind, ExpressionKind, IIdentifierExpression, IToken, IFunctionApplicationExpression } from "../../src/Compiler/types";
import type { IVariableExpression } from "../../src/Compiler/types";
import { lex } from "../../src/Compiler/lexer";
import { parser } from "../../src/Compiler/parser";
import { logTokens } from "../helpers";



describe('parser - Let', function () {

    it('parse let 1', function () {
        let code = "let foo = 2;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // assertions
        assert.equal(errors.length, 0);
        assert.isNotNull(ast);
        assert.isNotNull(ast[0]);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
        let varDeclaration = <IVariableExpression>ast[0];
        assert.equal((<IIdentifierExpression>varDeclaration.name).root.value, "foo");
        assert.equal((<IIdentifierExpression>varDeclaration.name).root.kind, SyntaxKind.IdentifierToken);
        assert.equal(varDeclaration.expression.kind, ExpressionKind.NumberLiteralExpression);

    });

    it('parse let 2', function () {
        let code = "let foo = 2 + 3;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(JSON.stringify(ast, null, 4));
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse let 3', function () {
        let code = "let foo = 2 + 3 + 4 + 5 + 6;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse let 4', function () {
        let code = "let foo = (2 + 3) - 4;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse let 5', function () {
        let code = `
let foo = 
    (2 + 3) 
            - 4;
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse let 6', function () {
        let code = `
let foo = (2 
    + 3) 
                    - 4;
let bar = 2;
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
    });

    it('parse code 7', function () {
        let code = `
let foo = (2 
    + 3) 
                    - 4;
let bar 
= 2;
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        // console.log(JSON.stringify(ast, null, 4));
        assert.equal(ast[0].kind, ExpressionKind.VariableDeclaration);
        assert.equal(errors.length, 1);
    });

    it('parse function declaration', function () {
        let code = "let add x y = 2;";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // assertions
        assert.equal(errors.length, 0);
        assert.isNotNull(ast);
        assert.isNotNull(ast[0]);
        assert.equal(ast[0].kind, ExpressionKind.FunctionDefinitionExpression);
        let varDeclaration = <IVariableExpression>ast[0];

    });

    it('parse binary operation 2', function () {
        let code = 'let name = "Vincent" |> concat " other";';
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // assertions


    });


    it('multiple parameter application', function () {
        let code = 'let name = concat "a" "b" "c" "d";';
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        var varDec = ast[0] as IVariableExpression;
        var func = varDec.expression as IFunctionApplicationExpression;
        assert.equal(func.parameters.length, 4);

        // assertions
    });

    it('multiple nested function applications', function () {
        let code = `
let name = 
    concat 
        "a" 
        (concat "b" (concat"c" "d"))
    ;`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // 
        let _tokens1 = tokens.map(t => ({ ...t, kind: SyntaxKind[t.kind] }))

        var varDec = ast[0] as IVariableExpression;
        var func = varDec.expression as IFunctionApplicationExpression;

        assert.equal(func.parameters.length, 2);
        assert.equal((func.parameters[1] as any).expression.parameters.length, 2);
        assert.equal(((func.parameters[1] as any).expression.parameters[1] as any).expression.parameters.length, 2);

        // assertions
    });

    it('multi line definitions', function () {
        let code = `
name = concat
    "Foo"
    "Bar"
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

    });
});