import { lex } from "./lexer"
import { parser } from "./parser";
import { transpile } from "./Transpiler/js";
import { check } from "./typeChecker";
import prettier from "prettier";
import babel from "@babel/parser";
import { ErrorSink } from "./errorSink";
import { SourceCode } from "./sourceCode";


export enum CompilerContext {
    Browser,
    Node
};

export interface ICompilerOptions {
    format: boolean;
    context: CompilerContext;
}

const defaultOptions: ICompilerOptions = {
    format: false,
    context: CompilerContext.Browser
};

export const compile = (code, options: ICompilerOptions = defaultOptions) => {
    const sourceCode = new SourceCode(code);
    const errorSink = new ErrorSink();
    const tokens = lex(sourceCode, errorSink);
    const { ast, errors } = parser(tokens, errorSink);
    const typeErrors = check(ast, errorSink);
    let javascript;
    if (options.format) {
        try {
            let text = transpile(ast, options);
            javascript = prettier.format(text, { parser: babel.parse });
        } catch (error) {
            console.log("Prettier Error: ", error);
        }
    } else {
        javascript = transpile(ast, options);
    }

    return { javascript, errors: [...errors, ...typeErrors], ast, tokens };
}