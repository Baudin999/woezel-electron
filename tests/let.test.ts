import { assert } from "chai";
import { describe, it } from "mocha";
import { compile } from "./../src/Compiler/compiler";

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
        let { ast, errors, javascript } = compile(code);
        let result = Function(javascript)();
        assert.equal(result, "abcdefghij");
    });
});