import { assert } from "chai";
import { describe, it } from "mocha";
import { CompilerContext } from "./../src/Compiler/types";
import { compile } from "./../src/Compiler/compiler";

let testOptions = {
    format: false,
    context: CompilerContext.Node
};

describe('examples', function () {

    it('example - 001', function () {
        let code = `
add x y => x + y;

extra :: string
extra = "ghij"

bar :: () -> string
bar () => 
    concat "ab" other another extra
    where
        other = "c"
        another = "def"

main () =>
    bar ();
`;
        let { javascript } = compile(code, testOptions);
        let result = Function(javascript)();
        assert.equal(result, "abcdefghij");
    });

    it('example - add two number', function () {
        let code = `
add x y => x + y;

main () =>
    add 2 3;
`;
        let { javascript } = compile(code, testOptions);
        let result = Function(javascript)();
        assert.equal(result, 5);
    });
});