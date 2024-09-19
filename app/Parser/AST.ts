import { Token } from "./Token";
import { BulkTokenType } from "./TokenFactory";

export interface IASTNode {

}

class CompositeNode implements IASTNode {
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

}
