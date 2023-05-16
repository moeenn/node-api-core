import { authConfig } from "@/app/config"
import { db } from "@/core/database"
import { AuthException, BadRequestException } from "@/core/exceptions"
import { Password } from "@/core/helpers"
import { logger } from "@/core/server/logger"
import { validateToken } from "@/core/server/middleware"
import { RouteOptions } from "fastify"
import { FromSchema } from "json-schema-to-ts"

const bodySchema = {
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
} as const

type Body = FromSchema<typeof bodySchema>

export const updatePassword: RouteOptions = {
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
    const body = req.body as Body
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
