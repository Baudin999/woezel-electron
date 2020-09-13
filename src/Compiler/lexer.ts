interface IToken {
    value: string;
    start: number;
    end: number;
    type: TokenKind;
}

class Token implements IToken {
    value: string;
    start: number;
    end: number;
    type: TokenKind;

    toString() {
        return TokenKind[this.type];
        // var r = { ...this, type: TokenKind[this.type] };
        // console.log(r)
        // return JSON.stringify(r);
    }

}

enum TokenKind {
    Word,
    Number,
    Whitespace,
    EndStatement,
    Operator
}


export function lex(code: string) {
    let index = 0;
    let max = code.length;
    let tokens: Token[] = [];
    let value = '';
    let pos = index;
    let c: string;


    let _current = () => code[index];
    let _next = () => code[index + 1];
    let _at = (n: number) => code[index + n];
    let _consume = (tk: TokenKind = TokenKind.Word) => {
        if (value && value.length > 0) {
            tokens.push({ value, start: pos, end: index - 1, type: tk });
            value = '';
            pos = index;
        }
    }
    let _consumeWord = () => {
        do {
            value += _current();
            index++;
        } while (isLetter(_current()));

        tokens.push({ value, start: pos, end: index - 1, type: TokenKind.Word });
        pos = index;
        value = '';
    }
    let _consumeNumber = () => {
        do {
            value += _current();
            index++;
        } while (isNumber(_current()));

        tokens.push({ value, start: pos, end: index - 1, type: TokenKind.Number });
        pos = index;
        value = '';
    }
    let _consumeWhitespace = () => {
        do {
            value += _current();
            index++;
        } while (isWhitespace(_current()));

        tokens.push({ value, start: pos, end: index - 1, type: TokenKind.Whitespace });
        pos = index;
        value = '';
    }
    let _consumeEndStatement = () => {
        tokens.push({ value: c, start: pos, end: index - 1, type: TokenKind.EndStatement });
        pos = index;
        value = '';
    }
    let _consumeOperator = () => {
        tokens.push({ value: c, start: pos, end: index - 1, type: TokenKind.Operator });
        pos = index;
        value = '';
    }

    while (c = _current()) {
        if (isWhitespace(c)) {
            _consumeWhitespace();
        }
        else if (c == ';') {
            _consumeEndStatement();
        }
        else if (isLetter(c)) {
            _consumeWord();
        }
        else if (isOperator(c)) {
            _consumeOperator();
        }
        else if (isNumber(c)) {
            _consumeNumber();
        }
        else {
            throw `Unknown token exception: ${c}`;
        }
        index++;
    }
    // _consume();


    return tokens;
}

function isLetter(c) {
    return !!c.match(/[a-z]/i);
}

function isNumber(c) {
    return !!c.match(/\d|\./i);
}

function isWhitespace(c) {
    return c == ' ';
}

const operators = ['!', '=', '>', '<', '%', '-', '+'];
function isOperator(c) {
    return operators.indexOf(c) > -1;
}


