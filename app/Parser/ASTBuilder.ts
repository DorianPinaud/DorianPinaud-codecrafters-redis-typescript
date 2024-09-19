import { IASTNode, CommandNode, CommandType, CommandArgumentNode, CommandArgumentType } from "./AST"

export class ASTBuilder {
    private rootNode: IASTNode | null

    constructor() {
        this.rootNode = null;
    }

    createGetCommand(key: string): ASTBuilder {
        const getNode = new CommandNode(CommandType.GET);
        getNode.add(new CommandArgumentNode(key, CommandArgumentType.Key));
        this.rootNode = getNode;
        return this;
    }

    createSetCommand(key: string, value: string): ASTBuilder {
        const setNode = new CommandNode(CommandType.SET);
        setNode.add(new CommandArgumentNode(key, CommandArgumentType.Key));
        setNode.add(new CommandArgumentNode(value, CommandArgumentType.Value));
        this.rootNode = setNode;
        return this;
    }

    createEchoCommand(arg: string): ASTBuilder {
        const echoNode = new CommandNode(CommandType.ECHO);
        echoNode.add(new CommandArgumentNode(arg, CommandArgumentType.Value));
        this.rootNode = echoNode;
        return this;
    }

    createPingCommand() {
        this.rootNode = new CommandNode(CommandType.PING);
        return this;
    }


    build(): IASTNode {
        if (this.rootNode === null) {
            throw new Error("Impossible to build the AST Node without any configuration");
        }
        return this.rootNode;
    }

}