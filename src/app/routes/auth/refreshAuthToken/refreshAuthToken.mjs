import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
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
    const error = "Cannot refresh auth token"

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      const details = {
        userId,
        message: "trying to refresh auth token for non-existent user",
      }
      throw AuthException(error, details)
    }

    if (!user.approved) {
      const details = {
        userId,
        message: "disabled user tried to refresh auth token",
      }
      throw AuthException(error, details)
    }

    const token = await AuthService.generateLoginToken(user.id, user.role)
    return token
  },
}
