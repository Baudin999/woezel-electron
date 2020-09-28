import { ErrorSink } from "./errorSink";
import {
    ExpressionKind,
    IBinaryExpression,
    IExpression,
    IFunctionApplicationExpression,
    IIdentifierExpression,
    IToken,
    IUnaryExpression,
    ITypeDefinition,
    IAssignmentExpression,
    SyntaxKind,
    Types
} from "./types";



export function check(ast: IExpression[], errorSink: ErrorSink = new ErrorSink()) {


    var globalDefinitions = new Map();
    var errors = [];

    function visitVariableDefinition(node: ITypeDefinition) {
        var name = node.id.root.value;

        if (globalDefinitions.has(name)) {
            errorSink.addError({
                message: `Type ${name} already exists, not allowed to declare a variable twice.`,
                position: {
                    startColumn: node.id.root.columnStart,
                    endColumn: node.id.root.columnEnd,
                    startLine: node.id.root.line,
                    endLine: node.id.root.line
                }
            });
        }

        node.typeParameters.forEach(param => visit(param));

        if (node.typeParameters.length == 1) {
            // we're in variable declaration territory...
            node.type = node.typeParameters[0].type;
        }

        globalDefinitions.set(name, node);
    }

    function visitVariableDeclaration(node: IAssignmentExpression) {
        // set the name for easy and quick access in the rest of the function.
        let name = node.id.root.value;

        // first check if the name exists in the globalDefinitions
        // even if the variable is, for example, a UnaryExpression,
        // it should still equal the type of this global expression
        var globalDefinition = <ITypeDefinition>globalDefinitions.get(name);

        visit(node.body);
        node.type = node.body.type;

        if (globalDefinition) {
            if (globalDefinition.type !== node.type) {
                console.log(node)
                errorSink.addError({
                    message: `Your variable is defined as a '${Types[globalDefinition.type]}' but the inferred type is '${Types[node.type]}'. 
An expression can't change it's type.`,
                    position: {
                        startColumn: node.id.root.columnStart,
                        endColumn: node.id.root.columnEnd,
                        startLine: node.id.root.line,
                        endLine: node.id.root.line
                    }
                });
            }
        }
    }

    function visitIdentifierExpression(node: IIdentifierExpression) {
        //
        if (node.root.value === "string") node.type = Types.String;
        if (node.root.value === "number") node.type = Types.Number;
        if (node.root.value === "date") node.type = Types.Date;
        if (node.root.value === "datetime") node.type = Types.DateTime;
        if (node.root.value === "time") node.type = Types.Time;
        if (node.root.value === "boolean") node.type = Types.Boolean;
    }

    function visitUnaryExpression(node: IUnaryExpression) {

        switch (node.kind) {
            case ExpressionKind.StringLiteralExpression:
                node.type = Types.String;
                break;
            case ExpressionKind.NumberLiteralExpression:
                node.type = Types.Number;
                break;
            default:
                errors.push("Unknown Unary Expression kind...");
                break;
        }
    }

    function visit(node: IExpression) {
        //
        switch (node.kind) {
            case ExpressionKind.VariableDefinition:
                return visitVariableDefinition(node as ITypeDefinition);
            case ExpressionKind.AssignmentExpression:
                return visitVariableDeclaration(node as IAssignmentExpression);
            case ExpressionKind.IdentifierExpression:
                return visitIdentifierExpression(node as IIdentifierExpression);
            // case ExpressionKind.FunctionApplicationExpression:
            //     return visitFunctionApplicationExpression(node as IFunctionApplicationExpression);
            // case ExpressionKind.FunctionDefinitionExpression:
            //     return visitFunctionDefinitionExpression(node as IVariableExpression);
            // case ExpressionKind.BinaryExpression:
            //     return visitBinaryExpression(node as IBinaryExpression);
            case ExpressionKind.UnaryExpression:
                return visitUnaryExpression(node as IUnaryExpression);
            // case ExpressionKind.ParenthesizedExpression:
            //     return visit((node as IUnaryExpression).expression as IExpression);
            case ExpressionKind.NumberLiteralExpression:
                return visitUnaryExpression(node as IUnaryExpression);
            case ExpressionKind.StringLiteralExpression:
                return visitUnaryExpression(node as IUnaryExpression);
            // default:
            //     return "";
        }
    }

    ast.map(node => visit(node));
    return errors;
}