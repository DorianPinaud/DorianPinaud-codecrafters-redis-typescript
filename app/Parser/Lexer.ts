import { ITokenFactory } from "./ITokenFactory"
import { Token } from "./Token";
import { ILexer } from "./ILexer";

export class Lexer implements ILexer {
    factory: ITokenFactory;

    constructor(factory: ITokenFactory) {
        this.factory = factory
    }

    consume(stream: string): Array<Token> {
        let ret: Array<Token> = [];
        while (stream.length > 0) {
            const token = this.factory.createToken(stream);
            ret.push(token);
            stream = stream.slice(token.size);
        }
        return ret;
    }

}