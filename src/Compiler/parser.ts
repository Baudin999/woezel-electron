import { fix_and_outro_and_destroy_block } from "svelte/internal";
import type {
    IExpression,
    IVariableExpression,
    IBinaryExpression,
    IUnaryExpression,
    IIdentifierExpression,
    IFunctionApplicationExpression,
    ITypeDeclaration,
    IFieldDeclaration
} from "./types";
import { ExpressionKind, IToken, SyntaxKind, operators } from "./types";



export const parser = (tokenList: IToken[]) => {

    // skipping the whitespaces
    let tokens = tokenList.filter(t => t.kind != SyntaxKind.Whitespace);

    let index = 0;
    let max = tokens.length;
    let _current = (n = 0) => tokens[index + n] || { value: "", line: -1, lineStart: -1, lineEnd: -1, fileStart: -1, fileEnd: -1, kind: SyntaxKind.Unknown };
    let _next = () => {
        var i = 1;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        return _current(i);
    }
    let _is = (kind: SyntaxKind, minContext?: number) => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        if (minContext && i < minContext) {
            throw new Error(`Invalid indentation: line ${_current().line} column ${_current().lineStart} expected indentation.`);
        }
        return _current(i).kind == kind;
    }
    let _isLiteral = (minContext?: number) => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        if (minContext && i < minContext) {
            throw new Error(`Invalid indentation: line ${_current().line} column ${_current().lineStart} expected indentation.`);
        }
        var kind = _current().kind;
        return kind == SyntaxKind.StringLiteralToken
            || kind == SyntaxKind.NumberLiteralToken
            || kind == SyntaxKind.BooleanLiteralToken
            || kind == SyntaxKind.DateLiteralToken
            || kind == SyntaxKind.DateTimeLiteralToken
            || kind == SyntaxKind.TimeLiteralToken
    }
    let _isIdentifier = (minContext?: number) => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        if (minContext && i < minContext) {
            throw new Error(`Invalid indentation: line ${_current().line} column ${_current().lineStart} expected indentation.`);
        }
        return _current().kind == SyntaxKind.IdentifierToken;
    }
    let _isOperator = () => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        return operators.indexOf(_current(i).kind) > -1;
    }
    let context = 0;
    let ast: IExpression[] = [];
    let errors: Error[] = [];

    let _take = (kind?: SyntaxKind) => {
        _parseContextualNewline();
        var result = _current();
        if (kind && result.kind !== kind) throw new Error(`
Expected ${SyntaxKind[kind]} on line ${result.line} column ${result.lineStart} but received ${SyntaxKind[result.kind]}.`);
        index++;
        return result;
    }

    // Main parsing loop
    (() => {
        while (index < max) {
            if (_current().kind == SyntaxKind.LetKeywordToken) {
                ParseBlock(VariableDeclaration);
            }
            else if (_current().kind == SyntaxKind.TypeKeywordToken) {
                ParseBlock(TypeDeclaration);
            }
            else if (_current().kind == SyntaxKind.NewLine || _current().kind == SyntaxKind.IndentToken) {
                index++;
            }
            else {
                throw new Error(`Invalid parser for value: '${_current().value}'`);
            }
        }
    })();

    function ParseBlock(parser, endStatement: SyntaxKind = SyntaxKind.SemicolonToken) {
        try {
            context++;
            ast.push(parser());
        } catch (error) {
            errors.push(error);
            // because we do not want to really stop paring we'll just negate this block and
            // continue when we know we're right.
            while (_current().kind != SyntaxKind.SemicolonToken && index < max) index++;
            _take();
        }
        finally {
            context--;
        }
    }

    function TypeDeclaration(): ITypeDeclaration {
        _take(SyntaxKind.TypeKeywordToken);
        let name = _parseIdenitifier();
        let extensions: IIdentifierExpression[] = [];
        let fields: IFieldDeclaration[] = [];

        if (_current().kind == SyntaxKind.ExtendsKeywordToken) {
            _take(SyntaxKind.ExtendsKeywordToken);
            while (_current().kind == SyntaxKind.IdentifierToken) {
                extensions.push(_parseIdenitifier());
            }
        }

        if (_current().kind == SyntaxKind.EqualsToken) {
            _take(SyntaxKind.EqualsToken);
            while (_is(SyntaxKind.IdentifierToken)) {
                let fieldName = _parseIdenitifier().root;
                context++;
                _take(SyntaxKind.ColonToken);
                let fieldType = _parseIdenitifier();

                let restrictions: IExpression[] = [];
                while (_is(SyntaxKind.AmpersandToken)) {
                    try {
                        var t = _take(SyntaxKind.AmpersandToken);
                        let restrictionExpression = _parseExpression();
                        restrictions.push(restrictionExpression);
                    }
                    catch (ex) {

                        console.log(ex);
                    }
                }
                context--;
                _take(SyntaxKind.SemicolonToken);

                fields.push({
                    kind: ExpressionKind.FieldDeclaration,
                    name: fieldName,
                    type: fieldType,
                    restrictions
                });
            }
        }

        return {
            kind: ExpressionKind.TypeDeclaration,
            name: name.root,
            extensions,
            fields
        };
    }

    function VariableDeclaration(): IVariableExpression {
        _take(SyntaxKind.LetKeywordToken);
        let name = _parseExpression();
        _take(SyntaxKind.EqualsToken);
        let expression = _parseExpression();
        if (expression.kind == ExpressionKind.FunctionApplicationExpression) {
            expression.kind = ExpressionKind.FunctionDefinitionExpression;
        }
        _take(SyntaxKind.SemicolonToken);

        return {
            kind: ExpressionKind.VariableDeclaration,
            name,
            expression,
        };
    }

    function _parseIdenitifier(): IIdentifierExpression {
        let root = _take(SyntaxKind.IdentifierToken);
        let parts: IToken[] = [];
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

    function _parseExpression(): IExpression {
        let left = _parseExpressionBuilder();
        let parameters: IExpression[] = [];
        if (_isOperator()) {
            let operator = _take();
            let right = _parseExpression();
            return <IBinaryExpression>{
                kind: ExpressionKind.BinaryExpression,
                left,
                operator,
                right
            };
        }
        else if (_isIdentifier() || _isLiteral() || _current().kind == SyntaxKind.OpenParenToken) {
            while (_isIdentifier() || _isLiteral() || _current().kind == SyntaxKind.OpenParenToken) {
                parameters.push(_parseExpressionBuilder());
            }
            return <IFunctionApplicationExpression>{
                kind: ExpressionKind.FunctionApplicationExpression,
                id: (left as IIdentifierExpression).root,
                parameters
            }
        }
        else {
            return left;
        }
    }

    function _parseExpressionBuilder() {

        if (_is(SyntaxKind.IdentifierToken)) {
            return _parseIdenitifier();
        }
        else if (_is(SyntaxKind.StringLiteralToken)) {
            return <IUnaryExpression>{
                kind: ExpressionKind.StringLiteralExpression,
                expression: _take(SyntaxKind.StringLiteralToken)
            };
        }
        else if (_is(SyntaxKind.NumberLiteralToken)) {
            return <IUnaryExpression>{
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

            return <IUnaryExpression>{
                kind: ExpressionKind.ParenthesizedExpression,
                expression
            };
        }
        else {
            throw new Error(`Invalid Expression: '${SyntaxKind[_current().kind]}' '${_current().value}'`);
        }
    }


    function _parseContextualNewline() {
        if (_current().kind == SyntaxKind.NewLine) {
            index++;
            for (let i = 0; i < context; ++i) {
                if (_current().kind == SyntaxKind.IndentToken) {
                    index++;
                }
                else {
                    throw new Error(`Invalid indentation: line ${_current().line} column ${_current().lineStart}`);
                }
            }
            while (_current().kind == SyntaxKind.IndentToken) index++;
        }
    }

    return { ast, errors };
}
