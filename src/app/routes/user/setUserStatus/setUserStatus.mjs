import { validateToken, hasRole } from "#src/core/server/middleware/index.mjs"
import { UserRole } from "@prisma/client"
import { db } from "#src/core/database/index.mjs"
import { BadRequestException } from "#src/core/exceptions/index.mjs"
import { bodySchema } from "./setUserStatus.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const setUserStatus = {
  url: "/user/set-status",
  method: "POST",
  preValidation: [validateToken, hasRole(UserRole.ADMIN)],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("./setUserStatus.schema.mjs").Body} */ (
      req.body
    )

    const user = await db.user.findFirst({
      where: {
        id: body.userId,
      },
    })

    if (!user)
      throw BadRequestException("Invalid user id", {
        userId: body.userId,
        message: "request to set account status for non-existent user",
      })

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
