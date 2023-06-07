import { HealthCheckService } from "#src/core/services/healthCheckService.mjs"

/** @type {import("fastify").RouteOptions} */
export const healthCheck = {
  url: "/health-check",
  method: "GET",
  handler: async () => {
    return await HealthCheckService.healthcheck()
  },
}
