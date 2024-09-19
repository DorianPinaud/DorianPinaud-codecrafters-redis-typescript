import { Token } from "./Token";

export interface ILexer {
    consume: (stream: string) => Array<Token>
}