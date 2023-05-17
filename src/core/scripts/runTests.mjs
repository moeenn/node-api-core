import { run } from "node:test"
import path from "node:path"
import process from "node:process"

run({ files: [path.resolve("./src/core/helpers/")], concurrency: 1 })
