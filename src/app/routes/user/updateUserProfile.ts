import { db } from "@/core/database"
import { AuthException } from "@/core/exceptions"
import { logger } from "@/core/server/logger"
import { validateToken } from "@/core/server/middleware"
import { RouteOptions } from "fastify"
import { FromSchema } from "json-schema-to-ts"

const bodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    phone: { type: "string" }, // optional
  },
  required: ["name"],
  additionalProperties: false,
} as const

type Body = FromSchema<typeof bodySchema>

export const updateUserProfile: RouteOptions = {
  url: "/user/profile",
  method: "PUT",
  preValidation: [validateToken],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = req.body as Body
    const userId = req.requestContext.get("userId")

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      logger.error({ userId }, "non-existent user in json token")
      throw AuthException("Cannot update user profile")
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: body.name,
        phone: body.phone,
      },
    })

    return {
      message: "User profile updated successfully",
      profile: updatedUser,
    }
  },
}
