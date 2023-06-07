import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"
import { requestMeta} from "#src/core/helpers/requestMeta.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
})

/** @type {import("fastify").RouteOptions} */
export const updateUserProfile = {
  url: "/user/profile",
  method: "PUT",
  preValidation: [validateToken],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("json-schema-to-ts").FromSchema<typeof bodySchema>} */ (req.body)
    const { userId } = requestMeta(req)

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
      },
    })

    return {
      message: "User profile updated successfully",
      profile: updatedUser,
    }
  },
}
