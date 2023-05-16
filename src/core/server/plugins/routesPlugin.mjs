/** @typedef {import("fastify").FastifyInstance} FastifyInstance */
import { routes } from "#src/app/routes/index.mjs"

export const routesPlugin = {
  plug() {
    /** @param {FastifyInstance} app */
    const plugin = async (app) => {
      for (const route of routes) {
        app.route(route)
      }
    }

    return plugin
  },
}
