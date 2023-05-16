import { RouteOptions } from "fastify"
import { Password } from "@/core/helpers"
import { FromSchema } from "json-schema-to-ts"
import { authConfig } from "@/app/config"

const bodySchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
} as const

type Body = FromSchema<typeof bodySchema>

export const passwordStrengthCheck: RouteOptions = {
  url: "/password-strength",
  method: "POST",
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = req.body as Body

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
