import { Server } from "#src/core/server/index.mjs"

async function main() {
  const server = Server.new()
  Server.start(server)
}

/* eslint-disable-next-line no-console */
main().catch(console.error)
