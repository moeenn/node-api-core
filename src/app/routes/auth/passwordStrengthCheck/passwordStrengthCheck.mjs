import { Password } from "#src/core/helpers/password.mjs"
import { authConfig } from "#src/app/config/authConfig.mjs"
import { bodySchema } from "./passwordStrengthCheck.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const passwordStrengthCheck = {
  url: "/password-strength",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body =
      /** @type {import("./passwordStrengthCheck.schema.mjs").Body} */ (
        req.body
      )

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
