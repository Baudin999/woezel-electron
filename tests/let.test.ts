import { assert } from "chai";
import { describe, it } from "mocha";
import { compile, CompilerContext } from "./../src/Compiler/compiler";

let testOptions = {
    format: false,
    context: CompilerContext.Node
};

describe('parser - Let', function () {

    it('parse let 1', function () {
        let code = `
extra = "ghij"
bar () => 
    concat "ab" other another extra
    where
        other = "c"
        another = "def"

main () =>
    bar ()
`;
        let { ast, errors, javascript } = compile(code, testOptions);
        let result = Function(javascript)();
        assert.equal(result, "abcdefghij");
    });
});