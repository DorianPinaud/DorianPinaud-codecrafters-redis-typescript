import { CommandEchoNode, CommandConfigGetNode, CommandGetNode, CommandPingNode, CommandPxNode, CommandSetNode, CompositeNode } from "./AST";

export interface IASTVisitor {

    visitPingNode(node: CommandPingNode): void;
    visitEchoNode(node: CommandEchoNode): void;
    visitGetNode(node: CommandGetNode): void;
    visitSetNode(node: CommandSetNode): void;
    visitExpiryNode(node: CommandPxNode): void;
    visitConfigGetNode(node: CommandConfigGetNode): void;
}