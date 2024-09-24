import { IASTNode } from "../AST/AST"

export interface IParser {
    consume: (text: string) => IASTNode
}