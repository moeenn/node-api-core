import { Server } from "#src/core/server/index.mjs"

/**
 *  entry-point function for the application
 *  @returns {void}
 */
function main() {
  const server = Server.new()
  Server.start(server)
}

main()
