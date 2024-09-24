import { tmpdir } from "os"
import { join } from "path"


class Config {

    dirPath: string
    dbFilename: string

    constructor() {
        this.dirPath = join(tmpdir(), "redis-files")
        this.dbFilename = "dump.rdb"
    }
}