import {
    ExpressionKind,
    IBinaryExpression,
    IExpression,
    IFunctionApplicationExpression,
    IIdentifierExpression,
    IToken,
    IUnaryExpression,
    IVariableDefinition,
    IVariableDeclarationExpression,
    SyntaxKind,
    Types
} from "./types";



export function check(ast: IExpression[]) {


    var globalDefinitions = new Map();
    var errors = [];

    function visitVariableDefinition(node: IVariableDefinition) {
        var name = node.identifier.root.value;

        if (globalDefinitions.has(name)) {
            errors.push(`Type ${name} already exists, not allowed to declare a variable twice.`);
        }

        node.parameters.forEach(param => visit(param));

        if (node.parameters.length == 1) {
            // we're in variable declaration territory...
            node.type = node.parameters[0].type;
        }

        globalDefinitions.set(name, node);
    }

    function visitVariableDeclaration(node: IVariableDeclarationExpression) {
        // set the name for easy and quick access in the rest of the function.
        let name = node.name.root.value;

        // first check if the name exists in the globalDefinitions
        // even if the variable is, for example, a UnaryExpression,
        // it should still equal the type of this global expression
        var globalDefinition = <IVariableDefinition>globalDefinitions.get(name);

        visit(node.expression);
        node.type = node.expression.type;

        if (globalDefinition) {
            if (globalDefinition.type !== node.type) {
                errors.push(`Your variable is defined as a ${Types[globalDefinition.type]} but the inferred type is ${Types[node.type]}. 
An expression can't change it's type.`);
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
                return visitVariableDefinition(node as IVariableDefinition);
            case ExpressionKind.VariableDeclaration:
                return visitVariableDeclaration(node as IVariableDeclarationExpression);
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