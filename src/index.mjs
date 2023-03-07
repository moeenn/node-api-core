import { Server } from "#src/core/server/index.mjs"

/** @type {function(): void} */
function main() {
  const server = Server.new()
  Server.start(server)
}

main()
