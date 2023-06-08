import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { validateToken } from "#src/core/server/middleware/validateToken.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { requestMeta } from "#src/core/helpers/requestMeta.mjs"

/** @type {import("fastify").RouteOptions} */
export const refreshAuthToken = {
  url: "/auth/refresh-auth-token",
  method: "GET",
  preValidation: [validateToken],
  handler: async (req) => {
    const { userId } = requestMeta(req)
    const error = AuthException("Cannot refresh auth token")

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      logger.warn(
        { userId },
        "trying to refresh auth token for non-existent user",
      )
      throw error
    }

    if (!user.approved) {
      logger.warn({ userId }, "disabled user tried to refresh auth token")
      throw error
    }

    const token = await AuthService.generateLoginToken(user.id, user.role)
    return token
  },
}
