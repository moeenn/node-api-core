import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"
import { RouteOptions } from "fastify"

/** @type {RouteOptions} */
export const getUserProfile = {
  url: "/user/profile",
  method: "GET",
  preValidation: [validateToken],
  handler: async (req) => {
    const userId = /** @type {string} */ (req.requestContext.get("userId"))
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      logger.error({ userId }, "non-existent userId in json token")
      throw AuthException("Cannot view profile")
    }

    return user
  },
}