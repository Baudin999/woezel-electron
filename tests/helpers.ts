import { IToken, SyntaxKind } from "../src/Compiler/types";

export const logTokens = (tokens: IToken[]) => {
    //
    tokens.forEach(t => {
        console.log({ ...t, kind: SyntaxKind[t.kind] })
    });
}

export const logErrors = (errors) => {
    errors.forEach(e => console.log(e.message));
}