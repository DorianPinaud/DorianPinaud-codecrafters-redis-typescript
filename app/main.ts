import * as net from "net";
import { BulkTokenFactory } from "./Parser/TokenFactory"
import { Lexer } from "./Parser/Lexer";
import { Parser } from "./Parser/Parser";
import { ASTProcessingVisitor } from "./Parser/ASTProcessingVisitor"

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    // Handle connection
    let database = new Map<string, string>();
    connection.on("data", (data: ArrayBuffer) => {


        const decoder = new TextDecoder()
        const string_data: string = decoder.decode(data)

        const factory = new BulkTokenFactory();
        const lexer = new Lexer(factory);
        const parser = new Parser(lexer);
        const AST = parser.consume(string_data);
        connection.write(AST.process(new ASTProcessingVisitor(database)));
    });
});

server.listen(6379, "127.0.0.1");
