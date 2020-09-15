import { fix_and_outro_and_destroy_block } from "svelte/internal";
import { ExpressionKind, IToken, SyntaxKind, operators } from "./types";



export const parser = (tokenList: IToken[]) => {

    // skipping the whitespaces
    let tokens = tokenList.filter(t => t.kind != SyntaxKind.Whitespace);

    let index = 0;
    let max = tokens.length;
    let _current = (n = 0) => tokens[index + n] || { value: "", line: -1, lineStart: -1, lineEnd: -1, fileStart: -1, fileEnd: -1, kind: SyntaxKind.Unknown };
    let _is = (kind: SyntaxKind) => _current().kind == kind;
    let _isOperator = () => {
        _parseContextNewline();
        return operators.indexOf(_current().kind) > -1;
    }
    let context = 0;
    let ast = [];
    let errors: Error[] = [];

    let _take = (kind?: SyntaxKind) => {
        _parseContextNewline();
        var result = _current();
        if (kind && result.kind !== kind) throw new Error(`
Expected ${SyntaxKind[kind]} on line ${result.line} column ${result.lineStart} but received ${SyntaxKind[result.kind]}.`);
        index++;
        return result;
    }

    while (index < max) {
        if (_current().kind == SyntaxKind.LetKeywordToken) {
            try {
                context++;
                ast.push(VariableDeclaration());
                context--;
            } catch (error) {
                errors.push(error);
                // because we do not want to really stop paring we'll just negate this block and
                // continue when we know we're right.
                while (_current().kind != SyntaxKind.SemicolonToken && index < max) index++;
                _take();
            }
        }
        else if (_current().kind == SyntaxKind.NewLine) {
            index++;
        }
        else {
            throw new Error(`Invalid parser for value: '${_current().value}'`);
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
        _parseContextNewline();
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

    function _parseContextNewline() {
        if (_current().kind == SyntaxKind.NewLine) {
            index++;
            for (let i = 0; i < context; ++i) {
                if (_current().kind == SyntaxKind.IndentToken) {
                    index++;
                    while (_current().kind == SyntaxKind.IndentToken) index++;
                }
                else {
                    throw new Error(`Invalid indentation: line ${_current().line} column ${_current().lineStart}`);
                }
            }
        }
    }

    function _parseExpressionBuilder() {
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
            _take(SyntaxKind.OpenParenToken);
            var expression = _parseExpression();
            if (!_is(SyntaxKind.CloseParenToken)) throw new Error("Params should be closed");
            else {
                _take(SyntaxKind.CloseParenToken);
            }

            return {
                kind: ExpressionKind.ParenthesizedExpression,
                expression
            };
        }
        else {
            throw new Error(`Invalid Expression: '${SyntaxKind[_current().kind]}' '${_current().value}'`);
        }
    }

    return { ast, errors };
}