/** @typedef {import("fastify").RouteOptions} RouteOptions */
import { validateToken, hasRole } from "#src/core/server/middleware/index.mjs"
import { UserRole } from "@prisma/client"
import { HealthCheckService } from "#src/core/services/healthCheckService.mjs"

/** @type {RouteOptions} */
export const memoryUsage = {
  url: "/health-check/memory",
  method: "GET",
  preValidation: [validateToken, hasRole(UserRole.ADMIN)],
  handler: async () => {
    return await HealthCheckService.memoryUsage()
  },
}
