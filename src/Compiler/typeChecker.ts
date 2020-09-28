import { ErrorSink, ErrorType } from "./errorSink";
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
    Types, IFunctionDeclarationExpression
} from "./types";



export function check(ast: IExpression[], errorSink: ErrorSink = new ErrorSink()) {


    var globalDefinitions = new Map();
    var context = new Map();
    var errors = [];

    function visitVariableDefinition(node: ITypeDefinition) {
        var name = node.id.root.value;

        if (globalDefinitions.has(name)) {
            errorSink.addError({
                type: ErrorType.TypeError,
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
                errorSink.addError({
                    type: ErrorType.TypeError,
                    message: `Your variable is defined as a '${Types[globalDefinition.type]}' but the inferred type is '${Types[node.type]}'. 
An expression can't change it's type.`,
                    position: node.id.position
                });
            }
        }
    }

    function visitFunctionDefinitionExpression(node: IFunctionDeclarationExpression) {
        let def = globalDefinitions.get(node.id.root.value) as ITypeDefinition;


        context = new Map<string, IIdentifierExpression>();
        node.parameters.forEach((p, i) => {
            if (p.kind !== ExpressionKind.NoParams) {
                let param = p as IIdentifierExpression;
                context.set(param.root.value, param);
            }
        });
        visit(node.body);

        if (def) {
            let paramCount = def.typeParameters.length - 1;
            let returnType = def.typeParameters[def.typeParameters.length - 1];
            if (node.parameters.length !== paramCount) {
                errorSink.addError({
                    type: ErrorType.TypeError,
                    message: `Function '${node.id.root.value}' was expected to have ${def.typeParameters.length - 1} parameters but was found to have ${node.parameters.length}. The arity of a function can not be modified at runtime.`,
                    position: node.id.position
                });
            }

            if (def.typeParameters.length > 0) {
                node.type = returnType.type;
            }


            node.parameters.forEach((p, i) => {
                if (p.type == Types.Undefined) {
                    errorSink.addError({
                        type: ErrorType.TypeError,
                        message: `Parameter '${(p as IIdentifierExpression).root.value}' is unused, you should remove the parameter.`,
                        position: p.position
                    });
                }
                else if (i < paramCount && Types[def.typeParameters[i].type] !== Types[p.type]) {
                    errorSink.addError({
                        type: ErrorType.TypeError,
                        message: `Parameter '${(p as IIdentifierExpression).root.value}' was expected to have type '${Types[def.typeParameters[i].type]}' but was inferred to have type '${Types[p.type]}.'`,
                        position: p.position
                    });
                }

                if (i >= paramCount) {
                    errorSink.addError({
                        type: ErrorType.TypeError,
                        message: `Parameter '${(p as IIdentifierExpression).root.value}' was not declared in the type definition of this function.`,
                        position: p.position
                    });
                }
            });

        }
    }

    function visitBinaryExpression(node: IBinaryExpression) {
        if (node.operator.kind === SyntaxKind.PlusToken ||
            node.operator.kind === SyntaxKind.MinusToken ||
            node.operator.kind === SyntaxKind.AsteriskToken ||
            node.operator.kind === SyntaxKind.SlashToken ||
            node.operator.kind === SyntaxKind.PercentToken) {
            if (node.left.type == Types.Undefined) {
                node.left.type = Types.Number;
            } else if (node.left.type == Types.Number) {
                // this is perfect!
            }
            else {
                errorSink.addError({
                    type: ErrorType.TypeError,
                    message: `Operator '+' can only be applied to two numbers, but found type '${Types[node.left.type]}'`,
                    position: node.left.position
                });
            }
            visit(node.left);

            if (node.right.type == Types.Undefined) {
                node.right.type = Types.Number;
            } else if (node.right.type == Types.Number) {
                // this is perfect!
            }
            else {
                errorSink.addError({
                    type: ErrorType.TypeError,
                    message: `Operator '+' can only be applied to two numbers, but found type '${Types[node.right.type]}'`,
                    position: node.right.position
                });
            }
            visit(node.right);
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

        let param = context.get(node.root.value);
        if (param && param.type === Types.Undefined) {
            param.type = node.type;
        }

        if (param && param.type !== node.type) {
            console.log("asdasdas")
        }
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
            case ExpressionKind.FunctionDefinitionExpression:
                return visitFunctionDefinitionExpression(node as IFunctionDeclarationExpression);
            // case ExpressionKind.FunctionApplicationExpression:
            //     return visitFunctionApplicationExpression(node as IFunctionApplicationExpression);
            // case ExpressionKind.FunctionDefinitionExpression:
            //     return visitFunctionDefinitionExpression(node as IVariableExpression);
            case ExpressionKind.BinaryExpression:
                return visitBinaryExpression(node as IBinaryExpression);
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