import { RouteOptions } from "fastify"
import { FromSchema } from "json-schema-to-ts"
import { authConfig } from "@/app/config"
import { AuthException, BadRequestException } from "@/core/exceptions"
import { AuthService } from "@/core/services/AuthService"
import { db } from "@/core/database"
import { logger } from "@/core/server/logger"
import { Password } from "@/core/helpers"

const bodySchema = {
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
} as const

type Body = FromSchema<typeof bodySchema>

export const resetForgottenPassword: RouteOptions = {
  url: "/forgot-password/reset-password",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = req.body as Body

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
