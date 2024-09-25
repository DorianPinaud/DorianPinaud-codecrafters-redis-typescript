import { tmpdir } from "os"
import { join } from "path"


export class Config {

    dirPath: string
    dbFilename: string

    constructor(argv: string[]) {
        this.dirPath = argv[argv.findIndex((a) => a === "--dir") + 1]
        this.dbFilename = argv[argv.findIndex((a) => a === "--dbfilename") + 1]
    }
}