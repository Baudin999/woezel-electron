import { fix_and_outro_and_destroy_block } from "svelte/internal";
import { ErrorSink, ErrorType, IError, IPosition } from "./errorSink";
import {
    IExpression,
    IAssignmentExpression,
    IBinaryExpression,
    IUnaryExpression,
    IIdentifierExpression,
    IFunctionApplicationExpression,
    IFunctionDeclarationExpression,
    ITypeDefinition,
    Types, Expression, IListLiteralExpression
} from "./types";
import { ExpressionKind, IToken, SyntaxKind, operators } from "./types";



export const parser = (tokenList: IToken[], errorSink: ErrorSink = new ErrorSink()) => {

    // skipping the whitespaces
    let tokens = tokenList.filter(t => t.kind != SyntaxKind.Whitespace);

    let index = 0;
    let max = tokens.length;
    let context = 0;
    let ast: IExpression[] = [];
    let errors: Error[] = [];

    let _invalidIndentation = (i) => {
        errorSink.addError(<IError>{
            type: ErrorType.SyntaxError,
            message: `Invalid indentation: line ${_current().line} column ${_current().columnStart} expected indentation.`,
            position: <IPosition>{
                startColumn: _current().columnStart,
                startLine: _current().line,
                endColumn: _current(i).columnEnd,
                endLine: _current(i).line
            }
        });
    }

    let _current = (n = 0) => tokens[index + n] || { value: "", line: -1, columnStart: -1, columnEnd: -1, fileStart: -1, fileEnd: -1, kind: SyntaxKind.Unknown };
    let _next = () => {
        var i = 1;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        return _current(i);
    }
    let _is = (kind: SyntaxKind, minContext?: number) => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        if (minContext && i < minContext) {
            _invalidIndentation(i);
        }
        return _current(i).kind == kind;
    }
    let _isContextual = () => {
        var i = 0;
        var _context = context;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) {
            if (_current(i).kind == SyntaxKind.NewLine) {
                _context = 0;
                i++;
            }
            else if (_current(i).kind == SyntaxKind.IndentToken) {
                _context++;
                i++;
            }
        }
        return _context >= context && index + 1 < max;
    }
    let _isLiteral = (minContext?: number) => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        if (minContext && i < minContext) {
            _invalidIndentation(i);
        }
        var kind = _current(i).kind;
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
            _invalidIndentation(i);
        }
        return _current(i).kind == SyntaxKind.IdentifierToken;
    }
    let _isOperator = () => {
        var i = 0;
        while (_current(i).kind == SyntaxKind.NewLine || _current(i).kind == SyntaxKind.IndentToken) i++;
        return operators.indexOf(_current(i).kind) > -1;
    }
    let _take = (kind?: SyntaxKind) => {
        _parseContextualNewline();
        var result = _current();
        if (kind && result.kind !== kind) {
            errorSink.addError(<IError>{
                type: ErrorType.SyntaxError,
                message: `Expected ${SyntaxKind[kind]} on line ${result.line} column ${result.columnStart} but received ${SyntaxKind[result.kind]}.`,
                position: <IPosition>{
                    startColumn: _current().columnStart,
                    startLine: _current().line,
                    endColumn: _current().columnEnd,
                    endLine: _current().line
                }
            });
        }
        index++;
        return result;
    }
    let getPosition = (start: IToken, end?: IToken) => {
        return <IPosition>{
            startColumn: start.columnStart,
            endColumn: end?.columnEnd ?? start.columnEnd,
            startLine: start.line,
            endLine: end?.line ?? start.line,
        }
    }
    let getPositionFromPositions = (start: IPosition, end?: IPosition) => {
        return <IPosition>{
            startColumn: start.startColumn,
            endColumn: end?.endColumn ?? start.endColumn,
            startLine: start.startLine,
            endLine: end?.endLine ?? start.endLine,
        }
    }

    // Main parsing loop
    (() => {
        let __i;
        while (index < max) {
            if (_current().kind == SyntaxKind.NewLine || _current().kind == SyntaxKind.IndentToken) index++;
            else if (_current().kind == SyntaxKind.SemicolonToken) index++;
            else if (_current().kind == SyntaxKind.SingleLineCommentToken) index++;
            else if (_current().kind == SyntaxKind.MultiLineCommentToken) index++;
            else {
                ParseBlock(_parseExpression);
            }

            if (__i === index) {
                console.log(_current())
                throw "Infinite loop detected...";
            }
            __i = index;
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



    function _parseIdenitifier(): IIdentifierExpression {
        let root = _take(SyntaxKind.IdentifierToken);
        let parts: IToken[] = [];
        while (_is(SyntaxKind.DotToken)) {
            _take(SyntaxKind.DotToken);
            if (_is(SyntaxKind.IdentifierToken)) parts.push(_take());
            else {
                let ps = [...parts, _current()];
                errorSink.addError(<IError>{
                    type: ErrorType.SyntaxError,
                    message: `Identifier fields are always Identifiers themselves:
Foo.Bar

Never something like:
${root.value}.${ps.map(p => p.value).join(".")}`,
                    position: getPosition(_current())
                });
            }
        }


        return {
            kind: ExpressionKind.IdentifierExpression,
            root,
            parts,
            type: Types.Undefined,
            position: getPosition(root, parts[parts.length - 1])
        }
    }

    function _parseExpression(): IExpression {
        let left = _parseAtom();

        if (left === null) return left;

        /**
         * Checking for other parameters. This is the way we finc functions
         * and function application.
         * 
         * Example:
         * add x y => x + y;
         * ---               Identifier
         *     ---           parameters
         *         --        EqualsGreaterThanToken
         *            -----  Body
         */
        let parameters = [];
        if (left.kind == ExpressionKind.IdentifierExpression) {
            let param = _parseAtom();
            while (param) {
                parameters.push(param);
                param = _parseAtom();
            }
        }

        function createLeft() {
            if (parameters.length == 0) {
                return left;
            }
            else {
                return <IFunctionApplicationExpression>{
                    kind: ExpressionKind.FunctionApplicationExpression,
                    id: left,
                    parameters,
                    position: getPositionFromPositions(left.position, parameters[parameters.length - 1])
                };
            }
        }

        function parseClosure() {
            let closure = [];
            if (_is(SyntaxKind.WhereKeywordToken)) {
                _take(SyntaxKind.WhereKeywordToken);
                // the where token defines lexical scoping of the closure...
                context++;
                while (_isContextual()) {
                    closure.push(_parseExpression());
                }
                context--;
            }
            return closure;
        }
        /* end of the parameter check */

        if (_isOperator()) {
            let operator = _take();
            let __left = createLeft();
            let right = _parseExpression();

            if (operator.kind == SyntaxKind.EqualsToken) {
                // we don't think of '=' as a true operator but as an assignment
                return <IAssignmentExpression>{
                    kind: ExpressionKind.AssignmentExpression,
                    id: __left,
                    body: right,
                    position: getPositionFromPositions(__left.position, right.position)
                };
            }
            else {
                return <IBinaryExpression>{
                    kind: ExpressionKind.BinaryExpression,
                    left: __left,
                    operator,
                    right,
                    type: Types.Undefined,
                    position: getPositionFromPositions(__left.position, right.position)
                };
            }
        }
        else if (_is(SyntaxKind.TypeDef)) {
            _take(SyntaxKind.TypeDef);
            let parameters = [_parseExpression()];
            while (_is(SyntaxKind.NextParamToken)) {
                _take(SyntaxKind.NextParamToken);
                parameters.push(_parseExpression());
            }

            return <ITypeDefinition>{
                kind: ExpressionKind.VariableDefinition,
                id: left,
                typeParameters: parameters
            }
        }
        else if (_is(SyntaxKind.EqualsGreaterThanToken)) {
            _take(SyntaxKind.EqualsGreaterThanToken);
            let body = _parseExpression();
            let closure = parseClosure();

            return <IFunctionDeclarationExpression>{
                kind: ExpressionKind.FunctionDefinitionExpression,
                id: left,
                parameters,
                body,
                closure
            };
        }
        else {
            while (_is(SyntaxKind.EndStatement)) _take(SyntaxKind.EndStatement);
            return createLeft();
        }
    }

    function _parseAtom() {

        if (!_isContextual()) return null;

        if (_is(SyntaxKind.IdentifierToken)) {
            return _parseIdenitifier();
        }
        else if (_is(SyntaxKind.StringLiteralToken)) {
            let token = _take(SyntaxKind.StringLiteralToken);
            return <IUnaryExpression>{
                kind: ExpressionKind.StringLiteralExpression,
                expression: token,
                type: Types.String,
                position: getPosition(token)
            };
        }
        else if (_is(SyntaxKind.NumberLiteralToken)) {
            let token = _take(SyntaxKind.NumberLiteralToken);
            return <IUnaryExpression>{
                kind: ExpressionKind.NumberLiteralExpression,
                expression: token,
                type: Types.Number,
                position: getPosition(token)
            };
        }
        else if (_is(SyntaxKind.BooleanLiteralToken)) {
            let token = _take(SyntaxKind.BooleanLiteralToken);
            return <IUnaryExpression>{
                kind: ExpressionKind.BooleanLiteralExpression,
                expression: token,
                type: Types.Boolean,
                position: getPosition(token)
            };
        }
        else if (_is(SyntaxKind.NoParams)) {
            let token = _take(SyntaxKind.NoParams);
            return <IExpression>{
                kind: ExpressionKind.NoParams,
                type: Types.Undefined,
                position: getPosition(token)
            };
        }

        else if (_is(SyntaxKind.OpenBracketToken)) {
            let start = _take(SyntaxKind.OpenBracketToken);
            let items = [];
            let item = _parseExpression();
            while (item) {
                items.push(item);
                if (_is(SyntaxKind.CommaToken)) {
                    let comma = _take(SyntaxKind.CommaToken);
                    item = _parseExpression();

                    if (!item) {
                        errorSink.addError({
                            type: ErrorType.SyntaxError,
                            message: `Trailing commas are not allowed in list literal definitions.`,
                            position: getPosition(comma)
                        });
                    }
                } else {
                    item = null;
                }
            }
            let end = _take(SyntaxKind.CloseBracketToken);

            return <IListLiteralExpression>{
                items,
                kind: ExpressionKind.ListLiteralExpression,
                position: getPosition(start, end)
            };
        }

        // Example: (2 + 3)
        else if (_is(SyntaxKind.OpenParenToken)) {
            let start = _take(SyntaxKind.OpenParenToken);
            let end;
            var expression = _parseExpression();
            if (!_is(SyntaxKind.CloseParenToken)) {
                errorSink.addError(<IError>{
                    message: `Parathesis should be closed.`,
                    position: getPosition(start, _current())
                });
            }
            else {
                end = _take(SyntaxKind.CloseParenToken);
            }

            return <IUnaryExpression>{
                kind: ExpressionKind.ParenthesizedExpression,
                expression,
                type: Types.Undefined,
                position: getPosition(start, end)
            };
        }
        else {
            //throw new Error(`Invalid Expression: '${SyntaxKind[_current().kind]}' '${_current().value}'`);
            return null;
        }
    }


    function _parseContextualNewline() {
        let oldIndex = index;
        if (_current().kind == SyntaxKind.NewLine) {
            index++;
            for (let i = 0; i < context; ++i) {
                if (_current().kind == SyntaxKind.IndentToken) {
                    index++;
                }
                else {
                    _invalidIndentation(0);
                }
            }
            while (_current().kind == SyntaxKind.IndentToken) index++;
        }
    }

    // function TypeDeclaration(): ITypeDeclaration {
    //     _take(SyntaxKind.TypeKeywordToken);
    //     let name = _parseIdenitifier();
    //     let extensions: IIdentifierExpression[] = [];
    //     let fields: IFieldDeclaration[] = [];

    //     if (_current().kind == SyntaxKind.ExtendsKeywordToken) {
    //         _take(SyntaxKind.ExtendsKeywordToken);
    //         while (_current().kind == SyntaxKind.IdentifierToken) {
    //             extensions.push(_parseIdenitifier());
    //         }
    //     }

    //     if (_current().kind == SyntaxKind.EqualsToken) {
    //         _take(SyntaxKind.EqualsToken);
    //         while (_is(SyntaxKind.IdentifierToken)) {
    //             let fieldName = _parseIdenitifier().root;
    //             context++;
    //             _take(SyntaxKind.ColonToken);
    //             let fieldType = _parseIdenitifier();

    //             let restrictions: IExpression[] = [];
    //             while (_is(SyntaxKind.AmpersandToken)) {
    //                 try {
    //                     var t = _take(SyntaxKind.AmpersandToken);
    //                     let restrictionExpression = _parseExpression();
    //                     restrictions.push(restrictionExpression);
    //                 }
    //                 catch (ex) {

    //                     console.log(ex);
    //                 }
    //             }
    //             context--;
    //             _take(SyntaxKind.SemicolonToken);

    //             fields.push({
    //                 kind: ExpressionKind.FieldDeclaration,
    //                 name: fieldName,
    //                 fieldType: fieldType,
    //                 restrictions,
    //                 type: Types.Undefined
    //             });
    //         }
    //     }

    //     return {
    //         kind: ExpressionKind.TypeDeclaration,
    //         name: name.root,
    //         extensions,
    //         fields,
    //         type: Types.Undefined
    //     };
    // }
    return { ast, errors: errorSink };
}
