import { Token } from "./Token"
import { BulkTokenType } from "./TokenFactory"
import { IASTNode } from "../AST/AST"
import { ASTBuilder } from "../AST/ASTBuilder"
import { IParser } from "./IParser"
import { ILexer } from "./ILexer"

export class Parser implements IParser {

    lexer: ILexer

    constructor(lexer: ILexer) {
        this.lexer = lexer
    }

    consume(text: string): IASTNode {
        let tokens = this.lexer.consume(text);
        if (tokens.length === 0 && tokens[0].type !== BulkTokenType.Array) {
            throw new Error("The first token must be an Array");
        }
        tokens = tokens.slice(1)

        if (tokens.length == 0) {
            throw new Error("A command must have a token defines");
        }
        const tokenCommand = tokens[0];
        tokens = tokens.slice(1);

        switch (tokenCommand.type) {
            case BulkTokenType.Ping:
                return new ASTBuilder().createPingCommand().build();
            case BulkTokenType.Echo:
                if (tokens.length == 0 && tokens[0].type == BulkTokenType.Argument) {
                    throw new Error("Echo must have an argument");
                }
                return new ASTBuilder().createEchoCommand(tokens[0].value).build();
            case BulkTokenType.Get:
                if (tokens.length == 0 && tokens[0].type == BulkTokenType.Argument) {
                    throw new Error("Get must have an argument");
                }
                return new ASTBuilder().createGetCommand(tokens[0].value).build();

            case BulkTokenType.Set:
                if (tokens.length < 2 && tokens[0].type != BulkTokenType.Argument && tokens[1].type != BulkTokenType.Argument) {
                    throw new Error("Set must have two arguments");
                }
                let getBuilder = new ASTBuilder().createSetCommand(tokens[0].value, tokens[1].value);
                if (tokens.length == 4 && tokens[2].type == BulkTokenType.Px && tokens[3].type == BulkTokenType.Argument) {
                    getBuilder.addExpiry(tokens[0].value, Number(tokens[3].value));
                }
                return getBuilder.build();
            case BulkTokenType.ConfigGet:
                if (tokens.length < 1 && tokens[0].type != BulkTokenType.Argument) {
                    throw new Error("Get Config must have one argument");
                }
                return new ASTBuilder().createConfigGetCommand(tokens[0].value).build();
        }

        throw new Error("the Tokens parsed are not corrected");
    }

}