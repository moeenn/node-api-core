import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"
import { requestMeta } from "#src/core/helpers/requestMeta.mjs"

/** @type {import("fastify").RouteOptions} */
export const getUserProfile = {
  url: "/user/profile",
  method: "GET",
  preValidation: [validateToken],
  handler: async (req) => {
    const { userId } = requestMeta(req)

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user)
      throw AuthException("Cannot view profile", {
        userId,
        mesaage: "non-existent userId in json token",
      })

    return user
  },
}
