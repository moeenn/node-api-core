/* eslint-disable-next-line no-unused-vars */
import jsonSchema from "json-schema-to-ts"

/** @typedef {import("fastify").RouteOptions} RouteOptions */
import { authConfig } from "#src/app/config/authConfig.mjs"
import { db } from "#src/core/database/index.mjs"
import {
  AuthException,
  BadRequestException,
} from "#src/core/exceptions/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: authConfig.password.minLength },
  },
  required: ["email", "password"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
export const login = {
  url: "/login",
  method: "POST",
  config: {
    rateLimit: {
      max: 10,
      timeWindow: 1000 * 60 /* 1 minute */,
    },
  },
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {Body} */ (req.body)

    const user = await db.user.findFirst({
      where: {
        email: body.email,
      },
      include: {
        password: true,
      },
    })

    if (!user) {
      logger.warn({ email: body.email }, "login against non-existent user")
      throw AuthException("Invalid email or password")
    }

    if (!user.password) {
      logger.info(
        { email: body.email },
        "failed login against non-configured account",
      )
      throw BadRequestException("Account not configured")
    }

    if (!user.approved) {
      logger.info(
        { email: body.email },
        "failed login against disabled account",
      )
      throw BadRequestException("User account disabled by admin")
    }

    /** validate the actual password */
    const isValid = await Password.verify(user.password.hash, body.password)
    if (!isValid) {
      logger.warn({ email: body.email }, "invalid login password")
      throw AuthException("Invalid email or password")
    }

    const token = await AuthService.generateLoginAuthToken(user.id, user.role)

    return {
      message: "Login successful",
      user: Object.assign(user, { password: undefined }),
      token,
    }
  },
}
