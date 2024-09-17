import * as net from "net";
import { Lexer, Token, ITokenFactory, TokenFactory } from "./BulkParser/Lexer"

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

function encodesBulkString(str: string): string {
    return `$${str.length}\r\n${str}\r\n`
}

function splitBulkString(str: string): string[] {
    const regex: RegExp = /^\*\d+|[a-zA-Z]+$/gm;
    const search = str.match(regex)
    if (search === null) {
        return [str];
    }
    else {
        return search.slice(1);
    }
}

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
    // Handle connection
    connection.on("data", (data: ArrayBuffer) => {


        const decoder = new TextDecoder()
        const string_data: string = decoder.decode(data)

        const factory = new TokenFactory();
        const lexer = new Lexer(factory);
        const tokens = lexer.consume(string_data);

        const array_data = splitBulkString(string_data)
        console.log(array_data)
        if (array_data[0].toUpperCase() === "ECHO" && array_data.length === 2) {
            connection.write(encodesBulkString(array_data[1]));
        }
        if (array_data[0].toUpperCase() == "PING") {
            connection.write(encodesBulkString("PONG"))
        }
    });
});

server.listen(6379, "127.0.0.1");
