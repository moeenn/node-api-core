import { authConfig } from "#src/app/config/authConfig.mjs"

export const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: authConfig.password.minLength },
  },
  required: ["email", "password"],
  additionalProperties: false,
})

/** @typedef {import("json-schema-to-ts").FromSchema<typeof bodySchema>} Body */
