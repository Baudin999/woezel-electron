import { fix_and_outro_and_destroy_block } from "svelte/internal";
import { ExpressionKind, IToken, SyntaxKind, operators } from "./types";



export const parser = (tokenList: IToken[]) => {

    // skipping the whitespaces
    let tokens = tokenList.filter(t => t.kind != SyntaxKind.Whitespace);

    let index = 0;
    let max = tokens.length;
    let _current = () => tokens[index] || { value: "", kind: SyntaxKind.Unknown };
    let _is = (kind: SyntaxKind) => _current().kind == kind;
    let _isOperator = () => {
        return operators.indexOf(_current().kind) > -1;
    }
    let ast = [];
    let errors = [];

    let _take = (kind?: SyntaxKind) => {
        var result = _current();
        if (kind && result.kind !== kind) throw `Expected ${kind} but received ${result.kind}.`;
        index++;
        return result;
    }

    while (index < max) {
        //
        if (_current().kind == SyntaxKind.LetKeywordToken) {
            try {
                ast.push(VariableDeclaration());
            } catch (error) {
                errors.push(error);
            }
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
        let root = _take(SyntaxKind.IdentifierToken);
        let parts = [];
        while (_is(SyntaxKind.DotToken)) {
            _take();
            if (_is(SyntaxKind.IdentifierToken)) parts.push(_take());
            else throw "Indentifier fields are always identifiers themselves.";
        }
        return {
            kind: ExpressionKind.IdentifierExpression,
            root,
            parts
        }
    }

    function _parseExpression() {
        var left = _parseExpressionBuilder();

        if (_isOperator()) {
            var operator = _take();
            var right = _parseExpression();
            return {
                kind: ExpressionKind.BinaryExpression,
                left,
                operator,
                right
            };
        }
        else {
            return left;
        }
    }

    function _parseExpressionBuilder() {
        //
        if (_is(SyntaxKind.IdentifierToken)) return _parseIdenitifier();
        else if (_is(SyntaxKind.StringLiteralToken)) {
            return {
                kind: ExpressionKind.StringLiteralExpression,
                expression: _take(SyntaxKind.StringLiteralToken)
            };
        }
        else if (_is(SyntaxKind.NumberLiteralToken)) {
            return {
                kind: ExpressionKind.NumberLiteralExpression,
                expression: _take(SyntaxKind.NumberLiteralToken)
            };
        }

        // Example: (2 + 3)
        else if (_is(SyntaxKind.OpenParenToken)) {
            _take();
            var expression = _parseExpression();
            if (!_is(SyntaxKind.CloseParenToken)) throw "Params should be closed...";
            else _take();

            return {
                kind: ExpressionKind.ParenthesizedExpression,
                expression
            };
        }
        else throw "Invalid Expression";
    }

    return { ast, errors };
}