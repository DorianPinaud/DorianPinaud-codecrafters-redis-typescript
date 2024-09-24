import { IASTVisitor } from "./IASTVisitor";

export interface IASTNode {

    process(visitor: IASTVisitor): void

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

    process(visitor: IASTVisitor): void {
        this.children.map((node: IASTNode): void => node.process(visitor));
    }
}

export class CommandPingNode implements IASTNode {

    process(visitor: IASTVisitor): void {
        visitor.visitPingNode(this);
    }

}

export class CommandEchoNode implements IASTNode {

    arg: string

    constructor(arg: string) {
        this.arg = arg
    }

    process(visitor: IASTVisitor): void {
        visitor.visitEchoNode(this);
    }

}

export class CommandGetNode implements IASTNode {

    key: string

    constructor(key: string) {
        this.key = key
    }

    process(visitor: IASTVisitor): void {
        visitor.visitGetNode(this);
    }

}

export class CommandSetNode extends CompositeNode {

    key: string
    value: string

    constructor(key: string, value: string) {
        super()
        this.key = key
        this.value = value
    }

    process(visitor: IASTVisitor): void {
        visitor.visitSetNode(this);
        super.process(visitor);
    }

}

export class CommandPxNode implements IASTNode {

    key: string;
    time: number;

    constructor(key: string, arg: number) {
        this.key = key;
        this.time = arg
    }

    process(visitor: IASTVisitor): void {
        visitor.visitExpiryNode(this);
    }

}