import { db } from "#src/core/database/index.mjs"
import {
  AuthException,
  BadRequestException,
} from "#src/core/exceptions/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { requestMeta } from "#src/core/helpers/requestMeta.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"
import { bodySchema } from "./updatePassword.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const updatePassword = {
  url: "/user/update-password",
  method: "POST",
  config: {
    rateLimit: {
      max: 5,
      timeWindow: 1000 * 60 /* 1 minute */,
    },
  },
  preValidation: [validateToken],
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("./updatePassword.schema.mjs").Body} */ (
      req.body
    )
    const { userId } = requestMeta(req)

    if (body.password !== body.confirmPassword) {
      throw BadRequestException("Password confirmation failed")
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user)
      throw AuthException("Cannot update user password", {
        userId,
        message: "non-existent user id in json token",
      })

    const result = await Password.checkStrength(body.password)
    if (!result.strong) {
      throw BadRequestException("Please provide a stronger password")
    }

    await db.password.update({
      where: {
        userId: user.id,
      },
      data: {
        hash: await Password.hash(body.password),
      },
    })

    return {
      message: "Account password updated successfully",
    }
  },
}
