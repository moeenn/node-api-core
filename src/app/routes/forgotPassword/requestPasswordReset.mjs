import { db } from "#src/core/database/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { ForgotPasswordEmail } from "#src/app/emails/forgotPasswordEmail.mjs"
import { EmailService } from "#src/core/email/index.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
})


/** @type {import("fastify").RouteOptions} */
export const requestPasswordReset = {
  url: "/forgot-password/request-reset",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("json-schema-to-ts").FromSchema<typeof bodySchema>} */ (req.body)

    const user = await db.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      logger.info(
        { email: body.email },
        "password reset request for non-existent user",
      )
      return {
        message: "password reset request will be processed",
      }
    }

    const token = await AuthService.generatePasswordResetToken(user.id)
    const email = new ForgotPasswordEmail({ resetToken: token })

    EmailService.instance().sendEmail(user.email, email)
    logger.info(
      { email: body.email },
      "sending forgot password (password reset) email",
    )

    return {
      message: "password reset request will be processed",
    }
  },
}
