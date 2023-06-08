import { AuthService } from "#src/core/services/authService/index.mjs"
import { bodySchema } from "./validatePasswordResetToken.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const validatePasswordResetToken = {
  url: "/forgot-password/validate-reset-token",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body =
      /** @type {import("./validatePasswordResetToken.schema.mjs").Body} */ (
        req.body
      )
    const isValid = await AuthService.validatePasswordResetToken(body.token)

    return {
      isValid: isValid !== "",
    }
  },
}
