import { IASTVisitor } from "./IASTVisitor"

export interface IASTNode {

    process: (visitor: IASTVisitor) => string

}

export class CompositeNode implements IASTNode {
    private children: Array<IASTNode>

    constructor() {
        this.children = new Array<IASTNode>;
    }

    add(node: IASTNode): void {
        this.children.push(node);
    }

    getChildren(): Array<IASTNode> {
        return this.children
    }

    process(visitor: IASTVisitor): string {
        return visitor.visitCompositeNode(this, this.children.map((node: IASTNode): string => node.process(visitor)));
    }
}

export enum CommandType {
    ECHO,
    PING,
    GET,
    SET
};

export class CommandNode extends CompositeNode {
    commandType: CommandType;

    constructor(commandType: CommandType) {
        super()
        this.commandType = commandType;
    }

    process(visitor: IASTVisitor): string {
        return visitor.visitCommandNode(this, this.getChildren().map((node: IASTNode): string => node.process(visitor)));
    }
};

export enum CommandArgumentType {
    Value,
    Key
}

export class CommandArgumentNode implements IASTNode {
    commandArgType: CommandArgumentType;
    data: string

    constructor(data: string, commandArgType: CommandArgumentType) {
        this.data = data;
        this.commandArgType = commandArgType;
    }

    process(visitor: IASTVisitor): string {
        return visitor.visitCommandArgumentNode(this);
    }

}
