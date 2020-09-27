import { assert, expect } from "chai";
import { it } from "mocha";
import { parser } from "../../src/Compiler/parser";
import type { IToken, IAssignmentExpression } from "../../src/Compiler/types";
import { Types } from "../../src/Compiler/types";
import { lex } from "./../../src/Compiler/lexer";
import { check } from "./../../src/Compiler/typeChecker";


describe('type checker', function () {
    it('duplicate definition', function () {
        let code = `
foo :: string;
foo :: number;
    `;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 1);
    });

    it('infer the type of a number', function () {
        let code = `
foo = 40;
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 0);
        assert.equal((ast[0] as IAssignmentExpression).type, Types.Number);
    });
    it('infer the type of a string', function () {
        let code = `
foo = "Bar";
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 0);
        assert.equal((ast[0] as IAssignmentExpression).type, Types.String);
    });

    it('Correct type definition - string', function () {
        let code = `
foo :: string;
foo = "Bar";
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 0);
    });

    it('Correct type definition - number', function () {
        let code = `
foo :: number;
foo = 2.3e10;
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 0);
    });

    it('Correct type definition - boolean', function () {
        let code = `
foo :: boolean;
foo = true;
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 0);
    });

    it('Conflicting type definitions', function () {
        let code = `
foo :: number;
foo = "Bar";
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        let typeErrors = check(ast);

        assert.equal(typeErrors.length, 1);
    });
});