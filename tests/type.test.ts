
import { logTokens } from "./helpers";
import { assert, expect } from "chai";
import { it } from "mocha";
import { SyntaxKind, ExpressionKind, IToken } from "../src/Compiler/types";
import type { IVariableExpression } from "../src/Compiler/types";
import { lex } from "./../src/Compiler/lexer";
import { parser } from "./../src/Compiler/parser";



describe('type definitions', function () {

    it('parse type', function () {
        let code = "type Person";
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // assertions
        assert.equal(errors.length, 0);

    });


    it('parse type', function () {
        let code = `type Person =
    FirstName: String;
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // console.log(ast);

        // assertions
        assert.equal(errors.length, 0);

    });


    it('parse type', function () {
        let code = `
type Person extends Mammal Ape = 
    FirstName: Names.First
        & min 2
        & max 25
        & default "Vincent";
    LastName: String;
    Address: Address;
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // console.log(JSON.stringify(ast, null, 4));
        // console.log(errors)

        // assertions
        assert.equal(errors.length, 0);

    });


});