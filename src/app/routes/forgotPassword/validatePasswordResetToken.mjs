/** @typedef {import("fastify").RouteOptions} RouteOptions */

/* eslint-disable-next-line no-unused-vars */
import jsonSchema from "json-schema-to-ts"
import { AuthService } from "#src/core/services/authService/index.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: ["token"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
export const validatePasswordResetToken = {
  url: "/forgot-password/validate-reset-token",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {Body} */ (req.body)
    const isValid = await AuthService.validatePasswordResetToken(body.token)

    return {
      isValid: isValid !== "",
    }
  },
}
