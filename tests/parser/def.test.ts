import { assert, expect } from "chai";
import { it } from "mocha";
import { SyntaxKind, ExpressionKind, IIdentifierExpression, IToken, IFunctionApplicationExpression } from "../../src/Compiler/types";
import type { IVariableExpression } from "../../src/Compiler/types";
import { lex } from "../../src/Compiler/lexer";
import { parser } from "../../src/Compiler/parser";
import { logTokens } from "../helpers";



describe('parser - Def', function () {

    it('parse def 1', function () {
        let code = "foo : string -> string -> string;";
        let tokens = lex(code);

        logTokens(tokens)

    });


});