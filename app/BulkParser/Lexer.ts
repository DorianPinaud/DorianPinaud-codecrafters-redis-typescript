enum TokenType {
    IntegerSymbol,
    IntegerPositive,
    IntegerNegative,
    IntegerNumber,
    LengthSymbol,
    ReturnLine,
    String,
    ArraySymbol,
    InvalidParsingSymbol
};

export type Token = {
    type: TokenType;
    value: string;
};

type TokenPattern = {
    pattern: RegExp;
    symbol: TokenType;
};

const tokensPatterns: TokenPattern[] = [
    { pattern: /^(\:).*/, symbol: TokenType.IntegerSymbol },
    { pattern: /^(\+).*/, symbol: TokenType.IntegerPositive },
    { pattern: /^(\-).*/, symbol: TokenType.IntegerPositive },
    { pattern: /^(\$).*/, symbol: TokenType.LengthSymbol },
    { pattern: /^(\*).*/, symbol: TokenType.ArraySymbol },
    { pattern: /^(\r\n).*/, symbol: TokenType.ReturnLine },
    { pattern: /^(\d+).*/, symbol: TokenType.IntegerNumber },
    { pattern: /^(\w+).*/, symbol: TokenType.String },
];

export interface ITokenFactory {
    createToken(text: string): Token
}

export class TokenFactory implements ITokenFactory {

    constructor() { }

    createToken(text: string): Token {
        return tokensPatterns.reduce((ret: Token, item: TokenPattern): Token => {
            // if already found a match just skip the next symbol
            if (ret.type !== TokenType.InvalidParsingSymbol) {
                return ret;
            }

            // if the symbol does not match skip to the next symbol
            if (!item.pattern.test(text)) {
                return ret;
            }

            // get the value in the string matched by the symbol
            const matching_symbol = text.match(item.pattern);
            // expect at least one match
            if (matching_symbol === null || matching_symbol.length < 2) {
                return { type: TokenType.InvalidParsingSymbol, value: "the matching symbol does not capture any value" }
            }
            return {
                type: item.symbol,
                value: matching_symbol[1]
            }
        }, { type: TokenType.InvalidParsingSymbol, value: "No symbol has matched" })
    }
}

export class Lexer {
    factory: ITokenFactory;

    constructor(factory: ITokenFactory) {
        this.factory = factory
    }

    consume(stream: string): Array<Token> {
        let ret: Array<Token> = [];
        while (stream.length > 0) {
            const token = this.factory.createToken(stream);
            ret.push(token);
            if (token.type == TokenType.InvalidParsingSymbol) {
                return ret;
            }
            stream = stream.slice(token.value.length);
        }
        return ret;
    }

}