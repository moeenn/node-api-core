/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import Fastify from "fastify"
import process from "node:process"
import { serverConfig } from "#src/app/config/serverConfig.mjs"
import { routes } from "#src/app/routes.mjs"
import {
  rateLimitPlugin,
  requestContextPlugin,
} from "#src/core/plugins/index.mjs"

export const Server = {
  /** @type {function (): T.Fastify} */
  new() {
    const server = Fastify({
      logger: true,
    })

    /** register all plugins */
    server
      .register(rateLimitPlugin.plug, rateLimitPlugin.options)
      .register(requestContextPlugin.plug, requestContextPlugin.options)
      .register(routes)

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
