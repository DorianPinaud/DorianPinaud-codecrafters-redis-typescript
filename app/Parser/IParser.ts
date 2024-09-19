import { IASTNode } from "./AST"

export interface IParser {
    consume: (text: string) => IASTNode
}