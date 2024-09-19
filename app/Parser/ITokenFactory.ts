import { Token } from "./Token"

export interface ITokenFactory {
    createToken(text: string): Token
}