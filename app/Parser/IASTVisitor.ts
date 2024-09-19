import { CompositeNode, CommandNode, CommandArgumentNode } from "./AST";

export interface IASTVisitor {

    visitCompositeNode: (node: CompositeNode, childrenVisited: Array<string>) => string;
    visitCommandNode: (node: CommandNode, childrenVisited: Array<string>) => string
    visitCommandArgumentNode: (node: CommandArgumentNode) => string
}