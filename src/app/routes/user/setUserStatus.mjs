/** @typedef {import("fastify").RouteOptions} RouteOptions */
import { validateToken, hasRole } from "#src/core/server/middleware/index.mjs"
import { UserRole } from "@prisma/client"
import jsonSchema from "json-schema-to-ts"
import { db } from "#src/core/database/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { BadRequestException } from "#src/core/exceptions/index.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    userId: { type: "string", format: "uuid" },
    status: { type: "boolean" },
  },
  required: ["userId", "status"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
export const setUserStatus = {
  url: "/user/set-status",
  method: "POST",
  preValidation: [validateToken, hasRole(UserRole.ADMIN)],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {Body} */ (req.body)

    const user = await db.user.findFirst({
      where: {
        id: body.userId,
      },
    })

    if (!user) {
      logger.warn(
        { userId: body.userId },
        "request to set account status for non-existent user",
      )
      throw BadRequestException("Invalid user id")
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        approved: body.status,
      },
    })

    return {
      message: "User account status updated successfully",
      updatedStatus: body.status,
    }
  },
}
