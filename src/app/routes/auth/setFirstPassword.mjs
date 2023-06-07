import { authConfig } from "#src/app/config/authConfig.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { BadRequestException } from "#src/core/exceptions/index.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    passwordToken: { type: "string" },
    password: { type: "string", minLength: authConfig.password.minLength },
    confirmPassword: {
      type: "string",
      minLength: authConfig.password.minLength,
    },
  },
  required: ["passwordToken", "password", "confirmPassword"],
  additionalProperties: false,
})


/** @type {import("fastify").RouteOptions} */
export const setFirstPassword = {
  url: "/user/configure",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("json-schema-to-ts").FromSchema<typeof bodySchema>} */ (req.body)

    if (body.password !== body.confirmPassword) {
      throw BadRequestException("Password confirmation failed")
    }

    const userId = await AuthService.validateFirstPasswordToken(
      body.passwordToken,
    )

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        password: true,
      },
    })

    if (!user) {
      logger.warn({ userId }, "non-existent userId in password token")
      throw BadRequestException("Invalid passwordToken provided")
    }

    if (user.password) {
      logger.info({ userId }, "trying to configure already configured account")
      throw BadRequestException("User account already configured")
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
      message: "Account configured successfully",
    }
  },
}
