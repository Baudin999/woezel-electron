import { lex } from "./lexer"
import { parser } from "./parser";
import { transpile } from "./Transpiler/js";
import { check } from "./typeChecker";
import prettier from "prettier";
import babel from "@babel/parser";
import { ErrorSink } from "./errorSink";


export const compile = (code, format = false) => {
    const errorSink = new ErrorSink();
    const tokens = lex(code, errorSink);
    const { ast, errors } = parser(tokens, errorSink);
    const typeErrors = check(ast, errorSink);
    let javascript;
    if (format) {
        javascript = prettier.format(transpile(ast), { parser: babel.parse });
    } else {
        javascript = transpile(ast);
    }

    return { javascript, errors: [...errors, ...typeErrors], ast, tokens };
}