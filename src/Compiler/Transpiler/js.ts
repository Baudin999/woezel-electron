
import { CompilerContext, ICompilerOptions } from "../compiler";
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
    IAssignmentExpression,
    SyntaxKind, IFunctionDeclarationExpression
} from "./../types";
import { baseLibrary } from "./js_base";



function visitFunctionDefinitionExpression(node: IFunctionDeclarationExpression) {
    let parameters =
        node.parameters[0].kind == ExpressionKind.EmptyParameters ?
            "()" :
            `(${node.parameters.map(p => visit(p)).join(", ")})`;

    return `function ${visit(node.id)} ${parameters} {
    ${node.closure.map(c => visit(c)).join("\n")}
    return ${visit(node.body)};
}`;
}

function visitFunctionApplicationExpression(node: IFunctionApplicationExpression) {
    return `${node.id.root.value}(${node.parameters.map(p => visit(p)).join(', ')})`;
}

function visitIdentifierExpression(node: IIdentifierExpression) {
    if (node.parts.length == 0) {
        return `${node.root.value}`;
    } else {
        return `${node.root.value}.${node.parts.map(p => p.value).join('.')}`
    }
}

function visitAssignmentExpression(node: IAssignmentExpression) {
    return `var ${visit(node.id)} = ${visit(node.body)};`;
}

function visitBinaryExpression(node: IBinaryExpression) {
    if (node.operator.kind == SyntaxKind.PipeRight) {
        if (node.right.kind == ExpressionKind.FunctionApplicationExpression) {
            let application = (node.right as IFunctionApplicationExpression);
            application.parameters.push(node.left);
            return visit(application);
        } else if (node.right.kind == ExpressionKind.IdentifierExpression) {
            let application = <IFunctionApplicationExpression>{
                id: node.right,
                parameters: [node.left],
                kind: ExpressionKind.FunctionApplicationExpression
            };
            return visit(application);
        }

        console.log(ExpressionKind[node.right.kind])

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
    switch (node?.kind) {
        case ExpressionKind.AssignmentExpression:
            return visitAssignmentExpression(node as IAssignmentExpression);
        case ExpressionKind.IdentifierExpression:
            return visitIdentifierExpression(node as IIdentifierExpression);
        case ExpressionKind.FunctionApplicationExpression:
            return visitFunctionApplicationExpression(node as IFunctionApplicationExpression);
        case ExpressionKind.FunctionDefinitionExpression:
            return visitFunctionDefinitionExpression(node as IFunctionDeclarationExpression);
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


export function transpile(ast: IExpression[], options: ICompilerOptions) {
    let hasMain = false;
    ast.forEach(node => {
        if (node.kind == ExpressionKind.FunctionDefinitionExpression) {
            if ((<IAssignmentExpression>(node)).id.root.value === "main") hasMain = true;
        }
    });

    let content = ast.map(node => {
        return visit(node);
    }).join("\n\n");


    // defpending on the compiler options we'll want to return the right 
    // string. For example, in our unit tests we'll want to return something
    // which, when evaluated, will give us a result without printing to the 
    // screen.
    if (options.context == CompilerContext.Browser) {
        return `    
(() => {
${baseLibrary}
;
    ${content}
    ${hasMain ? "return main();" : ""}
})();
    `;
    }
    else if (options.context == CompilerContext.Node) {
        return `    
${baseLibrary}
;

return (() => {
    ${content}
    ${hasMain ? "return main();" : ""}
})();
`;
    }

}