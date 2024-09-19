import { IASTNode } from "./AST"


export class ASTBuilder {
    private rootNode: IASTNode | null

    constructor() {
        this.rootNode = null;
    }

    createGetCommand(key: string): ASTBuilder {
        return this;
    }

    createSetCommand(key: string, value: string): ASTBuilder {
        return this;
    }

    createEchoCommand(arg: string): ASTBuilder {
        return this;
    }

    createPingCommand() {
        return this;
    }


    build(): IASTNode {
        if (this.rootNode === null) {
            throw new Error("Impossible to build the AST Node without any configuration");
        }
        return this.rootNode;
    }

}