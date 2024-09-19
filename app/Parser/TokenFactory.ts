import { ITokenFactory } from "./ITokenFactory"
import { Token } from "./Token";

export enum BulkTokenType {
    Element,
    Array,
};

type TokenPattern = {
    pattern: RegExp;
    symbol: BulkTokenType;
};

const tokensPatterns: TokenPattern[] = [
    { pattern: /^(\*(\d+)\r\n).*/, symbol: BulkTokenType.Array },
    { pattern: /^(\$\d+\r\n(.*)\r\n).*/, symbol: BulkTokenType.Element },
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