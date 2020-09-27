
export interface IToken {
    value: string;

    // line information
    line: number;
    lineStart: number;
    lineEnd: number;

    // text information
    fileStart: number;
    fileEnd: number;

    // kind
    kind: SyntaxKind;
}


export enum SyntaxKind {
    Unknown,

    // Keywords
    TypeKeywordToken,
    AliasKeywordToken,
    DataKeywordToken,
    ChoiceKeywordToken,
    LetKeywordToken,
    ExtendsKeywordToken,
    WhereKeywordToken,

    // Operators
    OperatorToken,

    // Punctuation
    OpenBraceToken,
    CloseBraceToken,
    OpenParenToken,
    CloseParenToken,
    OpenBracketToken,
    CloseBracketToken,
    DotToken,
    DotDotDotToken,
    SemicolonToken,
    CommaToken,
    QuestionDotToken,
    LessThanToken,
    LessThanSlashToken,
    GreaterThanToken,
    LessThanEqualsToken,
    GreaterThanEqualsToken,
    EqualsEqualsToken,
    ExclamationEqualsToken,
    EqualsEqualsEqualsToken,
    ExclamationEqualsEqualsToken,
    EqualsGreaterThanToken,
    PlusToken,
    MinusToken,
    AsteriskToken,
    AsteriskAsteriskToken,
    SlashToken,
    PercentToken,
    PlusPlusToken,
    MinusMinusToken,
    LessThanLessThanToken,
    GreaterThanGreaterThanToken,
    GreaterThanGreaterThanGreaterThanToken,
    AmpersandToken,
    BarToken,
    CaretToken,
    ExclamationToken,
    TildeToken,
    AmpersandAmpersandToken,
    BarBarToken,
    QuestionToken,
    ColonToken,
    AtToken,
    QuestionQuestionToken,
    BacktickToken,
    IndentToken,
    PipeRight,
    PipeLeft,
    NoParams,
    NextParamToken,
    TypeDef,

    // Assignments
    EqualsToken,
    PlusEqualsToken,
    MinusEqualsToken,
    AsteriskEqualsToken,
    AsteriskAsteriskEqualsToken,
    SlashEqualsToken,
    PercentEqualsToken,
    LessThanLessThanEqualsToken,
    GreaterThanGreaterThanEqualsToken,
    GreaterThanGreaterThanGreaterThanEqualsToken,
    AmpersandEqualsToken,
    BarEqualsToken,
    BarBarEqualsToken,
    AmpersandAmpersandEqualsToken,
    QuestionQuestionEqualsToken,
    CaretEqualsToken,

    // other
    IdentifierToken,
    Number,
    Whitespace,
    NewLine,
    Attribute,
    Markdown,

    EndStatement = SemicolonToken,

    // literal tokens
    StringLiteralToken,     // "Vincent"  only double quotes
    NumberLiteralToken,     // 2  2.3  345.12333e12
    BooleanLiteralToken,    // true false
    DateLiteralToken,       // 01/12/2020 
    DateTimeLiteralToken,   // 01/12/2020:12:30:00
    TimeLiteralToken,       // 12:30:00  12:30   the miliseconds are optional and will default to 00

    // Comments
    SingleLineCommentToken,
    MultiLineCommentToken
}

export type KeywordSyntaxKind =
    | SyntaxKind.TypeKeywordToken
    | SyntaxKind.AliasKeywordToken
    | SyntaxKind.DataKeywordToken
    | SyntaxKind.ChoiceKeywordToken
    | SyntaxKind.LetKeywordToken
    | SyntaxKind.ExtendsKeywordToken
    | SyntaxKind.WhereKeywordToken
    ;

export const operators = [
    SyntaxKind.PlusToken,
    SyntaxKind.MinusToken,
    SyntaxKind.AsteriskToken,
    SyntaxKind.SlashToken,
    SyntaxKind.PipeRight,
    SyntaxKind.EqualsToken,
    SyntaxKind.GreaterThanToken,
    SyntaxKind.GreaterThanEqualsToken,
    SyntaxKind.LessThanToken,
    SyntaxKind.LessThanEqualsToken
];

export enum CharacterCodes {
    nullCharacter = 0,
    maxAsciiCharacter = 0x7F,

    lineFeed = 0x0A,                // \n
    carriageReturn = 0x0D,          // \r

    // Unicode 3.0 space characters
    space = 0x0020,                 // " "
    nonBreakingSpace = 0x00A0,      //

    _0 = 0x30,
    _1 = 0x31,
    _2 = 0x32,
    _3 = 0x33,
    _4 = 0x34,
    _5 = 0x35,
    _6 = 0x36,
    _7 = 0x37,
    _8 = 0x38,
    _9 = 0x39,

    a = 0x61,
    b = 0x62,
    c = 0x63,
    d = 0x64,
    e = 0x65,
    f = 0x66,
    g = 0x67,
    h = 0x68,
    i = 0x69,
    j = 0x6A,
    k = 0x6B,
    l = 0x6C,
    m = 0x6D,
    n = 0x6E,
    o = 0x6F,
    p = 0x70,
    q = 0x71,
    r = 0x72,
    s = 0x73,
    t = 0x74,
    u = 0x75,
    v = 0x76,
    w = 0x77,
    x = 0x78,
    y = 0x79,
    z = 0x7A,

