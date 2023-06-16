import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"
import { requestMeta } from "#src/core/helpers/requestMeta.mjs"
import { bodySchema } from "./updateUserProfile.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const updateUserProfile = {
  url: "/user/profile",
  method: "PUT",
  preValidation: [validateToken],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("./updateUserProfile.schema.mjs").Body} */ (
      req.body
    )
    const { userId } = requestMeta(req)

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user)
      throw AuthException("Cannot update user profile", {
        userId,
        message: "non-existent user in json token",
      })

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
