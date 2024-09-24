import { CommandEchoNode, CommandGetNode, CommandPingNode, CommandPxNode, CommandSetNode, CompositeNode, IASTNode, } from "./AST"

type RootNode = IASTNode | CompositeNode | null;

export class ASTBuilder {
    private rootNode: RootNode;

    constructor() {
        this.rootNode = null;
    }

    createGetCommand(key: string): ASTBuilder {
        this.rootNode = new CommandGetNode(key);
        return this;
    }

    addExpiry(key: string, time: number): ASTBuilder {
        if (this.rootNode === null || !(this.rootNode instanceof CompositeNode)) {
            throw new Error("Impossible to build the Expiry Node without any root composite node");
        }
        this.rootNode.add(new CommandPxNode(key, time));
        return this;
    }

    createSetCommand(key: string, value: string): ASTBuilder {
        this.rootNode = new CommandSetNode(key, value);
        return this;
    }

    createEchoCommand(arg: string): ASTBuilder {
        this.rootNode = new CommandEchoNode(arg);
        return this;
    }

    createPingCommand() {
        this.rootNode = new CommandPingNode();
        return this;
    }


    build(): IASTNode {
        if (this.rootNode === null) {
            throw new Error("Impossible to build the AST Node without any configuration");
        }
        return this.rootNode;
    }

}