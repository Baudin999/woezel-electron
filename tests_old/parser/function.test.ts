import { compile } from "./../../src/Compiler/compiler";
import { assert } from "chai";


describe("functions", () => {
    it("should pass", () => {
        let code = `
main () = 
    foo = 12;
    foo;
`;
        var { ast, errors, tokens, javascript } = compile(code, false);
        assert.equal(errors.length, 0);

    });
});