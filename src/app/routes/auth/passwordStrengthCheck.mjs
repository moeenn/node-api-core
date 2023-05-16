/* eslint-disable-next-line no-unused-vars */
import jsonSchema from "json-schema-to-ts"

/** @typedef {import("fastify").RouteOptions} RouteOptions */
import { Password } from "#src/core/helpers/password.mjs"
import { authConfig } from "#src/app/config/authConfig.mjs"

const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
})

/** @typedef {jsonSchema.FromSchema<typeof bodySchema>} Body */

/** @type {RouteOptions} */
export const passwordStrengthCheck = {
  url: "/password-strength",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {Body} */ (req.body)

    if (body.password.length < authConfig.password.minLength) {
      return {
        strong: false,
        errors: [
          `The Password must be atleast ${authConfig.password.minLength} characters long`,
        ],
      }
    }

    const result = await Password.checkStrength(body.password)
    return {
      strong: result.strong,
      errors: result.errors,
    }
  },
}
