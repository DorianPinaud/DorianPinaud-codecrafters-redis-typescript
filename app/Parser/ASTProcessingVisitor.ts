import { assert } from "console";
import { CompositeNode, CommandNode, CommandArgumentNode, CommandType } from "./AST";
import { IASTVisitor } from "./IASTVisitor";

function encodesBulkString(str: string): string {
    return `$${str.length}\r\n${str}\r\n`
}

export class ASTProcessingVisitor implements IASTVisitor {

    database: Map<string, string>

    constructor(database: Map<string, string>) {
        this.database = database;
    }

    visitCompositeNode(node: CompositeNode): string {
        throw new Error("Not implemented");
    }

    visitCommandNode(node: CommandNode, childrenVisited: Array<string>): string {
        switch (node.commandType) {
            case CommandType.PING:
                return encodesBulkString("PONG")
            case CommandType.ECHO:
                if (childrenVisited.length < 1) {
                    throw new Error("The echo command must have at least have one argument")
                }
                const arg = childrenVisited[0];
                return encodesBulkString(arg);
            case CommandType.GET:
                {
                    if (childrenVisited.length < 1) {
                        throw new Error("The Get command must have at least have one argument")
                    }
                    const key = childrenVisited[0];
                    const value = this.database.get(key);
                    return value !== undefined ? encodesBulkString(value) : "$-1\r\n";
                }
            case CommandType.SET:
                {
                    if (childrenVisited.length < 2) {
                        throw new Error("The Get command must have at least have two argument")
                    }
                    const key = childrenVisited[0];
                    const value = childrenVisited[1];
                    this.database.set(key, value);
                    return encodesBulkString("OK");
                }

        }
    }

    visitCommandArgumentNode(node: CommandArgumentNode): string {
        return node.data;
    }
}