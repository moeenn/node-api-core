import { authConfig } from "#src/app/config/authConfig.mjs"
import { db } from "#src/core/database/index.mjs"
import { AuthException, BadRequestException } from "#src/core/exceptions/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { validateToken } from "#src/core/server/middleware/index.mjs"
/** @typedef {import("fastify").RouteOptions} RouteOptions */
import jsonSchema from "json-schema-to-ts"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    password: { type: "string", minLength: authConfig.password.minLength },
    confirmPassword: {
      type: "string",
      minLength: authConfig.password.minLength,
    },
  },
  required: ["password", "confirmPassword"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
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
    const body = /** @type {Body} */ (req.body)
    const userId = req.requestContext.get("userId")

    if (body.password !== body.confirmPassword) {
      throw BadRequestException("Password confirmation failed")
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      logger.error({ userId }, "non-existent user id in json token")
      throw AuthException("Cannot update user password")
    }

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
