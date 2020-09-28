import { assert } from "chai";
import { describe, it } from "mocha";
import { ErrorType } from "../src/Compiler/errorSink";
import {
    CompilerContext,
    ExpressionKind,
    IAssignmentExpression,
    IUnaryExpression,
    IFunctionDeclarationExpression,
    IListLiteralExpression, Expression
} from "../src/Compiler/types";
import { compile } from "./../src/Compiler/compiler";

let testOptions = {
    format: false,
    context: CompilerContext.Node
};

describe('type errors', function () {

    it('function - parameter types', function () {
        let code = `
add :: string -> number -> number;
add x y => x + y;
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 1);
        assert.equal(ast.length, 2);

    });
});