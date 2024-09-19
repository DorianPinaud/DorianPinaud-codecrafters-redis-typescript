import { Token } from "./Token"
import { BulkTokenType } from "./TokenFactory"
import { IASTNode } from "./AST"
import { ASTBuilder } from "./ASTBuilder"
import { IParser } from "./IParser"
import { ILexer } from "./ILexer"

export class Parser implements IParser {

    lexer: ILexer

    constructor(lexer: ILexer) {
        this.lexer = lexer
    }

    consume(text: string): IASTNode {
        const tokens: Array<Token> = this.lexer.consume(text).filter((token) => token.type == BulkTokenType.Element);

        if (tokens.length == 0) {
            throw new Error("At least one token command must be present");
        }
        const commandType = tokens[0].value.toUpperCase()
        switch (commandType) {
            case "PING":
                return new ASTBuilder().createPingCommand().build()
            case "ECHO":
                if (tokens.length < 2) {
                    throw new Error("Not enough argument for echo command")
                }
                return new ASTBuilder().createEchoCommand(tokens[1].value).build()
            case "GET":
                if (tokens.length < 2) {
                    throw new Error("Not enough argument for get command")
                }
                return new ASTBuilder().createGetCommand(tokens[1].value).build()
            case "SET":
                if (tokens.length < 3) {
                    throw new Error("Not enough argument for set command")
                }
                return new ASTBuilder().createSetCommand(tokens[1].value, tokens[2].value).build()
        }
        throw new Error("No define commands has been detected");
    }

}