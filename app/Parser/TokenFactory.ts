import { ITokenFactory } from "./ITokenFactory"
import { Token } from "./Token";

export enum BulkTokenType {
    Echo,
    Argument,
    Ping,
    Set,
    Get,
    Px,
    Array,
};

type TokenPattern = {
    pattern: RegExp;
    symbol: BulkTokenType;
};

const tokensPatterns: TokenPattern[] = [
    { pattern: /^(\*(\d+)\r\n).*/, symbol: BulkTokenType.Array },
    { pattern: /^(\$\d+\r\n(Echo)\r\n).*/i, symbol: BulkTokenType.Echo },
    { pattern: /^(\$\d+\r\n(Ping)\r\n).*/i, symbol: BulkTokenType.Ping },
    { pattern: /^(\$\d+\r\n(Get)\r\n).*/i, symbol: BulkTokenType.Get },
    { pattern: /^(\$\d+\r\n(Set)\r\n).*/i, symbol: BulkTokenType.Set },
    { pattern: /^(\$\d+\r\n(Px)\r\n).*/i, symbol: BulkTokenType.Px },
    { pattern: /^(\$\d+\r\n(\w+)\r\n).*/i, symbol: BulkTokenType.Argument },
];

export class BulkTokenFactory implements ITokenFactory {

    constructor() { }

    createToken(text: string): Token {
        const token: Token | null = tokensPatterns.reduce(
            (ret: Token | null, item: TokenPattern): Token | null => {
                // if already found a match just skip the next symbol
                if (ret !== null) {
                    return ret;
                }

                // if the symbol does not match skip to the next symbol
                if (!item.pattern.test(text)) {
                    return ret;
                }

                // get the value in the string matched by the symbol
                const matching_symbol = text.match(item.pattern);
                // expect at least one match
                if (matching_symbol === null || matching_symbol.length < 3) {
                    throw new Error("the matching symbol does not capture any value");
                }
                return {
                    type: item.symbol,
                    value: matching_symbol[2],
                    size: matching_symbol[1].length
                }
            }, null);
        if (token === null) {
            throw new Error("Token unknown for parsing");
        }
        return token;
    }
}