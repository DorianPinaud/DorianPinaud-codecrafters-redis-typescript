import { assert } from "console";
import { CommandEchoNode, CommandConfigGetNode as CommandConfigGetNode, CommandGetNode, CommandPingNode, CommandPxNode, CommandSetNode, CompositeNode } from "./AST";
import { IASTVisitor } from "./IASTVisitor";
import { Config } from "../Config";

function encodesBulkString(str: string): string {
    return `$${str.length}\r\n${str}\r\n`
}

export class ASTProcessingVisitor implements IASTVisitor {

    map: Map<string, string>;

    config: Config;

    private output: string;

    getOutput(): string { return this.output; }

    constructor(map: Map<string, string>, config: Config) {
        this.map = map;
        this.config = config;
        this.output = "";
    }

    visitPingNode(node: CommandPingNode): void { this.output = encodesBulkString("PONG"); }

    visitEchoNode(node: CommandEchoNode): void { this.output = encodesBulkString(node.arg); }

    visitGetNode(node: CommandGetNode): void {
        const value = this.map.get(node.key);
        this.output = value !== undefined ? encodesBulkString(value) : "$-1\r\n";
    }

    visitSetNode(node: CommandSetNode): void {
        this.map.set(node.key, node.value);
        this.output = encodesBulkString("OK");
    }

    visitExpiryNode(node: CommandPxNode): void {
        setTimeout(() => {
            this.map.delete(node.key)
        }, node.time);
    }

    visitConfigGetNode(node: CommandConfigGetNode): void {
        if (node.arg === "dir") {
            this.output = `*2\r\n${encodesBulkString("dir")}${encodesBulkString(this.config.dirPath)}`;
        } else if (node.arg === "dbfilename") {
            this.output = `*2\r\n${encodesBulkString("dbfilename")}${encodesBulkString(this.config.dbFilename)}`;
        } else {
            throw new Error("Failed to GET CONFIG parameters, expect dir or dbfilename");
        }
    }
}