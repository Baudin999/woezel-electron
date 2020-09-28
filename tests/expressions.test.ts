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

describe('expressions', function () {

    it('literal - string literal', function () {
        let code = `
"Peter Pan"
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.StringLiteralExpression);
        assert.equal(((ast[0] as IUnaryExpression).expression as any).value, "\"Peter Pan\"");

    });

    it('literal - number literal', function () {
        let code = `
2
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.NumberLiteralExpression);
        assert.equal(((ast[0] as IUnaryExpression).expression as any).value, "2");

    });

    it('literal - boolean literal (true)', function () {
        let code = `
true
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.BooleanLiteralExpression);
        assert.equal(((ast[0] as IUnaryExpression).expression as any).value, "true");

    });

    it('literal - boolean literal (false)', function () {
        let code = `
false
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.BooleanLiteralExpression);
        assert.equal(((ast[0] as IUnaryExpression).expression as any).value, "false");
    });

    it('literal - list literal', function () {
        let code = `
[1,2,3,4,5]
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.ListLiteralExpression);
    });

    it('assignment - empty list', function () {
        let code = `
number = []
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.AssignmentExpression);

        let assignment = ast[0] as IAssignmentExpression;
        assert.equal(assignment.body.kind, ExpressionKind.ListLiteralExpression);
    });

    it('assignment - int list', function () {
        let code = `
number = [1, 2, 3]
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.AssignmentExpression);

        let assignment = ast[0] as IAssignmentExpression;
        assert.equal(assignment.body.kind, ExpressionKind.ListLiteralExpression);
        assert.equal((assignment.body as IListLiteralExpression).items.length, 3);
    });

    it('assignment - parameterized function', function () {
        let code = `
add x y => x + y;
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.FunctionDefinitionExpression);

        let func = ast[0] as IFunctionDeclarationExpression;
        assert.equal(func.parameters.length, 2);
        assert.equal(func.parameters[0].kind, ExpressionKind.IdentifierExpression);
        assert.equal(func.parameters[1].kind, ExpressionKind.IdentifierExpression);
    });

    it('assignment - parameterized function (multiline)', function () {
        let code = `
add
    x y 
        => x 
        + y;
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.FunctionDefinitionExpression);

        let func = ast[0] as IFunctionDeclarationExpression;
        assert.equal(func.parameters.length, 2);
        assert.equal(func.parameters[0].kind, ExpressionKind.IdentifierExpression);
        assert.equal(func.parameters[1].kind, ExpressionKind.IdentifierExpression);
    });

    it('assignment - empty function', function () {
        let code = `
add () => x + y;
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 1);
        assert.equal(ast[0].kind, ExpressionKind.FunctionDefinitionExpression);

        let func = ast[0] as IFunctionDeclarationExpression;
        assert.equal(func.parameters.length, 1);
        assert.equal(func.parameters[0].kind, ExpressionKind.NoParams);
    });

    it('definition - string', function () {
        let code = `
name :: string;
name = "Peter Pan"
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 0);
        assert.equal(ast.length, 2);
        assert.equal(ast[0].kind, ExpressionKind.VariableDefinition);

        let assignment = ast[1] as IAssignmentExpression;

    });

    it('definition - string (error)', function () {
        let code = `
name :: string;
name = 24
`;
        let { ast, errors, tokens } = compile(code, testOptions);
        assert.equal(errors.length, 1);
        assert.equal(errors[0].type, ErrorType.TypeError);

    });
});