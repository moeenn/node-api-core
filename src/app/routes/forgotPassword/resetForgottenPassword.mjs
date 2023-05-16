/** @typedef {import("fastify").RouteOptions} RouteOptions */

/* eslint-disable-next-line no-unused-vars */
import jsonSchema from "json-schema-to-ts"
import { authConfig } from "#src/app/config/authConfig.mjs"
import {
  AuthException,
  BadRequestException,
} from "#src/core/exceptions/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    token: { type: "string" },
    password: { type: "string", minLength: authConfig.password.minLength },
    confirmPassword: {
      type: "string",
      minLength: authConfig.password.minLength,
    },
  },
  required: ["token", "password", "confirmPassword"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
export const resetForgottenPassword = {
  url: "/forgot-password/reset-password",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {Body} */ (req.body)

    if (body.password !== body.confirmPassword) {
      throw BadRequestException("Password confirmation failed")
    }

    const userId = await AuthService.validatePasswordResetToken(body.token)
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      logger.error({ userId }, "id of non-existent user in json token")
      throw AuthException("Cannot reset password")
    }

    const result = await Password.checkStrength(body.password)
    if (!result.strong) {
      throw BadRequestException("Please provide a stronger password")
    }

    const hash = await Password.hash(body.password)
    await db.password.upsert({
      where: {
        userId: user.id,
      },
      update: { hash },
      create: {
        userId: user.id,
        hash,
      },
    })

    return {
      message: "Password updated successfully",
    }
  },
}
