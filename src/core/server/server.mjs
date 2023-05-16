import fastify from "fastify"
import { fastifyRequestContextPlugin } from "@fastify/request-context"
import ajvFormats from "ajv-formats"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import rateLimit from "@fastify/rate-limit"
import {
  routesPlugin,
  rateLimitPluginOptions,
  requestContextPluginOptions,
} from "./plugins/index.mjs"
import { serverConfig } from "#src/app/config/serverConfig.mjs"
import process from "node:process"

export const Server = {
  /** @typedef {import("fastify").FastifyInstance} FastifyInstance */

  /** @returns {FastifyInstance} */
  new() {
    /* disable request logging during testing */
    const app = fastify({
      logger: process.env.NODE_ENV !== "test",
      ajv: {
        plugins: [
          ajvFormats /** See: https://ajv.js.org/packages/ajv-formats.html */,
        ],
      },
    })

    /* register all plugins */
    app
      .register(cors)
      .register(helmet, { global: true })
      .register(rateLimit, rateLimitPluginOptions)
      .register(fastifyRequestContextPlugin, requestContextPluginOptions)
      .register(routesPlugin.plug(), { prefix: serverConfig.apiPrefix })

    return app
  },

  /** @param {FastifyInstance} app */
  start(app) {
    app.listen(serverConfig, (err) => {
      if (err) {
        app.log.error(err)
        process.exit(1)
      }
    })
  },
}
