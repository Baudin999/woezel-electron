import { fix_and_outro_and_destroy_block } from "svelte/internal";
import { ExpressionKind, IToken, SyntaxKind } from "./types";



export const parser = (tokenList: IToken[]) => {

    // skipping the whitespaces
    let tokens = tokenList.filter(t => t.kind != SyntaxKind.Whitespace);

    let index = 0;
    let max = tokens.length;
    let _current = () => tokens[index];
    let _is = (kind: SyntaxKind) => tokens[index].kind == kind;
    let result = [];

    let _take = (kind: SyntaxKind) => {
        var result = _current();
        if (result.kind !== kind) throw `Expected ${kind} but received ${result.kind}.`;
        index++;
        return result;
    }

    while (index < max) {
        //
        if (_current().kind == SyntaxKind.LetKeywordToken) {
            result.push(VariableDeclaration());
        } else {
            throw `Invalid parser '${_current().value}'`;
        }
    }

    function VariableDeclaration() {
        _take(SyntaxKind.LetKeywordToken);
        let name = _parseIdenitifier();
        _take(SyntaxKind.EqualsToken);
        let expression = _parseExpression();
        _take(SyntaxKind.SemicolonToken);

        return {
            kind: ExpressionKind.VariableDeclaration,
            name,
            expression,
        };
    }

    function _parseIdenitifier() {
        return _take(SyntaxKind.IdentifierToken);
    }

    function _parseExpression() {
        var left = _parseExpressionBuilder();
        if (_is(SyntaxKind.SemicolonToken)) {
            //
        }
        else {
            throw "Invalid Expression";
        }
        _take(SyntaxKind.SemicolonToken);

        return left;
    }

    function _parseExpressionBuilder() {
        //
        if (_is(SyntaxKind.IdentifierToken)) return _parseIdenitifier();
        else if (_is(SyntaxKind.StringLiteralToken)) return _take(SyntaxKind.StringLiteralToken);
        else if (_is(SyntaxKind.NumberLiteralToken)) return _take(SyntaxKind.NumberLiteralToken);
        else throw "Invalid Expression";
    }

    return result;
}