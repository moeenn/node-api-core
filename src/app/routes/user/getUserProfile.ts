import { db } from "@/core/database"
import { AuthException } from "@/core/exceptions"
import { logger } from "@/core/server/logger"
import { validateToken } from "@/core/server/middleware"
import { RouteOptions } from "fastify"

export const getUserProfile: RouteOptions = {
  url: "/user/profile",
  method: "GET",
  preValidation: [validateToken],
  handler: async (req) => {
    const userId = req.requestContext.get("userId") as string
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
