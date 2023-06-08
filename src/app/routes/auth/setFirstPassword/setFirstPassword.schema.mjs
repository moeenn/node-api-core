import { authConfig } from "#src/app/config/authConfig.mjs"

export const bodySchema = /** @type {const} */ ({
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
})

/** @typedef {import("json-schema-to-ts").FromSchema<typeof bodySchema>} Body */
