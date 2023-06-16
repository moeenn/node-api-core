import {
  AuthException,
  BadRequestException,
} from "#src/core/exceptions/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { bodySchema } from "./resetForgottenPassword.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const resetForgottenPassword = {
  url: "/forgot-password/reset-password",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body =
      /** @type {import("./resetForgottenPassword.schema.mjs").Body} */ (
        req.body
      )

    if (body.password !== body.confirmPassword) {
      throw BadRequestException("Password confirmation failed")
    }

    const userId = await AuthService.validatePasswordResetToken(body.token)
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user)
      throw AuthException("Cannot reset password", {
        userId,
        message: "id of non-existent user in json token",
      })

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