    A = 0x41,
    B = 0x42,
    C = 0x43,
    D = 0x44,
    E = 0x45,
    F = 0x46,
    G = 0x47,
    H = 0x48,
    I = 0x49,
    J = 0x4A,
    K = 0x4B,
    L = 0x4C,
    M = 0x4D,
    N = 0x4E,
    O = 0x4F,
    P = 0x50,
    Q = 0x51,
    R = 0x52,
    S = 0x53,
    T = 0x54,
    U = 0x55,
    V = 0x56,
    W = 0x57,
    X = 0x58,
    Y = 0x59,
    Z = 0x5a,

    ampersand = 0x26,               // &
    asterisk = 0x2A,                // *
    at = 0x40,                      // @
    backslash = 0x5C,               // \
    backtick = 0x60,                // `
    bar = 0x7C,                     // |
    caret = 0x5E,                   // ^
    closeBrace = 0x7D,              // }
    closeBracket = 0x5D,            // ]
    closeParen = 0x29,              // )
    colon = 0x3A,                   // :
    comma = 0x2C,                   // ,
    dot = 0x2E,                     // .
    doubleQuote = 0x22,             // "
    equals = 0x3D,                  // =
    exclamation = 0x21,             // !
    greaterThan = 0x3E,             // >
    hash = 0x23,                    // #
    lessThan = 0x3C,                // <
    minus = 0x2D,                   // -
    openBrace = 0x7B,               // {
    openBracket = 0x5B,             // [
    openParen = 0x28,               // (
    percent = 0x25,                 // %
    plus = 0x2B,                    // +
    question = 0x3F,                // ?
    semicolon = 0x3B,               // ;
    singleQuote = 0x27,             // '
    slash = 0x2F,                   // /
    tilde = 0x7E,                   // ~

    backspace = 0x08,               // \b
    formFeed = 0x0C,                // \f
    byteOrderMark = 0xFEFF,
    tab = 0x09,                     // \t
    verticalTab = 0x0B,             // \v
}


export enum ExpressionKind {
    VariableDefinition,

    TypeDeclaration,
    FieldDeclaration,


    // literal expressions
    StringLiteralExpression,
    NumberLiteralExpression,
    BooleanLiteralExpression,
    DateLiteralExpression,
    DateTimeLiteralExpression,
    TimeLiteralExpression,
    MoneyLiteralExpression,

    // constructs
    AssignmentExpression,                   // foo = 2
    IdentifierExpression,                   // foo
    ParenthesizedExpression,                // (2 + 3)
    BinaryExpression,                       // 2 + 3
    UnaryExpression,                        // "unary"
    FunctionApplicationExpression,          // add 2 3
    FunctionDefinitionExpression,           // add x y => x + y;
    EmptyParameters                         // ()
}


export interface IExpression {
    kind: ExpressionKind;
    type: Types;
}
export interface ITypeDefinition extends IExpression {
    id: IIdentifierExpression;
    typeParameters: IIdentifierExpression[];
}
export interface IAssignmentExpression extends IExpression {
    id: IIdentifierExpression;
    body: IExpression;
}
export interface IIdentifierExpression extends IExpression {
    root: IToken;
    parts: IToken[];
}
export interface IFunctionDeclarationExpression extends IExpression {
    id: IIdentifierExpression;
    parameters: IExpression[];
    body: IExpression;
    closure: IExpression[];
}
export interface IFunctionApplicationExpression extends IExpression {
    id: IIdentifierExpression;
    parameters: IExpression[];
}
export interface IUnaryExpression extends IExpression {
    expression: IExpression | IToken;
}
export interface IBinaryExpression extends IExpression {
    left: IExpression;
    operator: IToken;
    right: IExpression;
}

// export interface ITypeDeclaration extends IExpression {
//     name: IToken;
//     extensions: IIdentifierExpression[];
//     fields: IFieldDeclaration[];
// }
// export interface IFieldDeclaration extends IExpression {
//     name: IToken;
//     fieldType: IIdentifierExpression;
//     restrictions: IExpression[];
// }

export interface IEmptyParamsExpression extends IExpression { }

export class Expression implements IExpression {
    kind: ExpressionKind;
    _kind: string;
    type: Types;
    _type: string;

    constructor(e: IExpression) {
        this.kind = e.kind;
        this._kind = ExpressionKind[this.kind];
        this.type = e.type;
        this._type = Types[e.type];

        Object.keys(e).forEach(key => {
            var value = e[key];
            if ((value.kind || value.kind == 0) && value.lineStart !== 0 && !value.lineStart) {
                this[key] = new Expression(value);
            }
            else if (value.lineStart >= 0) {
                this[key] = new Token(value);
            }
            else if (Array.isArray(value)) {
                this[key] = value.map(v => new Expression(v));
            }
            else {
                this[key] = value;
            }
        });
    }
}

export class Token implements IToken {
    value: string;
    line: number;
    lineStart: number;
    lineEnd: number;
    fileStart: number;
    fileEnd: number;
    kind: SyntaxKind;
    _kind: string;
    /**
     *
     */
    constructor(t: IToken) {
        Object.keys(t).forEach(key => {
            this[key] = t[key];
        });
        this._kind = SyntaxKind[this.kind];
    }
}

export enum Types {
    Number,
    String,
    Boolean,
    Date,
    DateTime,
    Time,
    Undefined
}