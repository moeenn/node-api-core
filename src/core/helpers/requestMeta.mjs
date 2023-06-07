import { logger } from "#src/core/server/logger/index.mjs"

/**
 * Quickly read all request metadata
 *
 * @typedef {import("@prisma/client").UserRole} UserRole
 * @param {import("fastify").FastifyRequest} req
 * @returns {{ userId: string, userRole: UserRole }}
 */
export function requestMeta(req) {
  const userId = req.requestContext.get("userId")
  const userRole = req.requestContext.get("userRole")

  if (!userId || !userRole) {
    logger.error("Missing expected components in the verified JWT")
    throw new Error("Failed to process request")
  }

  return { userId, userRole }
}
