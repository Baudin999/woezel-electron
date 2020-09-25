import { assert, expect } from "chai";
import { it } from "mocha";
import { parser } from "../../src/Compiler/parser";
import { logErrors } from "../helpers";
import { lex } from "./../../src/Compiler/lexer";
import { transpile } from "./../../src/Compiler/Transpiler/js";


describe('transpiler', function () {
    it('transpile 1', function () {
        let code = `
let name = "Vincent" |> concat "other ";
let main args =
    print name;
        `;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        if (errors.length > 0) console.log(JSON.stringify(errors, null, 4));
        let result = transpile(ast);
        var evalResult = Function(result);
        evalResult();
    });

    it('transpile 1', function () {
        let code = `
let name = concat "c" (concat "d" ("f" |> concat"e"));
let main () =
    print (concat name "gabc");
`;
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);
        if (errors.length > 0) logErrors(errors);
        assert.equal(ast.length, 2);

        let result = transpile(ast);
        var evalResult = Function(result);
        evalResult();
    });

});