import { RouteOptions } from "fastify"
import { authConfig } from "@/app/config"
import { FromSchema } from "json-schema-to-ts"
import { AuthService } from "@/core/services/AuthService"
import { db } from "@/core/database"
import { Password } from "@/core/helpers"
import { logger } from "@/core/server/logger"
import { BadRequestException } from "@/core/exceptions"

const bodySchema = {
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
} as const

type Body = FromSchema<typeof bodySchema>

export const setFirstPassword: RouteOptions = {
  url: "/user/configure",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = req.body as Body

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
