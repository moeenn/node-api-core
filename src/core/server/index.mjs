/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import Fastify from "fastify"
import process from "node:process"
import { fastifyRequestContextPlugin } from "@fastify/request-context"
import { requestContextPlugin } from "#src/core/plugins/requestContextPlugin.mjs"
import { serverConfig } from "#src/app/config/serverConfig.mjs"
import { routes } from "#src/app/routes.mjs"

export const Server = {
  /** @type {function (): T.Fastify} */
  new() {
    const server = Fastify({
      logger: true,
    })

    /** register all plugins */
    server
      .register(fastifyRequestContextPlugin, requestContextPlugin.options)
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
