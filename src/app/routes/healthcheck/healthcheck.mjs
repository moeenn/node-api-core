import { RouteOptions } from "fastify"
import { HealthCheckService } from "#src/core/services/healthCheckService.mjs"

/** @type {RouteOptions} */
export const healthCheck = {
  url: "/health-check",
  method: "GET",
  handler: async () => {
    return await HealthCheckService.healthcheck()
  },
}
