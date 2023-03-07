/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import Fastify from "fastify"
import process from "node:process"
import { serverConfig } from "#src/app/config/serverConfig.mjs"
import { routes } from "#src/app/routes.mjs"

export const Server = {
  plugins: [routes],

  /** @type {function (): T.Fastify} */
  new() {
    const server = Fastify({
      logger: true,
    })

    for (const plugin of this.plugins) {
      server.register(plugin)
    }

    return server
  },

  /** @type {function (T.Fastify)} */
  start(server) {
    server.listen(serverConfig, (err) => {
      if (err) {
        server.log.error(err)
        process.exit(1)
      }
    })
  },
}
