import { assert, expect } from "chai";
import { it } from "mocha";
import { parser } from "../../src/Compiler/parser";
import { lex } from "./../../src/Compiler/lexer";
import { transpile } from "./../../src/Compiler/Transpiler/js";


describe('transpiler', function () {
    it('transpile 1', function () {
        let code = `
let name = "Vincent" |> concat "other ";
let main args =
    print name "Hello";
`
        let tokens = lex(code);
        let { ast, errors } = parser(tokens);

        // console.log(JSON.stringify(ast[1], null, 4));

        let result = transpile(ast);

        if (errors.length > 0) console.log(JSON.stringify(errors, null, 4));

        console.log(result);

        var evalResult = Function(result);
        evalResult();
    });

});