
/**
 * This module will transpile the generated AST to JavaScript
 * Please look at the documentation for more information about
 * the language and the supported features.
 */

import {
    ExpressionKind,
    IBinaryExpression,
    IExpression,
    IFunctionApplicationExpression,
    IIdentifierExpression,
    IToken,
    IUnaryExpression,
    IVariableDeclarationExpression,
    SyntaxKind
} from "./../types";
import { baseLibrary } from "./js_base";



function visitFunctionDefinitionExpression(node: IVariableDeclarationExpression) {
    return `function ${visit(node.name)} {
    return ${visit(node.expression)};
}`;
}

function visitFunctionApplicationExpression(node: IFunctionApplicationExpression) {
    return `${node.id.value}(${node.parameters.map(p => visit(p)).join(', ')})`;
}

function visitIdentifierExpression(node: IIdentifierExpression) {
    if (node.parts.length == 0) {
        return `${node.root.value}`;
    } else {
        return `${node.root.value}.${node.parts.map(p => p.value).join('.')}`
    }
}

function visitVariableDeclaration(node: IVariableDeclarationExpression) {
    if (node.expression.kind == ExpressionKind.FunctionDefinitionExpression) {
        return `function ${visit(node.name)} {
    ${visit(node.expression)}
}`;
    }
    else {
        return `var ${visit(node.name)} = ${visit(node.expression)};`
    }
}

function visitBinaryExpression(node: IBinaryExpression) {
    if (node.operator.kind == SyntaxKind.PipeRight) {
        if (node.right.kind == ExpressionKind.FunctionApplicationExpression) {
            let application = (node.right as IFunctionApplicationExpression);
            application.parameters.push(node.left);
            return visit(application);
        }

        throw `You can only pipe into a function`;
    }
    else {
        return `${visit(node.left)} ${node.operator.value} ${visit(node.right)}`;
    }
}

function visitUnaryExpression(node: IUnaryExpression) {
    if (<IToken>node.expression !== undefined) {
        return (node.expression as IToken).value;
    }
    else {
        return visit(node.expression as IExpression);
    }
}

function visit(node: IExpression) {
    //
    switch (node.kind) {
        case ExpressionKind.VariableDeclaration:
            return visitVariableDeclaration(node as IVariableDeclarationExpression);
        case ExpressionKind.IdentifierExpression:
            return visitIdentifierExpression(node as IIdentifierExpression);
        case ExpressionKind.FunctionApplicationExpression:
            return visitFunctionApplicationExpression(node as IFunctionApplicationExpression);
        case ExpressionKind.FunctionDefinitionExpression:
            return visitFunctionDefinitionExpression(node as IVariableDeclarationExpression);
        case ExpressionKind.BinaryExpression:
            return visitBinaryExpression(node as IBinaryExpression);
        case ExpressionKind.UnaryExpression:
            return visitUnaryExpression(node as IUnaryExpression);
        case ExpressionKind.ParenthesizedExpression:
            return visit((node as IUnaryExpression).expression as IExpression);
        case ExpressionKind.NumberLiteralExpression:
            return visitUnaryExpression(node as IUnaryExpression);
        case ExpressionKind.StringLiteralExpression:
            return visitUnaryExpression(node as IUnaryExpression);
        default:
            return "";
    }
}


export function transpile(ast: IExpression[]) {
    let content = ast.map(node => {
        return visit(node);
    }).join("\n\n");

    return `    
(() => {
    ${content}
    main();
})();
${baseLibrary}
`;
}