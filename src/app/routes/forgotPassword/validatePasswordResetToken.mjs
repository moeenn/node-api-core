import { AuthService } from "#src/core/services/authService/index.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: ["token"],
  additionalProperties: false,
})

/** @type {import("fastify").RouteOptions} */
export const validatePasswordResetToken = {
  url: "/forgot-password/validate-reset-token",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("json-schema-to-ts").FromSchema<typeof bodySchema>} */ (req.body)
    const isValid = await AuthService.validatePasswordResetToken(body.token)

    return {
      isValid: isValid !== "",
    }
  },
}
