/** @typedef {import("fastify").RouteOptions} RouteOptions */
import { db } from "#src/core/database/index.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"

/* eslint-disable-next-line no-unused-vars */
import jsonSchema from "json-schema-to-ts"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    name: { type: "string" },
    phone: { type: "string" }, // optional
  },
  required: ["name"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
export const updateUserProfile = {
  url: "/user/profile",
  method: "PUT",
  preValidation: [validateToken],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {Body} */ (req.body)
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
